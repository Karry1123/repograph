import type { ArchitectureGraph } from '../types.js';
import { LAYER_COLORS } from '../core/cluster.js';

export function renderToHtml(graph: ArchitectureGraph, options: { theme: 'dark'|'light'|'matrix' }): string {
  const json = JSON.stringify(graph).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
  return `<!DOCTYPE html>
<html lang="en" data-theme="${options.theme}">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="dark light">
<title>RepoGraph · Architecture map</title>
<style>
:root{--bg:#0f172a;--canvas:#090d16;--panel:#111b2d;--text:#e2e8f0;--muted:#94a3b8;--line:#29364c;--accent:#22d3ee;--pink:#e879f9;--amber:#fbbf24;--shadow:0 12px 40px #0005;--incoming:#22d3ee;--outgoing:#fb7185}
[data-theme=light]{--bg:#f1f5f9;--canvas:#f8fafc;--panel:#fff;--text:#0f172a;--muted:#526277;--line:#cbd5e1;--accent:#0284c7;--pink:#a21caf;--amber:#b45309;--shadow:0 12px 40px #33415515;--incoming:#0284c7;--outgoing:#dc2626}
[data-theme=matrix]{--bg:#020802;--canvas:#000;--panel:#041004;--text:#b2ffba;--muted:#6ea879;--line:#184721;--accent:#39ff6b;--pink:#aaff88;--amber:#d5ff53;--shadow:0 12px 40px #00ff1110;--incoming:#39ff6b;--outgoing:#ff6363}
*{box-sizing:border-box}body{margin:0;height:100vh;overflow:hidden;background:var(--bg);color:var(--text);font:13px/1.5 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}button,input,select{font:inherit}button{cursor:pointer;color:var(--text);background:var(--panel);border:1px solid var(--line);border-radius:8px;padding:8px 12px;transition:background .15s,border-color .15s}button:hover{border-color:var(--accent)}button:focus-visible,input:focus-visible,select:focus-visible,a:focus-visible{outline:2px solid var(--accent);outline-offset:3px}button:disabled{opacity:.4;cursor:default}header{height:72px;display:flex;align-items:center;gap:24px;padding:0 24px;border-bottom:1px solid var(--line);position:relative;z-index:3;background:var(--bg)}.brand{display:flex;align-items:center;gap:10px;white-space:nowrap}.logo{display:grid;place-items:center;background:var(--accent);color:var(--canvas);width:32px;height:32px;border-radius:9px;font-size:21px;font-weight:800}.brand strong{font-size:18px;letter-spacing:-.6px}.version{font:10px monospace;color:var(--muted);border:1px solid var(--line);padding:2px 5px;border-radius:4px}.metrics{display:flex;align-items:center;gap:0;margin:auto;border:1px solid var(--line);background:var(--panel);border-radius:24px;overflow:hidden}.metric{padding:7px 17px;border-right:1px solid var(--line);white-space:nowrap}.metric:last-child{border:0}.metric b{margin-right:5px;font-variant-numeric:tabular-nums}.metric span{font-size:11px;color:var(--muted)}.metric.warning b{color:var(--amber)}.header-actions{display:flex;gap:8px;align-items:center}select{background:var(--panel);color:var(--text);border:1px solid var(--line);border-radius:8px;padding:8px}.workspace{height:calc(100vh - 72px);position:relative;display:flex}#cy{position:absolute;inset:0 320px 0 0;background:var(--canvas)}.toolbar{position:absolute;left:22px;top:22px;display:flex;gap:8px;align-items:center;z-index:2}.search-wrap{position:relative}.search-wrap:before{content:'⌕';position:absolute;left:12px;top:4px;font-size:24px;color:var(--muted)}#search{background:var(--panel);border:1px solid var(--line);color:var(--text);width:280px;padding:11px 52px 11px 38px;border-radius:10px;box-shadow:var(--shadow)}#search::placeholder{color:var(--muted)}.key{position:absolute;right:10px;top:11px;font:11px monospace;color:var(--muted);border:1px solid var(--line);padding:0 4px;border-radius:3px}.search-results{position:absolute;top:51px;left:0;background:var(--panel);border:1px solid var(--line);border-radius:10px;box-shadow:var(--shadow);width:350px;max-height:320px;overflow:auto;display:none}.search-results.open{display:block}.search-result{display:block;text-align:left;border:0;border-radius:0;width:100%;padding:10px 13px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font:11px/1.6 monospace}.search-result:hover{background:var(--bg);color:var(--accent)}.search-caption{padding:8px 13px;color:var(--muted);font-size:11px;border-bottom:1px solid var(--line)}.controls{display:flex;gap:6px}.controls button{box-shadow:var(--shadow);height:41px}.utilities{position:absolute;left:22px;top:79px;display:flex;gap:9px;align-items:center;background:var(--panel);padding:8px 12px;border:1px solid var(--line);border-radius:9px;color:var(--muted);font-size:12px;z-index:2;box-shadow:var(--shadow);cursor:pointer}.utilities input{accent-color:var(--accent);margin:0}.utilities strong{color:var(--text);font-size:11px;background:var(--bg);padding:0 5px;border-radius:4px}.legend{position:absolute;left:22px;bottom:42px;background:var(--panel);border:1px solid var(--line);border-radius:10px;padding:13px 15px;box-shadow:var(--shadow);z-index:2;min-width:165px}.eyebrow{text-transform:uppercase;font-size:10px;letter-spacing:1.5px;color:var(--muted);margin-bottom:10px}.legend-row{display:flex;align-items:center;gap:9px;margin-top:7px;font-size:12px}.dot{width:9px;height:9px;border-radius:50%;display:inline-block;flex-shrink:0}.legend-row small{margin-left:auto;color:var(--muted);font-variant-numeric:tabular-nums}.legend-separator{border-top:1px solid var(--line);margin:12px 0 8px}.line-key{display:inline-block;width:16px;height:2px;background:var(--muted)}.line-key.in{background:var(--incoming)}.line-key.out{background:var(--outgoing)}#sidebar{position:absolute;right:0;top:0;bottom:0;width:320px;background:var(--bg);border-left:1px solid var(--line);overflow:auto;z-index:3}.side-top{padding:22px;border-bottom:1px solid var(--line)}.side-title{font-size:15px;font-weight:650;margin:0 0 7px}.side-sub{color:var(--muted);font-size:12px;margin:0}.side-body{padding:22px}.empty-icon{width:56px;height:56px;display:grid;place-items:center;margin:24px 0 20px;border-radius:15px;border:1px solid var(--line);color:var(--accent);font-size:26px}.empty-title{font-size:17px;font-weight:600}.hint{color:var(--muted);font-size:12px;line-height:1.8}.hint-list{padding-left:17px;color:var(--muted);font-size:12px;line-height:1.9}.hint-list li{padding:3px 0}.repo-path{font:11px/1.7 monospace;overflow-wrap:anywhere;color:var(--muted);margin-top:20px;padding-top:15px;border-top:1px solid var(--line)}.file-path{font:12px/1.8 monospace;overflow-wrap:anywhere;margin:0 0 15px}.badge{display:inline-flex;align-items:center;gap:6px;font-size:11px;padding:3px 8px;border-radius:6px;background:var(--panel);border:1px solid var(--line);margin:0 5px 5px 0}.stats-grid{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin:18px 0}.stat-card{padding:12px;background:var(--panel);border:1px solid var(--line);border-radius:9px}.stat-card b{font-size:20px;display:block;font-weight:600;line-height:1.3}.stat-card span{font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.8px}.detail-heading{font-size:11px;text-transform:uppercase;letter-spacing:1px;margin:22px 0 10px;color:var(--muted);display:flex;justify-content:space-between}.file-list{display:flex;flex-direction:column;gap:5px}.file-link{display:flex;align-items:center;gap:8px;text-align:left;width:100%;font:11px/1.6 monospace;padding:7px 9px;border-radius:6px;overflow-wrap:anywhere}.file-link span:last-child{min-width:0;overflow-wrap:anywhere}.no-items{color:var(--muted);font-size:12px;font-style:italic}.selection-note{padding:10px 12px;border-left:2px solid var(--accent);background:var(--panel);color:var(--muted);font-size:11px;margin-top:18px;line-height:1.8}.radar{position:absolute;right:340px;bottom:42px;width:190px;height:135px;border:1px solid var(--line);border-radius:10px;background:var(--panel);box-shadow:var(--shadow);z-index:2;overflow:hidden}.radar-label{position:absolute;left:10px;top:7px;font-size:9px;letter-spacing:1.5px;color:var(--muted);pointer-events:none}.radar canvas{width:100%;height:100%;cursor:crosshair}.statusbar{position:absolute;bottom:0;left:0;right:320px;height:27px;border-top:1px solid var(--line);background:var(--bg);display:flex;align-items:center;gap:18px;padding:0 18px;color:var(--muted);font:10px monospace;z-index:2}.statusbar .spacer{flex:1}.status-indicator{display:inline-block;width:5px;height:5px;border-radius:50%;background:var(--accent);margin-right:6px}.toast{position:absolute;left:50%;bottom:46px;transform:translateX(-50%);max-width:500px;padding:10px 18px;background:var(--panel);color:var(--text);border:1px solid var(--line);border-radius:10px;box-shadow:var(--shadow);z-index:6;display:none;font-size:12px}.toast.open{display:block}.loading{position:absolute;inset:0 320px 0 0;display:grid;place-items:center;background:var(--canvas);z-index:5}.loading-card{max-width:460px;padding:28px;text-align:center}.loading-card strong{font-size:19px;display:block;margin:14px}.loading-card p{color:var(--muted);line-height:1.8}.spinner{width:32px;height:32px;border:2px solid var(--line);border-top-color:var(--accent);border-radius:50%;animation:spin 1s linear infinite;margin:auto}@keyframes spin{to{transform:rotate(360deg)}}dialog{color:var(--text);background:var(--panel);border:1px solid var(--line);border-radius:15px;padding:26px;max-width:540px;box-shadow:var(--shadow)}dialog::backdrop{background:#0008}dialog h2{margin:0 0 15px;font-size:20px}dialog p{color:var(--muted);line-height:1.8}dialog kbd{border:1px solid var(--line);border-radius:4px;padding:1px 5px;color:var(--text)}.help-row{display:flex;justify-content:space-between;gap:30px;padding:8px 0;border-bottom:1px solid var(--line)}.help-row span{color:var(--muted)}.help-close{margin-top:20px;float:right}.cluster-note{color:var(--amber);font-size:12px;padding:10px;background:var(--panel);border:1px solid var(--line);border-radius:8px;margin-top:14px}
@media(max-width:1180px){header{padding:0 16px;gap:12px}.metric{padding:7px 10px}.metric span{font-size:10px}.version{display:none}.toolbar{gap:6px;left:16px}#search{width:220px}.controls button{padding:8px}.utilities{left:16px}.brand strong{font-size:16px}}
@media(max-width:960px){.metric:nth-child(4),.metric:nth-child(5){display:none}.header-actions select{width:80px}#sidebar{width:270px}#cy,.loading{right:270px}.radar{right:286px;width:155px;height:110px}.statusbar{right:270px}.toolbar{flex-wrap:wrap;right:285px}.controls button{height:36px}.utilities{top:122px}#search{width:230px}.legend{bottom:42px;padding:10px;min-width:145px}}
@media(max-width:700px){header{height:62px;gap:8px}.brand strong{font-size:14px}.logo{width:27px;height:27px;font-size:18px}.metrics{margin-left:auto;margin-right:0}.metric{padding:5px 9px}.metric:nth-child(n+3){display:none}.metric span{display:none}.header-actions select{width:70px;font-size:11px;padding:6px}.header-actions button{padding:6px 9px}.workspace{height:calc(100vh - 62px)}#sidebar{top:auto;bottom:27px;width:100%;height:190px;border-left:0;border-top:1px solid var(--line)}.side-top{padding:12px 16px}.side-body{padding:12px 16px}.side-body .empty-icon,.side-body .hint-list,.side-body .repo-path{display:none}.empty-title{font-size:14px}#cy,.loading{right:0;bottom:217px}.statusbar{right:0;font-size:9px;gap:8px}.radar{right:14px;bottom:232px;width:135px;height:95px}.legend{bottom:232px;font-size:10px;min-width:120px;padding:9px}.legend .legend-separator,.legend .chain-key{display:none}.legend-row{font-size:10px;margin-top:4px}.toolbar{right:14px;left:14px;top:14px;flex-wrap:nowrap}#search{width:190px;padding-right:12px}.search-wrap .key{display:none}.search-results{width:280px}.utilities{top:68px;left:14px}.controls{margin-left:auto}.controls button{font-size:11px}.stats-grid{grid-template-columns:repeat(4,1fr);margin:12px 0}.stat-card{padding:8px}.stat-card b{font-size:16px}.toast{bottom:225px;width:80%}}
@media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
</style>
</head>
<body>
<header>
 <div class="brand"><div class="logo" aria-hidden="true">⌘</div><strong>repograph</strong><span class="version">v0.1.0</span></div>
 <div class="metrics" aria-label="Repository metrics" id="metrics"></div>
 <div class="header-actions"><select id="theme" aria-label="Color theme"><option value="dark">Dark</option><option value="light">Light</option><option value="matrix">Matrix</option></select><button id="help-button" aria-label="Help and keyboard shortcuts">?</button></div>
</header>
<main class="workspace">
 <div id="cy" role="application" aria-label="Interactive repository architecture graph"></div>
 <div class="toolbar"><div class="search-wrap"><label for="search" hidden>Find files</label><input id="search" autocomplete="off" spellcheck="false" placeholder="Find a file or path…"><span class="key">/</span><div class="search-results" id="search-results"></div></div><div class="controls"><button id="relayout" title="Run force-directed layout again">Re-layout</button><button id="fit" title="Fit visible graph (F)">Fit</button></div></div>
 <label class="utilities"><input type="checkbox" id="show-utils">Show utilities <strong id="folded-count">0</strong></label>
 <div class="legend"><div class="eyebrow">Architecture layers</div><div id="layer-legend"></div><div class="legend-separator"></div><div class="legend-row chain-key"><span class="line-key in"></span>Incoming callers</div><div class="legend-row chain-key"><span class="line-key out"></span>Outgoing dependencies</div></div>
 <aside id="sidebar" aria-label="File inspector"><div class="side-top"><h1 class="side-title">Architecture explorer</h1><p class="side-sub">Follow the connections in your code.</p></div><div class="side-body" id="details"></div></aside>
 <div class="radar"><span class="radar-label">OVERVIEW</span><canvas id="minimap" aria-label="Graph overview; click to pan"></canvas></div>
 <footer class="statusbar"><span><i class="status-indicator"></i><span id="status">Preparing graph</span></span><span id="zoom">100%</span><span class="spacer"></span><span id="generated"></span><span>LOCAL SNAPSHOT</span></footer>
 <div id="loading" class="loading"><div class="loading-card"><div class="spinner"></div><strong>Mapping your codebase</strong><p id="loading-message">Loading the graph engine and arranging your architecture…</p></div></div>
 <div id="toast" class="toast" role="status" aria-live="polite"></div>
</main>
<dialog id="help"><h2>Explore your architecture</h2><p>Each dot is a source file. Arrows point from a caller to its dependency. Boxes group files by their first two directory levels.</p><div class="help-row"><span>Search file paths</span><kbd>/</kbd></div><div class="help-row"><span>Fit visible graph</span><kbd>F</kbd></div><div class="help-row"><span>Reset selection and search</span><kbd>Esc</kbd></div><div class="help-row"><span>Inspect dependencies and callers</span><kbd>Click a file</kbd></div><div class="help-row"><span>Collapse or expand a directory</span><kbd>Double-click a box</kbd></div><p>Cyan shows the incoming caller chain. Red shows the outgoing dependency chain. A file can belong to both chains when imports form a cycle. Dead-code warnings are heuristic: framework entry points and dynamically loaded modules may have no static callers.</p><p>Utilities remain part of the saved graph and impact queries. Use the utilities toggle to reveal them. This page uses a frozen scan; run RepoGraph again to refresh it.</p><button class="help-close" id="help-close">Got it</button></dialog>
<script id="graph-data" type="application/json">${json}</script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/cytoscape/3.30.4/cytoscape.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/layout-base@2.0.1/layout-base.js"></script>
<script src="https://cdn.jsdelivr.net/npm/cose-base@2.2.0/cose-base.js"></script>
<script src="https://cdn.jsdelivr.net/npm/cytoscape-fcose@2.2.0/cytoscape-fcose.js"></script>
<script>
(() => {
 'use strict';
 const graph = JSON.parse(document.getElementById('graph-data').textContent);
 const colors = ${JSON.stringify(LAYER_COLORS)};
 const $ = id => document.getElementById(id);
 const nodesById = new Map(graph.nodes.map(node => [node.id, node]));
 const clustersById = new Map(graph.clusters.map(cluster => [cluster.id, cluster]));
 const incoming = new Map(graph.nodes.map(node => [node.id, new Set()]));
 const outgoing = new Map(graph.nodes.map(node => [node.id, new Set()]));
 graph.edges.forEach(edge => { incoming.get(edge.target)?.add(edge.source); outgoing.get(edge.source)?.add(edge.target); });
 const collapsed = new Set();
 let selectedId = null;
 let cy, layout, radarTransform, framePending = false, toastTimer;
 const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const css = name => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
 const element = (tag, className, text) => { const el = document.createElement(tag); if (className) el.className = className; if (text !== undefined) el.textContent = text; return el; };
 function toast(message) { $('toast').textContent = message; $('toast').classList.add('open'); clearTimeout(toastTimer); toastTimer = setTimeout(() => $('toast').classList.remove('open'), 3000); }
 function metric(value, label, warning) { const item = element('div', 'metric' + (warning ? ' warning' : '')); item.append(element('b', '', String(value)), element('span', '', label)); $('metrics').append(item); }
 metric(graph.metrics.totalFiles, 'Total files'); metric(graph.metrics.totalEdges, 'Edges'); metric(graph.metrics.couplingFactor.toFixed(2), 'Coupling factor'); metric(graph.metrics.deadCodeCount, 'Dead-code warnings', true); metric(graph.metrics.foldedUtilityCount, 'Folded utilities');
 $('folded-count').textContent = graph.metrics.foldedUtilityCount;
 $('generated').textContent = new Date(graph.generatedAt).toLocaleString();
 $('theme').value = document.documentElement.dataset.theme;
 for (const [layer, color] of Object.entries(colors)) {
   const row = element('div', 'legend-row'); const dot = element('span', 'dot'); dot.style.background = color;
   row.append(dot, element('span', '', layer.charAt(0).toUpperCase() + layer.slice(1)), element('small', '', String(graph.nodes.filter(node => node.layer === layer).length)));
   $('layer-legend').append(row);
 }
 function emptyInspector() {
   $('details').replaceChildren();
   $('details').append(element('div', 'empty-icon', '◎'), element('div', 'empty-title', 'Find the center of change'), element('p', 'hint', 'Select a source file to trace its callers, dependencies, and blast radius.'));
   const list = element('ul', 'hint-list');
   ['Search uses subsequence matching across full paths.', 'Double-click a directory to collapse its contents.', 'Drag nodes to arrange your map; scroll to zoom.', 'Click the background to clear a selection.'].forEach(text => list.append(element('li', '', text)));
   $('details').append(list, element('div', 'repo-path', graph.rootPath + '\\n' + graph.nodes.length + ' source files · ' + (graph.metrics.excludedTestFiles || 0) + ' test files excluded'));
 }
 emptyInspector();
 if (typeof cytoscape === 'undefined') { $('loading-message').textContent = 'The CDN graph engine could not load. Connect to the internet and reopen this file. All repository data is embedded in this HTML.'; document.querySelector('.spinner').style.display = 'none'; return; }
 function styleSheet() {
   return [
     { selector: 'node.file', style: { 'background-color': 'data(color)', 'label': 'data(label)', 'color': css('--text'), 'font-size': 10, 'font-family': 'system-ui, sans-serif', 'text-valign': 'bottom', 'text-margin-y': 7, 'text-outline-color': css('--canvas'), 'text-outline-width': 2, 'width': 'data(size)', 'height': 'data(size)', 'border-width': 1.5, 'border-color': 'data(color)', 'border-opacity': .3, 'background-opacity': .9, 'overlay-opacity': 0, 'min-zoomed-font-size': 5 } },
     { selector: 'node.cluster', style: { 'shape': 'round-rectangle', 'background-color': css('--panel'), 'background-opacity': .24, 'border-width': 1, 'border-color': css('--line'), 'border-style': 'solid', 'label': 'data(label)', 'color': css('--muted'), 'font-size': 12, 'font-weight': 600, 'text-valign': 'top', 'text-halign': 'left', 'text-margin-x': 12, 'text-margin-y': 9, 'padding': 28, 'compound-sizing-wrt-labels': 'include', 'overlay-opacity': 0 } },
     { selector: 'node.meta', style: { 'shape': 'round-rectangle', 'width': 125, 'height': 48, 'background-color': css('--panel'), 'background-opacity': 1, 'border-color': css('--accent'), 'border-width': 1.5, 'label': 'data(label)', 'color': css('--text'), 'font-size': 11, 'text-wrap': 'wrap', 'text-valign': 'center', 'text-halign': 'center', 'text-margin-y': 0 } },
     { selector: 'edge', style: { 'curve-style': 'bezier', 'width': 1.2, 'line-color': css('--muted'), 'target-arrow-color': css('--muted'), 'target-arrow-shape': 'triangle', 'arrow-scale': .65, 'opacity': .4, 'overlay-opacity': 0 } },
     { selector: 'edge[type = "dynamic"]', style: { 'line-style': 'dashed' } },
     { selector: 'edge[type = "inheritance"]', style: { 'width': 2.2, 'target-arrow-shape': 'triangle-backcurve' } },
     { selector: '.dim', style: { 'opacity': .15 } },
     { selector: '.search-dim', style: { 'opacity': .15 } },
     { selector: 'node.incoming', style: { 'background-color': css('--incoming'), 'border-color': css('--incoming'), 'opacity': 1 } },
     { selector: 'edge.incoming', style: { 'line-color': css('--incoming'), 'target-arrow-color': css('--incoming'), 'width': 2, 'opacity': .9 } },
     { selector: 'node.outgoing', style: { 'background-color': css('--outgoing'), 'border-color': css('--outgoing'), 'opacity': 1 } },
     { selector: 'edge.outgoing', style: { 'line-color': css('--outgoing'), 'target-arrow-color': css('--outgoing'), 'width': 2, 'opacity': .9 } },
     { selector: 'node.focus', style: { 'border-width': 4, 'border-color': css('--text'), 'background-color': css('--accent'), 'width': 30, 'height': 30, 'font-weight': 700, 'font-size': 12, 'opacity': 1 } },
     { selector: '.hidden', style: { 'display': 'none' } }
   ];
 }
 const elements = graph.clusters.map(cluster => ({ data: { id: cluster.id, label: cluster.label, ...(cluster.parent ? { parent: cluster.parent } : {}) }, classes: 'cluster' }));
 graph.nodes.forEach(node => elements.push({ data: { ...node, parent: node.cluster, color: colors[node.layer], size: Math.min(28, 14 + Math.sqrt(node.inDegree + node.outDegree) * 2) }, classes: 'file' }));
 graph.edges.forEach((edge, i) => elements.push({ data: { ...edge, id: 'edge:' + i } }));
 cy = cytoscape({ container: $('cy'), elements, style: styleSheet(), layout: { name: 'preset' }, wheelSensitivity: .2, minZoom: .03, maxZoom: 4, boxSelectionEnabled: false, autounselectify: true });
 function clusterContains(clusterId, node) {
   let current = node.cluster;
   while (current) { if (current === clusterId) return true; current = clustersById.get(current)?.parent; }
   return false;
 }
 function visibleRepresentative(nodeId) {
   const node = nodesById.get(nodeId); if (!node || (node.isFolded && !$('show-utils').checked)) return null;
   let current = node.cluster, representative = nodeId;
   while (current) { if (collapsed.has(current)) representative = 'meta:' + current; current = clustersById.get(current)?.parent; }
   return representative;
 }
 function refreshVisibility() {
   cy.batch(() => {
     cy.elements('.meta, .meta-edge').remove();
     cy.elements().removeClass('hidden');
     graph.nodes.forEach(node => { if (visibleRepresentative(node.id) !== node.id) cy.getElementById(node.id).addClass('hidden'); });
     for (const cluster of graph.clusters) {
       let ancestor = cluster.parent, hidden = collapsed.has(cluster.id);
       while (ancestor) { hidden = hidden || collapsed.has(ancestor); ancestor = clustersById.get(ancestor)?.parent; }
       if (hidden) cy.getElementById(cluster.id).addClass('hidden');
     }
     for (const id of collapsed) {
       const cluster = clustersById.get(id); let ancestor = cluster.parent, obscured = false;
       while (ancestor) { if (collapsed.has(ancestor)) obscured = true; ancestor = clustersById.get(ancestor)?.parent; }
       if (obscured) continue;
       const children = graph.nodes.filter(node => clusterContains(id, node) && (!node.isFolded || $('show-utils').checked));
       if (!children.length) continue;
       const source = cy.getElementById(id); const position = source.position();
       cy.add({ data: { id: 'meta:' + id, clusterId: id, label: cluster.label + '\\n' + children.length + ' files', ...(cluster.parent ? { parent: cluster.parent } : {}) }, classes: 'meta', position: { x: position.x || 0, y: position.y || 0 } });
     }
     const metaEdges = new Set();
     graph.edges.forEach((edge, i) => {
       const a = visibleRepresentative(edge.source), b = visibleRepresentative(edge.target);
       if (a !== edge.source || b !== edge.target) cy.getElementById('edge:' + i).addClass('hidden');
       if (!a || !b || a === b || (a === edge.source && b === edge.target)) return;
       const key = a + '\\0' + b;
       if (!metaEdges.has(key) && cy.getElementById(a).length && cy.getElementById(b).length) { metaEdges.add(key); cy.add({ data: { id: 'meta-edge:' + i, source: a, target: b, type: edge.type }, classes: 'meta-edge' }); }
     });
     // Hide empty compound boxes after utility filtering.
     [...graph.clusters].reverse().forEach(cluster => { const el = cy.getElementById(cluster.id); if (!el.descendants().nodes().filter(n => !n.hasClass('cluster') && !n.hasClass('hidden')).length) el.addClass('hidden'); });
   });
   if (selectedId) highlight(selectedId);
   applySearch(); updateStatus(); scheduleRadar();
 }
 function runLayout() {
   if (layout) layout.stop();
   $('relayout').disabled = true;
   const visible = cy.elements().filter(el => !el.hasClass('hidden'));
   const useFcose = typeof cytoscapeFcose !== 'undefined';
   layout = visible.layout({ name: useFcose ? 'fcose' : 'cose', quality: 'default', animate: false, randomize: true, fit: true, padding: 65, nodeDimensionsIncludeLabels: true, nodeRepulsion: () => 6500, idealEdgeLength: () => 95, edgeElasticity: () => .35, gravity: .22, numIter: 2000, tile: true, packComponents: true, stop: () => { $('relayout').disabled = false; $('loading').style.display = 'none'; scheduleRadar(); updateStatus(); } });
   try { layout.run(); } catch (error) { $('relayout').disabled = false; $('loading').style.display = 'none'; visible.layout({ name: 'grid', fit: true, padding: 65 }).run(); toast('Force layout unavailable; showing a grid.'); console.error(error); }
 }
 function chain(start, adjacency) {
   const visited = new Set([start]), queue = [start];
   for (let i = 0; i < queue.length; i++) for (const id of adjacency.get(queue[i]) || []) if (!visited.has(id)) { visited.add(id); queue.push(id); }
   return visited;
 }
 function highlight(id) {
   cy.elements().removeClass('dim incoming outgoing focus');
   const callers = chain(id, incoming), dependencies = chain(id, outgoing);
   cy.elements().not('.cluster').addClass('dim');
   function mark(ids, name) {
     ids.forEach(key => { const rep = visibleRepresentative(key); if (rep) cy.getElementById(rep).removeClass('dim').addClass(name); });
     cy.edges().forEach(edge => { const data = edge.data(); if (ids.has(data.source) && ids.has(data.target)) edge.removeClass('dim').addClass(name); });
   }
   mark(callers, 'incoming'); mark(dependencies, 'outgoing');
   const rep = visibleRepresentative(id); if (rep) cy.getElementById(rep).removeClass('dim').addClass('focus');
   scheduleRadar();
 }
 function showNode(id, center) {
   const node = nodesById.get(id); if (!node) return;
   selectedId = id; highlight(id); inspector(node);
   if (center) { const rep = visibleRepresentative(id); if (rep) cy.animate({ center: { eles: cy.getElementById(rep) }, duration: reducedMotion ? 0 : 250 }); else toast('This utility is folded. Enable Show utilities to reveal it.'); }
 }
 function inspector(node) {
   const details = $('details'); details.replaceChildren();
   details.append(element('p', 'file-path', node.id));
   const badge = element('span', 'badge'); const dot = element('span', 'dot'); dot.style.background = colors[node.layer]; badge.append(dot, document.createTextNode(node.layer)); details.append(badge, element('span', 'badge', node.language || 'Source'));
   const grid = element('div', 'stats-grid');
   [[node.inDegree, 'Callers'], [node.outDegree, 'Dependencies'], [node.linesOfCode, 'LOC'], [chain(node.id, incoming).size - 1, 'Blast radius']].forEach(([value, label]) => { const card = element('div', 'stat-card'); card.append(element('b', '', String(value)), element('span', '', label)); grid.append(card); });
   details.append(grid);
   details.append(element('div', 'hint', 'Cluster: ' + node.cluster.replace(/^cluster:/, '')));
   if (node.isFolded) details.append(element('div', 'cluster-note', 'Utility candidate · folded until Show utilities is enabled.'));
   if (!node.inDegree) details.append(element('div', 'selection-note', node.layer === 'entry' ? 'Entry-like file · no static callers.' : 'No static callers found. This may be unused code or an implicit runtime entry point.'));
   function fileList(title, ids) {
     const heading = element('div', 'detail-heading'); heading.append(element('span', '', title), element('span', '', String(ids.size))); details.append(heading);
     const list = element('div', 'file-list');
     [...ids].sort().forEach(id => { const target = nodesById.get(id); const button = element('button', 'file-link'); const dot = element('span', 'dot'); dot.style.background = colors[target.layer]; button.append(dot, element('span', '', id)); button.addEventListener('click', () => showNode(id, true)); list.append(button); });
     if (!ids.size) list.append(element('div', 'no-items', 'None found'));
     details.append(list);
   }
   fileList('Incoming callers', incoming.get(node.id)); fileList('Dependencies', outgoing.get(node.id));
   details.append(element('div', 'selection-note', 'Highlight follows the full transitive graph. Sidebar lists direct connections. Red = dependency chain; cyan = caller chain.'));
 }
 function reset() { selectedId = null; cy.elements().removeClass('dim incoming outgoing focus'); emptyInspector(); scheduleRadar(); }
 function fuzzy(query, value) { let index = 0; for (const char of value.toLowerCase()) if (char === query[index]) index++; return index === query.length; }
 function applySearch() {
   const query = $('search').value.trim().toLowerCase();
   cy.elements().removeClass('search-dim');
   const results = $('search-results'); results.replaceChildren(); results.classList.toggle('open', Boolean(query));
   if (!query) return;
   const matches = graph.nodes.filter(node => fuzzy(query, node.id));
   const matchIds = new Set(matches.map(node => node.id));
   const visibleIds = new Set(matches.map(node => visibleRepresentative(node.id)).filter(Boolean));
   cy.nodes().not('.cluster').forEach(node => { if (!visibleIds.has(node.id())) node.addClass('search-dim'); });
   cy.edges().forEach(edge => { if (!matchIds.has(edge.data('source')) && !matchIds.has(edge.data('target'))) edge.addClass('search-dim'); });
   results.append(element('div', 'search-caption', matches.length + ' matching files' + (matches.length > 25 ? ' · showing first 25' : '')));
   matches.slice(0, 25).forEach(node => { const button = element('button', 'search-result', node.id + (node.isFolded && !$('show-utils').checked ? ' (folded)' : '')); button.addEventListener('click', () => { showNode(node.id, true); results.classList.remove('open'); }); results.append(button); });
   scheduleRadar();
 }
 function toggleCluster(id) {
   if (collapsed.has(id)) collapsed.delete(id); else collapsed.add(id);
   refreshVisibility(); runLayout(); toast((collapsed.has(id) ? 'Collapsed ' : 'Expanded ') + clustersById.get(id).label);
 }
 let lastTap = { id: '', time: 0 };
 cy.on('tap', 'node', event => {
   const target = event.target, now = Date.now();
   if (target.hasClass('cluster') || target.hasClass('meta')) {
     const id = target.hasClass('meta') ? target.data('clusterId') : target.id();
     if (lastTap.id === id && now - lastTap.time < 350) { toggleCluster(id); lastTap = { id: '', time: 0 }; }
     else { lastTap = { id, time: now }; toast('Double-click to ' + (collapsed.has(id) ? 'expand ' : 'collapse ') + clustersById.get(id).label); }
   } else { showNode(target.id(), false); $('search-results').classList.remove('open'); }
 });
 cy.on('tap', event => { if (event.target === cy) { reset(); $('search-results').classList.remove('open'); } });
 function updateStatus() { $('status').textContent = cy.nodes('.file').filter(node => !node.hasClass('hidden')).length + ' files visible · ' + collapsed.size + ' collapsed'; $('zoom').textContent = Math.round(cy.zoom() * 100) + '%'; }
 function scheduleRadar() { if (framePending) return; framePending = true; requestAnimationFrame(() => { framePending = false; drawRadar(); }); }
 function drawRadar() {
   const canvas = $('minimap'), rect = canvas.getBoundingClientRect(), dpr = window.devicePixelRatio || 1;
   canvas.width = Math.round(rect.width * dpr); canvas.height = Math.round(rect.height * dpr);
   const context = canvas.getContext('2d'); context.scale(dpr, dpr); context.clearRect(0, 0, rect.width, rect.height);
   const visible = cy.nodes().filter(node => !node.hasClass('cluster') && !node.hasClass('hidden'));
   if (!visible.length) return;
   const bounds = visible.boundingBox({ includeLabels: false, includeOverlays: false }), padding = 16;
   const scale = Math.min((rect.width - padding * 2) / Math.max(bounds.w, 1), (rect.height - padding * 2 - 10) / Math.max(bounds.h, 1));
   const offsetX = (rect.width - bounds.w * scale) / 2 - bounds.x1 * scale, offsetY = (rect.height - bounds.h * scale) / 2 - bounds.y1 * scale + 6;
   radarTransform = { scale, offsetX, offsetY };
   const point = node => ({ x: node.position('x') * scale + offsetX, y: node.position('y') * scale + offsetY });
   context.strokeStyle = css('--muted'); context.globalAlpha = .18; context.lineWidth = .6;
   cy.edges().filter(edge => !edge.hasClass('hidden')).forEach(edge => { const a = point(edge.source()), b = point(edge.target()); context.beginPath(); context.moveTo(a.x, a.y); context.lineTo(b.x, b.y); context.stroke(); });
   visible.forEach(node => { const p = point(node); context.globalAlpha = node.hasClass('dim') || node.hasClass('search-dim') ? .2 : .9; context.fillStyle = node.hasClass('focus') ? css('--text') : node.data('color') || css('--accent'); context.beginPath(); context.arc(p.x, p.y, node.hasClass('focus') ? 2.7 : 1.8, 0, Math.PI * 2); context.fill(); });
   const extent = cy.extent(); context.globalAlpha = .8; context.strokeStyle = css('--accent'); context.lineWidth = 1;
   context.strokeRect(extent.x1 * scale + offsetX, extent.y1 * scale + offsetY, extent.w * scale, extent.h * scale); context.globalAlpha = 1;
 }
 $('minimap').addEventListener('click', event => { if (!radarTransform) return; const rect = $('minimap').getBoundingClientRect(), t = radarTransform; const x = (event.clientX - rect.left - t.offsetX) / t.scale, y = (event.clientY - rect.top - t.offsetY) / t.scale; cy.pan({ x: cy.width() / 2 - x * cy.zoom(), y: cy.height() / 2 - y * cy.zoom() }); });
 cy.on('pan zoom position layoutstop', () => { scheduleRadar(); updateStatus(); });
 new ResizeObserver(() => { cy.resize(); scheduleRadar(); }).observe($('cy'));
 $('show-utils').addEventListener('change', () => { refreshVisibility(); runLayout(); });
 $('search').addEventListener('input', applySearch);
 $('search').addEventListener('focus', applySearch);
 $('search').addEventListener('keydown', event => { if (event.key === 'Enter') { const first = $('search-results').querySelector('button'); if (first) first.click(); } });
 $('relayout').addEventListener('click', runLayout);
 function fit() { cy.fit(cy.elements().filter(el => !el.hasClass('hidden')), 65); scheduleRadar(); }
 $('fit').addEventListener('click', fit);
 $('theme').addEventListener('change', () => { document.documentElement.dataset.theme = $('theme').value; cy.style(styleSheet()); scheduleRadar(); });
 $('help-button').addEventListener('click', () => $('help').showModal());
 $('help-close').addEventListener('click', () => $('help').close());
 document.addEventListener('keydown', event => {
   const typing = /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName);
   if (event.key === '/' && !typing) { event.preventDefault(); $('search').focus(); }
   if (event.key.toLowerCase() === 'f' && !typing) fit();
   if (event.key === 'Escape') { $('search').value = ''; applySearch(); $('search').blur(); reset(); }
 });
 if (!graph.nodes.length) { $('loading').style.display = 'none'; toast('No source files found. Check the scan path, ignore rules, and maximum depth.'); }
 refreshVisibility(); if (graph.nodes.length) runLayout();
})();
</script>
</body>
</html>`;
}
