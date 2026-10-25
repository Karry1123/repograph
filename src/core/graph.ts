import path from 'node:path';
import type { ArchitectureGraph, CodeEdge, CodeNode } from '../types.js';
import { classifyLayer } from './cluster.js';
import { isEntryLike, isUtility } from '../scanner/heuristics.js';
import { normalize } from '../scanner/walker.js';

export function adjacencyList(graph: ArchitectureGraph, reverse = false): Map<string, Set<string>> {
  const map = new Map(graph.nodes.map(node => [node.id, new Set<string>()]));
  for (const edge of graph.edges) map.get(reverse ? edge.target : edge.source)?.add(reverse ? edge.source : edge.target);
  return map;
}
export function buildGraph(rootPath: string, files: string[], edges: CodeEdge[], loc: Map<string, number>): ArchitectureGraph {
  const clusters = new Map<string, { id: string; label: string; parent?: string }>();
  const nodes: CodeNode[] = files.map(id => {
    const dirs = id.split('/').slice(0, -1).slice(0, 2);
    if (!dirs.length) dirs.push('(root)');
    let parent: string | undefined;
    for (let n = 1; n <= dirs.length; n++) {
      const clusterId = 'cluster:' + dirs.slice(0, n).join('/');
      clusters.set(clusterId, { id: clusterId, label: dirs[n - 1], ...(parent ? { parent } : {}) });
      parent = clusterId;
    }
    return { id, label: path.posix.basename(id), layer: 'unknown', cluster: parent!, inDegree: 0, outDegree: 0, linesOfCode: loc.get(id) ?? 0, language: /\.py$/.test(id) ? 'Python' : /\.go$/.test(id) ? 'Go' : /\.rs$/.test(id) ? 'Rust' : /\.[cm]?tsx?$/.test(id) ? 'TypeScript' : 'JavaScript' };
  });
  const graph: ArchitectureGraph = { rootPath, generatedAt: new Date().toISOString(), nodes, edges, clusters: [...clusters.values()], metrics: { totalFiles: nodes.length, totalEdges: edges.length, density: 0, couplingFactor: 0, deadCodeCount: 0, foldedUtilityCount: 0 } };
  const outgoing = adjacencyList(graph), incoming = adjacencyList(graph, true);
  for (const node of nodes) { node.inDegree = incoming.get(node.id)!.size; node.outDegree = outgoing.get(node.id)!.size; node.layer = classifyLayer(node); }
  const n = nodes.length;
  graph.metrics.density = n > 1 ? edges.length / (n * (n - 1)) : 0;
  graph.metrics.couplingFactor = n ? nodes.reduce((sum, node) => sum + node.outDegree, 0) / n : 0;
  graph.metrics.deadCodeCount = nodes.filter(node => node.inDegree === 0 && !isEntryLike(node.id)).length;
  return graph;
}
// Preserve the full edge set for utilities toggling and impact queries. Renderers
// exclude edges touching isFolded nodes from the initial main view.
export function pruneNoise(graph: ArchitectureGraph, { threshold = 12 }: { threshold?: number } = {}): ArchitectureGraph {
  for (const node of graph.nodes) node.isFolded = isUtility(node, threshold);
  graph.metrics.foldedUtilityCount = graph.nodes.filter(node => node.isFolded).length;
  return graph;
}
export function impactPath(graph: ArchitectureGraph, changedFile: string) {
  const id = normalize(path.isAbsolute(changedFile) ? path.relative(graph.rootPath, changedFile) : changedFile).replace(/^\.\//, '');
  if (!graph.nodes.some(node => node.id === id)) {
    const score = (candidate: string): number => {
      const a = id.toLowerCase(), b = candidate.toLowerCase();
      const row = Array.from({ length: b.length + 1 }, (_, i) => i);
      for (let i = 1; i <= a.length; i++) { let prev = row[0]; row[0] = i; for (let j = 1; j <= b.length; j++) { const old = row[j]; row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1)); prev = old; } }
      return row[b.length];
    };
    throw new Error('File not found: ' + id + '. Closest matching ids: ' + graph.nodes.map(node => node.id).sort((a, b) => score(a) - score(b)).slice(0, 5).join(', '));
  }
  const reverse = adjacencyList(graph, true), visited = new Set([id]), queue = [{ id, depth: 0 }], dependents: Array<{ id: string; depth: number }> = [];
  for (let i = 0; i < queue.length; i++) for (const caller of reverse.get(queue[i].id) ?? []) {
    if (!visited.has(caller)) { visited.add(caller); const item = { id: caller, depth: queue[i].depth + 1 }; queue.push(item); dependents.push(item); }
  }
  return { changedFile: id, directDependents: [...(reverse.get(id) ?? [])], transitiveDependents: dependents, affectedClusters: [...new Set(graph.nodes.filter(node => dependents.some(item => item.id === node.id)).map(node => node.cluster))], blastRadius: dependents.length };
}
