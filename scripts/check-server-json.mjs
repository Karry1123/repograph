import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const readJson = path => JSON.parse(readFileSync(new URL(path, import.meta.url), 'utf8'));
const pkg = readJson('../package.json');
const server = readJson('../server.json');

assert.equal(server.name, 'io.github.Karry1123/repograph');
assert.equal(server.name, pkg.mcpName, 'Registry name must match package.json mcpName');
assert.equal(server.version, pkg.version, 'Registry version must match package.json');
assert.ok(server.description.length <= 100, 'Registry description must be at most 100 characters');
assert.equal(server.packages[0].identifier, pkg.name);
assert.equal(server.packages[0].version, pkg.version, 'npm package version must match package.json');
console.log(`server.json OK: ${server.name}@${server.version}`);
