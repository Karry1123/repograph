import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { mkdir, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { analyzeRepository } from './api.js';
import { impactPath } from './core/graph.js';
import { renderToHtml } from './renderer/htmlTemplate.js';

const require = createRequire(import.meta.url);
const pkg = require('../../package.json') as { name: string; version: string };
export const PACKAGE_VERSION: string = pkg.version;

const MCP_UTIL_THRESHOLD = 15;

const pathField = z
  .string()
  .describe(
    'Absolute path to the repository root to scan, e.g. "/home/me/project" or "C:/dev/project". Relative paths resolve against the MCP server process working directory, which is usually not the project, so prefer absolute paths.'
  );

export function createServer(): McpServer {
  const server = new McpServer({ name: pkg.name, version: pkg.version });
  const result = (data: unknown) => ({ content: [{ type: 'text' as const, text: JSON.stringify(data, null, 2) }] });
  const failure = (error: unknown) => ({ ...result({ error: error instanceof Error ? error.message : String(error) }), isError: true });

  server.registerTool(
    'scan_repository_graph',
    {
      title: 'Scan repository architecture graph',
      description:
        'Scan a local repository and return its architecture graph as JSON: one node per source file (id, layer, cluster, in/out degree, lines of code), import edges between files, nested directory clusters, and metrics (totalFiles, totalEdges, density, couplingFactor, deadCodeCount, foldedUtilityCount). ' +
        'Use it to understand how a codebase is organised, find hub files, or feed graph data into further analysis. Use query_impact_path instead when you only need the callers of one file, and generate_architecture_html when a human wants a visual map. ' +
        'Every call performs its own fresh static scan of `path`; no prior scan is required. Reads the local filesystem only, executes nothing, and sends nothing over the network. ' +
        'Supports TypeScript/JavaScript, Python, Go and Rust; external packages are dropped, test files are excluded, and layer labels (entry/business/data/util/unknown) are filename heuristics, not semantic judgements.',
      inputSchema: {
        path: pathField,
        maxDepth: z
          .number()
          .int()
          .nonnegative()
          .default(6)
          .describe('Maximum directory nesting depth to scan below the root. Integer, default 6. Use 0 to scan only files in the root directory; raise it for deeply nested monorepos.'),
        collapseUtils: z
          .boolean()
          .default(true)
          .describe(
            `Whether to mark high fan-in utility files (more than ${MCP_UTIL_THRESHOLD} callers and at most two dependencies, or utility-like names such as utils/helpers/types/config) as folded. Boolean, default true. Folded nodes stay in the graph data with isFolded: true; set false to treat every file equally.`
          )
      },
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false }
    },
    async args => {
      try {
        return result(await analyzeRepository(args.path, { ...args, utilThreshold: MCP_UTIL_THRESHOLD }));
      } catch (error) {
        return failure(error);
      }
    }
  );

  server.registerTool(
    'generate_architecture_html',
    {
      title: 'Generate interactive architecture map (HTML)',
      description:
        'Scan a local repository and write a single self-contained HTML file with an interactive architecture map: compound boxes per directory, nodes coloured by heuristic layer, click-to-highlight callers (cyan) and dependencies (red), fuzzy search, collapsible directories and a minimap. ' +
        'Use it when a person wants to look at or share the architecture; use scan_repository_graph when you need the data as JSON, or query_impact_path for the blast radius of one file. ' +
        'Returns { success: true, filePath, nodeCount } where filePath is the absolute path of the written file, which you can open in a browser. ' +
        'Every call performs its own fresh static scan of `path`; no prior scan is required. The HTML embeds the repository file paths and graph data, so treat it as repository information when sharing. The page loads pinned Cytoscape.js libraries from a public CDN when opened; nothing else leaves the machine.',
      inputSchema: {
        path: pathField,
        outputPath: z
          .string()
          .default('./repograph.html')
          .describe('Where to write the HTML file. Default "./repograph.html". A relative value is resolved against `path` (the repository root); an absolute value is used as-is, e.g. "/tmp/arch.html". Parent directories are created.'),
        theme: z
          .enum(['dark', 'light', 'matrix'])
          .default('dark')
          .describe('Colour theme of the generated page: "dark" (slate background, default), "light", or "matrix" (black and green).')
      },
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false }
    },
    async args => {
      try {
        const graph = await analyzeRepository(args.path, { utilThreshold: MCP_UTIL_THRESHOLD });
        const filePath = path.resolve(args.path, args.outputPath);
        await mkdir(path.dirname(filePath), { recursive: true });
        await writeFile(filePath, renderToHtml(graph, { theme: args.theme }), 'utf8');
        return result({ success: true, filePath, nodeCount: graph.nodes.length });
      } catch (error) {
        return failure(error);
      }
    }
  );

  server.registerTool(
    'query_impact_path',
    {
      title: 'Query impact path (blast radius) of a file',
      description:
        'Scan a local repository and report which files would be affected by changing one file: a breadth-first search over reverse import edges. ' +
        'Returns { changedFile, directDependents, transitiveDependents: [{ id, depth }], affectedClusters, blastRadius } where depth 1 means a direct importer, affectedClusters lists the directories touched, and blastRadius counts unique affected files excluding the changed file. ' +
        'Use it before editing, renaming or deleting a file to see who depends on it; use scan_repository_graph when you need the full graph, or generate_architecture_html for a visual. ' +
        'Every call performs its own fresh static scan of `path`; no prior scan is required. If changedFile is not found, the result is an error that lists the closest matching file ids so you can retry. Static analysis only: dynamic or computed imports and custom path aliases may be missed, and external packages are not tracked.',
      inputSchema: {
        path: pathField,
        changedFile: z
          .string()
          .describe('The file whose callers you want, as a repository-relative path with forward slashes, e.g. "src/core/graph.ts" or "pkg/server/handler.go". An absolute path inside the repository is also accepted.')
      },
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false }
    },
    async args => {
      try {
        return result(impactPath(await analyzeRepository(args.path, { utilThreshold: MCP_UTIL_THRESHOLD }), args.changedFile));
      } catch (error) {
        return failure(error);
      }
    }
  );

  return server;
}

export async function startMcpServer(): Promise<McpServer> {
  const server = createServer();
  await server.connect(new StdioServerTransport());
  return server;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  startMcpServer().catch(error => {
    console.error(error);
    process.exitCode = 1;
  });
}
