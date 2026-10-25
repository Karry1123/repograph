import path from 'node:path';
import { stat } from 'node:fs/promises';
import { walkRepository } from './scanner/walker.js';
import { extractImports } from './scanner/extractor.js';
import { isTestFile } from './scanner/heuristics.js';
import { buildGraph, pruneNoise } from './core/graph.js';
import type { ArchitectureGraph } from './types.js';
export interface AnalyzeOptions { maxDepth?: number; collapseUtils?: boolean; utilThreshold?: number; }
export async function analyzeRepository(directory: string, options: AnalyzeOptions = {}): Promise<ArchitectureGraph> {
  const root = path.resolve(directory);
  if (!(await stat(root)).isDirectory()) throw new Error('Repository path must be a directory: ' + root);
  const maxDepth = options.maxDepth ?? 6;
  if (!Number.isInteger(maxDepth) || maxDepth < 0) throw new Error('maxDepth must be a nonnegative integer');
  const scanned = await walkRepository(root, maxDepth);
  const testFileCount = scanned.filter(isTestFile).length;
  const files = scanned.filter(file => !isTestFile(file));
  const { edges, loc } = await extractImports(root, files);
  const graph = buildGraph(root, files, edges, loc);
  // Keep the specified public model intact while exposing the excluded count.
  Object.assign(graph.metrics, { excludedTestFiles: testFileCount });
  return options.collapseUtils === false ? graph : pruneNoise(graph, { threshold: options.utilThreshold ?? 12 });
}
