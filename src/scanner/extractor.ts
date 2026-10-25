import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { parse } from '@babel/parser';
import traverseModule from '@babel/traverse';
import type { CodeEdge } from '../types.js';
import { normalize } from './walker.js';

const traverse = typeof traverseModule === 'function' ? traverseModule : traverseModule.default;
const extensions = ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.mts', '.cts'];
export async function extractImports(root: string, files: string[]): Promise<{ edges: CodeEdge[]; loc: Map<string, number> }> {
  const known = new Set(files), edges = new Map<string, CodeEdge>(), loc = new Map<string, number>();
  let goModule = '';
  try { goModule = (await readFile(path.join(root, 'go.mod'), 'utf8')).match(/^\s*module\s+([^\s]+)/m)?.[1] ?? ''; } catch { /* No Go module. */ }
  function first(candidates: string[]): string | undefined { return candidates.map(x => normalize(path.posix.normalize(normalize(x))).replace(/^\.\//, '')).find(x => known.has(x)); }
  function jsResolve(file: string, spec: string): string | undefined {
    if (!spec.startsWith('.') && !spec.startsWith('@/')) return;
    const base = spec.startsWith('@/') ? 'src/' + spec.slice(2) : path.posix.join(path.posix.dirname(file), spec);
    const remaps = /\.[cm]?js$/.test(base) ? [base.replace(/\.js$/, '.ts').replace(/\.mjs$/, '.mts').replace(/\.cjs$/, '.cts'), base.replace(/\.js$/, '.tsx')] : [];
    return first([base, ...remaps, ...extensions.map(ext => base + ext), ...extensions.map(ext => base + '/index' + ext)]);
  }
  function add(source: string, target: string | undefined, type: CodeEdge['type'] = 'import'): void {
    if (!target || source === target) return;
    const key = source + '\0' + target + '\0' + type;
    const prior = edges.get(key);
    if (prior) prior.weight += 1;
    else edges.set(key, { source, target, type, weight: 1 });
  }
  for (const file of files) {
    const text = await readFile(path.join(root, file), 'utf8');
    loc.set(file, text ? text.split(/\r?\n/).filter(line => line.trim()).length : 0);
    if (/\.[cm]?[jt]sx?$/.test(file)) {
      const bindings = new Map<string, string>();
      try {
        const ast = parse(text, { sourceType: 'unambiguous', plugins: ['typescript', 'jsx', 'decorators-legacy'], allowReturnOutsideFunction: true });
        traverse(ast, {
          ImportDeclaration(p) {
            const spec = p.node.source.value;
            add(file, jsResolve(file, spec));
            for (const binding of p.node.specifiers) bindings.set(binding.local.name, spec);
          },
          ExportNamedDeclaration(p) { if (p.node.source) add(file, jsResolve(file, p.node.source.value)); },
          ExportAllDeclaration(p) { add(file, jsResolve(file, p.node.source.value)); },
          CallExpression(p) {
            const callee = p.node.callee, arg = p.node.arguments[0];
            if (arg?.type === 'StringLiteral' && ((callee.type === 'Identifier' && callee.name === 'require') || callee.type === 'Import')) add(file, jsResolve(file, arg.value), callee.type === 'Import' ? 'dynamic' : 'import');
          }
        });
        traverse(ast, { ClassDeclaration(p) {
          const base = p.node.superClass;
          const name = base?.type === 'Identifier' ? base.name : base?.type === 'MemberExpression' && base.object.type === 'Identifier' ? base.object.name : undefined;
          if (name && bindings.has(name)) add(file, jsResolve(file, bindings.get(name)!), 'inheritance');
        } });
      } catch {
        for (const match of text.matchAll(/(?:\b(?:import|export)\s+(?:[^;'"\n]*?\s+from\s*)?|\brequire\s*\(\s*|\bimport\s*\(\s*)['"]([^'"]+)['"]/g)) add(file, jsResolve(file, match[1]), /import\s*\(/.test(match[0]) ? 'dynamic' : 'import');
      }
    } else if (file.endsWith('.py')) {
      const resolvePy = (module: string): string | undefined => {
        const dots = module.match(/^\.+/)?.[0].length ?? 0;
        const suffix = module.slice(dots).replace(/\./g, '/');
        let base = path.posix.dirname(file);
        for (let n = 1; n < dots; n++) base = path.posix.dirname(base);
        const candidates = dots ? [path.posix.join(base, suffix)] : [path.posix.join(path.posix.dirname(file), suffix), suffix];
        return first(candidates.flatMap(x => [x + '.py', x + '/__init__.py']));
      };
      for (const match of text.matchAll(/^\s*import\s+([^\n#]+)/gm)) {
        for (const part of match[1].split(',')) add(file, resolvePy(part.trim().split(/\s+as\s+/)[0]));
      }
      for (const match of text.matchAll(/^\s*from\s+([.\w]+)\s+import\s+([^\n#]+)/gm)) {
        const parent = resolvePy(match[1]);
        if (parent) add(file, parent);
        for (const part of match[2].replace(/[()]/g, '').split(',')) {
          const name = part.trim().split(/\s+/)[0];
          if (name && name !== '*') add(file, resolvePy(match[1] + (match[1].endsWith('.') ? '' : '.') + name));
        }
      }
    } else if (file.endsWith('.go') && goModule) {
      const imports: string[] = [];
      for (const match of text.matchAll(/\bimport\s*\(([\s\S]*?)\)|\bimport\s+(?:[\w.]+\s+)?"([^"\n]+)"/g)) {
        if (match[2]) imports.push(match[2]);
        else for (const quoted of match[1].matchAll(/"([^"\n]+)"/g)) imports.push(quoted[1]);
      }
      for (const spec of imports) if (spec === goModule || spec.startsWith(goModule + '/')) {
        const dir = spec.slice(goModule.length).replace(/^\//, '') || '.';
        for (const target of files) if (target.endsWith('.go') && path.posix.dirname(target) === dir) add(file, target);
      }
    } else if (file.endsWith('.rs')) {
      for (const match of text.matchAll(/\bmod\s+(\w+)\s*;/g)) {
        const dir = path.posix.dirname(file);
        const base = /(?:^|\/)(?:lib|main|mod)\.rs$/.test(file) ? dir : file.slice(0, -3);
        add(file, first([base + '/' + match[1] + '.rs', base + '/' + match[1] + '/mod.rs']));
      }
      for (const match of text.matchAll(/\buse\s+crate::([\w:]+)/g)) {
        const parts = match[1].split('::').filter(Boolean), candidates: string[] = [];
        for (let n = parts.length; n > 0; n--) { const base = 'src/' + parts.slice(0, n).join('/'); candidates.push(base + '.rs', base + '/mod.rs'); }
        add(file, first(candidates));
      }
    }
  }
  return { edges: [...edges.values()], loc };
}
