import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { analyzeRepository } from './api.js';
import { impactPath } from './core/graph.js';
import { renderToHtml } from './renderer/htmlTemplate.js';

export function createServer(): McpServer {
  const server = new McpServer({ name: 'repograph-cli', version: '0.1.1' });
  const result = (data: unknown) => ({ content: [{ type: 'text' as const, text: JSON.stringify(data, null, 2) }] });
  const failure = (error: unknown) => ({ ...result({ error: error instanceof Error ? error.message : String(error) }), isError: true });
  server.tool('scan_repository_graph', 'Scan a local codebase into an architecture graph. Test files and external imports are excluded.', {
    path: z.string(), maxDepth: z.number().int().nonnegative().default(6), collapseUtils: z.boolean().default(true)
  }, async args => {
    try { return result(await analyzeRepository(args.path, { ...args, utilThreshold: 15 })); } catch (error) { return failure(error); }
  });
  server.tool('generate_architecture_html', 'Write a self-contained interactive architecture map of a local codebase.', {
    path: z.string(), outputPath: z.string().default('./repograph.html'), theme: z.enum(['dark', 'light', 'matrix']).default('dark')
  }, async args => {
    try {
      const graph = await analyzeRepository(args.path, { utilThreshold: 15 });
      const filePath = path.resolve(args.path, args.outputPath);
      await mkdir(path.dirname(filePath), { recursive: true });
      await writeFile(filePath, renderToHtml(graph, { theme: args.theme }), 'utf8');
      return result({ success: true, filePath, nodeCount: graph.nodes.length });
    } catch (error) { return failure(error); }
  });
  server.tool('query_impact_path', 'Find direct and transitive callers of a changed file, with BFS depths and affected clusters.', {
    path: z.string(), changedFile: z.string()
  }, async args => {
    try { return result(impactPath(await analyzeRepository(args.path, { utilThreshold: 15 }), args.changedFile)); } catch (error) { return failure(error); }
  });
  return server;
}
export async function startMcpServer(): Promise<McpServer> {
  const server = createServer();
  await server.connect(new StdioServerTransport());
  return server;
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  startMcpServer().catch(error => { console.error(error); process.exitCode = 1; });
}
