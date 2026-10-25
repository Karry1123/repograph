# RepoGraph distribution playbook

Drafts for manual submission, prepared offline. Check current submission rules and form fields before posting. Publish npm 0.1.1 with `mcpName` before submitting `server.json` to the official MCP Registry. Registry name: `io.github.Karry1123/repograph`. No directory acceptance or registry publication is implied.

## Show HN

**Title:** Show HN: RepoGraph, local architecture maps and MCP caller impact tools

**First comment:**

I built RepoGraph because flat dependency graphs became difficult to read once shared helpers connected most of the codebase. I wanted a quick way to find boundaries before changing unfamiliar code.

Run `npx repograph-cli .` with Node.js 18+ to write an interactive HTML map. It groups files by directory, folds utility candidates, and lets you inspect callers and dependencies. Double-click directories to collapse them. Three MCP tools let Claude Code or Claude Desktop scan the graph, generate HTML, and query direct and transitive callers. TypeScript/JavaScript, Python, Go, and Rust are supported through static local import analysis.

Architectural layers and import resolution are heuristics, not semantic understanding. Custom aliases, runtime loading, and language-specific build behavior can leave gaps. Blast radius means reachable callers in the scanned graph, not predicted runtime failures. Parsing runs locally without executing scanned code or sending telemetry. HTML embeds paths and graph data; pinned rendering libraries load from CDNs. Output can be ~40 KB for a small map and grows with the repository.

Source: https://github.com/Karry1123/repograph

Live demo: https://karry1123.github.io/repograph/

I'd appreciate examples where directory clustering helps you orient yourself, or where utility folding hides a relationship you need.

## Dev.to article draft

```yaml
title: How I stopped dependency graphs from turning into spiderwebs
tags: mcp, claude, typescript, opensource
published: false
```

# How I stopped dependency graphs from turning into spiderwebs

When I open an unfamiliar repository, my first questions are usually simple: where does a request enter, which modules contain the interesting logic, and what might I disturb if I change this file? A dependency graph should help. But once shared helpers connect to dozens of modules, the picture can become a spiderweb before it answers any of those questions.

I built [RepoGraph](https://github.com/Karry1123/repograph) to make that first exploration easier. It scans local imports and writes an interactive HTML architecture map. The aim is to give me a useful starting view, then let me reveal detail as I need it.

![RepoGraph directory clustering and interactive exploration](https://raw.githubusercontent.com/Karry1123/repograph/main/assets/hero-demo.gif)

### Start with a local snapshot

With Node.js 18 or newer installed, run:

```sh
npx repograph-cli .
```

The command writes `repograph.html` and prints a file URL. Open it in a browser, search for a path, and click a file to inspect its incoming callers and outgoing dependencies. There is no serving process to keep running. A small map can be ~40 KB, but the embedded graph grows with your repository.

Scanning happens locally without executing the scanned code or sending telemetry. The HTML contains file paths and graph data, so review it before sharing. Its interactive renderer loads pinned libraries from public CDNs; those resources need to be reachable when opening the map.

### Let directories provide the first boundaries

The first useful simplification is directory clustering. Instead of asking me to read every file at once, RepoGraph groups files into nested directory boundaries. Double-clicking a directory collapses it into a summary node, with external relationships routed through that summary. Expanding it brings the internal files back into view.

This works best when directories already reflect meaningful responsibilities. It does not discover a perfect architecture hidden in the code. The layer colors also come from explainable filename and directory heuristics: entry, business, data, utility, or unknown. They are navigation clues that I can question while reading the implementation.

### Fold the helpers that dominate the picture

The second simplification is utility folding. A common types file or helper can connect otherwise separate areas and overwhelm the initial view. RepoGraph identifies utility candidates using names and caller/dependency counts, then initially hides those nodes and their edges in HTML.

Folding changes the view; it does not remove those relationships from graph data or impact analysis. Use “Show utilities” when a shared helper is the thing you need to investigate. You can also start with utilities visible:

```sh
npx repograph-cli . --no-collapse-utils
```

That escape hatch matters. A shared module may be exactly where an architectural problem lives, and hiding it should remain a reversible reading choice.

### Follow callers before changing a module

Blast radius starts with a concrete question: which files depend on this file, directly or through other files? RepoGraph walks reverse import edges with breadth-first search, handles cycles, and records caller depths. The resulting affected files and directory clusters give me a checklist for further investigation.

This is graph reachability, not proof that a change breaks those callers. Conversely, a missing static edge does not prove safety. Runtime imports, custom aliases, framework conventions, macros, and language-specific build behavior can escape the resolver. TypeScript/JavaScript, Python, Go, and Rust support all have static-analysis limits.

### Give Claude the same graph

RepoGraph also runs as a stdio MCP server. For Claude Code:

```sh
claude mcp add repograph -- npx -y repograph-cli mcp
```

It exposes `scan_repository_graph`, `generate_architecture_html`, and `query_impact_path`. I can ask Claude to scan an absolute repository path, generate a map, or list the direct and transitive callers of `src/core/graph.ts` before proposing a refactor. The graph supplies structural context; reading code and running relevant tests still matter.

You can explore the [live demo](https://karry1123.github.io/repograph/) before installing anything. The project is MIT licensed. I'd welcome feedback on where clustering improves your first read and examples where folding makes the map harder to understand.

## Product Hunt

**Name:** RepoGraph

**Tagline:** Local architecture maps and MCP tools for code exploration

**Description:** Turn local imports into interactive architecture maps. Group directories, fold utility noise, and trace caller impact across TS/JS, Python, Go, and Rust. Use the CLI or three MCP tools with Claude. MIT licensed; Node.js 18+.

**First comment from maker:**

Hi, I'm Karry, the maker of RepoGraph. I wanted a dependency map I could actually read before refactoring an unfamiliar repository. Directory clusters and reversible utility folding help me start with boundaries, then inspect individual relationships.

Try `npx repograph-cli .`, or connect the stdio MCP server to Claude Code or Claude Desktop. You get tools to scan the graph, generate HTML, and query caller impact. The analysis is static and heuristic; it can miss runtime relationships and project-specific resolution rules. Parsing is local without telemetry or code execution. The HTML embeds graph data and loads pinned rendering libraries from CDNs.

Source: https://github.com/Karry1123/repograph

Demo: https://karry1123.github.io/repograph/

I'd love feedback on the collapsed view and examples of imports that need better resolution.

## Directory submissions

Generic field sets below are not verified against current forms. These describe a local stdio server; no hosted HTTP endpoint is supplied. Docker hosting needs the target repository available inside the container, with its container path passed to the tools.

### Glama — https://glama.ai/mcp/servers

- Name: RepoGraph
- One-liner: Local architecture maps and caller impact analysis for Claude.
- Description: A stdio MCP server that scans local imports, generates interactive HTML architecture maps, and queries direct and transitive callers. Directory clustering and reversible utility folding reduce visual noise. Static heuristics support TypeScript/JavaScript, Python, Go, and Rust.
- Repository URL: https://github.com/Karry1123/repograph
- npm install command: `npm install -g repograph-cli`
- Start command: `npx -y repograph-cli mcp`
- Categories: Developer tools, Code analysis, Visualization
- License: MIT
- Hosting files: `Dockerfile`, `.dockerignore`

### Smithery — https://smithery.ai

- Name: RepoGraph
- One-liner: Explore repository structure and caller impact through MCP.
- Description: Local static import analysis with tools to scan a repository graph, write an interactive HTML map, and trace caller impact. Directory clusters and utility folding help navigate TS/JS, Python, Go, and Rust projects. Heuristics can miss runtime relationships.
- Repository URL: https://github.com/Karry1123/repograph
- npm install command: `npm install -g repograph-cli`
- Start command: `npx -y repograph-cli mcp`
- Categories: Developer tools, Code intelligence, MCP
- Transport: stdio
- Configuration: Empty object; repository paths are tool arguments.
- Hosting files: `smithery.yaml`, `Dockerfile`

### PulseMCP — https://www.pulsemcp.com

- Name: RepoGraph
- One-liner: Local dependency maps and caller impact tools for code exploration.
- Description: An MIT-licensed stdio MCP server for static repository analysis. Scan local imports, generate HTML maps with directory clustering and utility folding, or query affected callers. Supports TS/JS, Python, Go, and Rust with heuristic resolution.
- Repository URL: https://github.com/Karry1123/repograph
- npm install command: `npm install -g repograph-cli`
- Start command: `npx -y repograph-cli mcp`
- Categories: Developer tools, Code analysis
- Runtime: Node.js 18+
- Demo URL: https://karry1123.github.io/repograph/

### mcp.so — https://mcp.so

- Name: RepoGraph
- One-liner: Interactive local architecture maps with three stdio MCP tools.
- Description: Scan repository graphs, generate HTML architecture maps, and query direct/transitive callers. Directory clustering and reversible utility folding aid exploration. Static local analysis supports TS/JS, Python, Go, and Rust without executing scanned code.
- Repository URL: https://github.com/Karry1123/repograph
- npm install command: `npm install -g repograph-cli`
- Start command: `npx -y repograph-cli mcp`
- Categories: Developer tools, Visualization, Code analysis
- Client configuration: See the shared JSON below.

### MCP Market — https://mcpmarket.com

- Name: RepoGraph
- One-liner: Understand repository boundaries and trace caller impact locally.
- Description: A CLI and stdio MCP server for interactive architecture maps and caller reachability. Groups files by directory and folds utility candidates. Supports TS/JS, Python, Go, and Rust via static heuristics; no repository upload or telemetry.
- Repository URL: https://github.com/Karry1123/repograph
- npm install command: `npm install -g repograph-cli`
- Start command: `npx -y repograph-cli mcp`
- Categories: Developer tools, Code intelligence, Visualization
- License: MIT
- Demo URL: https://karry1123.github.io/repograph/

### Cursor Directory — https://cursor.directory/mcp

- Name: RepoGraph
- One-liner: Repository architecture maps and caller impact through local MCP.
- Description: Three stdio tools scan local imports, write interactive HTML maps, and query caller impact. Directory clusters and utility folding make dependency graphs easier to explore. Supports TS/JS, Python, Go, and Rust; results are heuristic structural context.
- Repository URL: https://github.com/Karry1123/repograph
- npm install command: `npm install -g repograph-cli`
- Start command: `npx -y repograph-cli mcp`
- Categories: Developer tools, Code analysis, Visualization
- Client configuration: Use the shared JSON in the client's MCP configuration.

Shared client JSON:

```json
{
  "mcpServers": {
    "repograph": {
      "command": "npx",
      "args": ["-y", "repograph-cli", "mcp"]
    }
  }
}
```

## Awesome-list PR copy

Candidate placements are editorial suggestions; check current contribution rules and avoid duplicate entries. The appcypher list is archived; the punkpeye PR is already open.

### hesreallyhim/awesome-claude-code — MCP servers / tooling

- [RepoGraph](https://github.com/Karry1123/repograph) - Generate local architecture maps and trace direct and transitive callers through three MCP tools for Claude Code.

### wong2/awesome-mcp-servers

- [RepoGraph](https://github.com/Karry1123/repograph) - Explore local TypeScript/JavaScript, Python, Go, and Rust import graphs with directory clustering, utility folding, and caller impact tools.

### anvaka/awesome-code-visualization — candidate visualization list

- [RepoGraph](https://github.com/Karry1123/repograph) - Turn local import graphs into interactive HTML architecture maps with directory clusters, reversible utility folding, and caller/dependency highlighting.

## GitHub profile README / pinned repo

[RepoGraph](https://github.com/Karry1123/repograph): local architecture maps that group directories, fold utility noise, and trace caller impact. CLI + three MCP tools for Claude; TS/JS, Python, Go, and Rust. Try `npx repograph-cli .` or [open the demo](https://karry1123.github.io/repograph/).

## Discord / Slack community post

I built RepoGraph: local architecture maps with directory clustering, utility folding, and three Claude MCP tools. Static heuristics; try `npx repograph-cli .` (Node.js 18+).
Source: https://github.com/Karry1123/repograph · Demo: https://karry1123.github.io/repograph/ — feedback on graph readability welcome.
