# Changelog

## v0.1.2

- MCP tools now carry titles, behaviour annotations (`readOnlyHint`, `idempotentHint`), and full descriptions that state when to use each tool, what it returns, and its limits; every input field documents its type, default, and an example value. Tool names, fields, and defaults are unchanged.
- CLI and MCP server read their version from `package.json`.

## v0.1.1

- Add MCP Registry metadata and a local metadata consistency check.
- Keep the viewport position and zoom when collapsing directory clusters.
- Add the hero demo GIF showing the interactive architecture map.

## v0.1.0

Initial release of RepoGraph, distributed as the `repograph-cli` npm package.

- Zero-config CLI with `repograph` and `repograph-cli` executable names.
- Static local import analysis for TypeScript/JavaScript, Python, Go, and Rust.
- Interactive HTML maps with directory clusters, utility folding, layer colors, search, minimap, and caller/dependency highlighting.
- Cluster collapse and expansion with external edges routed through summary nodes; automatic viewport fitting and the `f` shortcut.
- JSON, Mermaid, and SVG exports; dark, light, and matrix HTML themes.
- Three stdio MCP tools: `scan_repository_graph`, `generate_architecture_html`, and `query_impact_path`.
- Local parsing without telemetry or execution of scanned code. Interactive HTML loads pinned browser libraries from CDNs.
- Live demo, language request and bug report forms, and contribution guidance.
