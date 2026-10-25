import type { ArchitectureGraph, CodeNode } from '../types.js';
import { LAYER_COLORS } from '../core/cluster.js';
const xml = (text: string): string => text.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[c]!);
export function renderToMermaid(graph: ArchitectureGraph): string {
  const ids = new Map(graph.nodes.map((node, i) => [node.id, 'n' + i]));
  const clusters = new Map(graph.clusters.map((cluster, i) => [cluster.id, 'c' + i]));
  const lines = ['graph LR'];
  function group(id: string, depth: number): void {
    const cluster = graph.clusters.find(item => item.id === id)!;
    const indent = '  '.repeat(depth);
    lines.push(indent + 'subgraph ' + clusters.get(id) + '["' + xml(cluster.label) + '"]');
    for (const child of graph.clusters.filter(item => item.parent === id)) group(child.id, depth + 1);
    for (const node of graph.nodes.filter(item => item.cluster === id)) lines.push(indent + '  ' + ids.get(node.id) + '["' + xml(node.id) + '"]');
    lines.push(indent + 'end');
  }
  for (const cluster of graph.clusters.filter(item => !item.parent)) group(cluster.id, 1);
  for (const edge of graph.edges) lines.push('  ' + ids.get(edge.source) + (edge.type === 'dynamic' ? ' -.-> ' : edge.type === 'inheritance' ? ' ==>|extends| ' : ' --> ') + ids.get(edge.target));
  return lines.join('\n') + '\n';
}
export function renderToSvg(graph: ArchitectureGraph): string {
  const layers: CodeNode['layer'][] = ['entry', 'business', 'unknown', 'data', 'util'];
  const positions = new Map<string, { x: number; y: number }>();
  let maxRows = 1;
  for (let col = 0; col < layers.length; col++) {
    const nodes = graph.nodes.filter(node => node.layer === layers[col]);
    maxRows = Math.max(maxRows, nodes.length);
    nodes.forEach((node, row) => positions.set(node.id, { x: 30 + col * 270, y: 90 + row * 70 }));
  }
  const width = 1390, height = maxRows * 70 + 110;
  const elements = ['<svg xmlns="http://www.w3.org/2000/svg" width="' + width + '" height="' + height + '" viewBox="0 0 ' + width + ' ' + height + '" role="img" aria-label="Repository architecture map">', '<defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0L8 4L0 8" fill="#64748b"/></marker></defs>', '<rect width="100%" height="100%" fill="#0f172a"/>'];
  layers.forEach((layer, i) => elements.push('<text x="' + (30 + i * 270) + '" y="35" fill="' + LAYER_COLORS[layer] + '" font-family="sans-serif" font-size="18">' + layer.toUpperCase() + '</text>'));
  for (const edge of graph.edges) {
    const a = positions.get(edge.source)!, b = positions.get(edge.target)!;
    elements.push('<path d="M' + (a.x + 110) + ' ' + a.y + 'L' + (b.x + 110) + ' ' + b.y + '" stroke="#64748b" stroke-opacity=".5" fill="none" marker-end="url(#arrow)"/>');
  }
  for (const node of graph.nodes) {
    const p = positions.get(node.id)!;
    elements.push('<g><title>' + xml(node.id) + '</title><rect x="' + p.x + '" y="' + (p.y - 20) + '" width="225" height="40" rx="8" fill="#172033" stroke="' + LAYER_COLORS[node.layer] + '"/><text x="' + (p.x + 10) + '" y="' + (p.y + 5) + '" fill="#e2e8f0" font-family="monospace" font-size="12">' + xml(node.label.length > 28 ? node.label.slice(0, 25) + '…' : node.label) + '</text></g>');
  }
  return elements.join('\n') + '\n</svg>\n';
}
