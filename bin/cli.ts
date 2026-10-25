#!/usr/bin/env node
import { Command, InvalidArgumentError } from 'commander';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { analyzeRepository } from '../src/api.js';
import { renderToHtml } from '../src/renderer/htmlTemplate.js';
import { renderToMermaid, renderToSvg } from '../src/renderer/svgExport.js';
import { startMcpServer } from '../src/index.js';

const program = new Command();
program.name('repograph-cli').version('0.1.0').description('Turn a local codebase into an interactive architecture map')
  .argument('[path]', 'Repository directory', '.')
  .option('-o, --output <file>', 'Output file (HTML defaults to repograph.html)')
  .option('--theme <theme>', 'dark, light, or matrix', 'dark')
  .option('--max-depth <n>', 'Maximum directory depth', value => {
    if (!/^\d+$/.test(value)) throw new InvalidArgumentError('Expected a nonnegative integer');
    return Number(value);
  }, 6)
  .option('--no-collapse-utils', 'Show utility nodes initially')
  .option('--format <format>', 'html, json, mermaid, or svg', 'html')
  .action(async (directory: string, options: { output?: string; theme: string; maxDepth: number; collapseUtils: boolean; format: string }) => {
    if (!['dark', 'light', 'matrix'].includes(options.theme)) throw new Error('Theme must be dark, light, or matrix');
    if (!['html', 'json', 'mermaid', 'svg'].includes(options.format)) throw new Error('Format must be html, json, mermaid, or svg');
    const graph = await analyzeRepository(directory, options);
    const content = options.format === 'json' ? JSON.stringify(graph, null, 2) + '\n' : options.format === 'mermaid' ? renderToMermaid(graph) : options.format === 'svg' ? renderToSvg(graph) : renderToHtml(graph, { theme: options.theme as 'dark'|'light'|'matrix' });
    if (options.output || options.format === 'html') {
      const output = path.resolve(options.output ?? 'repograph.html');
      await mkdir(path.dirname(output), { recursive: true });
      await writeFile(output, content, 'utf8');
      if (options.format === 'html') console.log(pathToFileURL(output).href);
    } else process.stdout.write(content);
  });
program.command('mcp').description('Start the MCP stdio server').action(async () => { await startMcpServer(); });
program.parseAsync().catch(error => { console.error(error instanceof Error ? error.message : error); process.exitCode = 1; });
