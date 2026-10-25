import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import ignore from 'ignore';

export const normalize = (value: string): string => value.replace(/\\/g, '/');
const skipped = new Set('node_modules .git dist build out coverage __pycache__ .venv venv .next .nuxt target vendor .idea .vscode .cache'.split(' '));
const source = /\.(?:js|jsx|mjs|cjs|ts|tsx|mts|cts|py|go|rs)$/i;
export async function walkRepository(root: string, maxDepth = 6): Promise<string[]> {
  const files: string[] = [];
  type Rule = { base: string; matcher: ReturnType<typeof ignore> };
  async function visit(dir: string, depth: number, inherited: Rule[]): Promise<void> {
    let rules = inherited;
    try { rules = [...rules, { base: dir, matcher: ignore().add(await readFile(path.join(dir, '.gitignore'), 'utf8')) }]; }
    catch (error) { if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error; }
    const entries = await readdir(dir, { withFileTypes: true });
    entries.sort((a, b) => a.name.localeCompare(b.name));
    for (const entry of entries) {
      if (entry.isSymbolicLink()) continue;
      const absolute = path.join(dir, entry.name);
      if (entry.isDirectory() && skipped.has(entry.name)) continue;
      let ignored = false;
      for (const rule of rules) {
        const relative = normalize(path.relative(rule.base, absolute)) + (entry.isDirectory() ? '/' : '');
        const result = rule.matcher.test(relative);
        if (result.ignored) ignored = true;
        else if (result.unignored) ignored = false;
      }
      if (ignored) continue;
      if (entry.isDirectory()) { if (depth < maxDepth) await visit(absolute, depth + 1, rules); }
      else if (entry.isFile() && source.test(entry.name) && !/\.min\.js$/i.test(entry.name)) {
        if ((await stat(absolute)).size <= 1.5 * 1024 * 1024) files.push(normalize(path.relative(root, absolute)));
      }
    }
  }
  await visit(root, 0, []);
  return files;
}
