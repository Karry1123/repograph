# Launch copy

## GitHub Release v0.1.0

**RepoGraph v0.1.0 - Zero-config Architecture Visualizer & MCP Server**

Turn a codebase into an interactive architecture map with one command:

```sh
npx repo-graph .
```

RepoGraph groups files by directory, folds common utilities, and colors likely architectural layers so the graph is easier to explore. Click a file to inspect callers and dependencies, trace its blast radius, or double-click a directory to collapse it.

- Four language families: TypeScript/JavaScript, Python, Go, and Rust.
- Three MCP tools for Claude Desktop and Claude Code: `scan_repository_graph`, `generate_architecture_html`, and `query_impact_path`.
- Single-file HTML output, around 40 KB for a small graph; size grows with the repository. No serving process is required. Browser libraries load from pinned CDNs, so the interactive HTML needs those resources available.
- Zero-telemetry local parsing: no repository upload and no execution of scanned code.
- JSON, Mermaid, and SVG exports; dark, light, and matrix themes.

Static import resolution and architectural layers are heuristic. Custom aliases, macros, and runtime imports may need manual review. HTML embeds repository paths and graph data, so review it before sharing.

[Try the zustand demo](https://karry1123.github.io/repograph/) · [Source and quickstart](https://github.com/Karry1123/repograph)

Requires Node.js 18+. MIT licensed.

## X / Twitter

Dependency graph a spiderweb? RepoGraph groups directories and folds utilities into an interactive map. TS/JS, Python, Go, Rust + 3 Claude MCP tools. Local parsing, no server.

`npx repo-graph .`

https://github.com/Karry1123/repograph

#ClaudeCode #MCP #TypeScript #OpenSource

## Reddit: r/ClaudeAI

**Title:** I built a local architecture visualizer with 3 MCP tools so Claude can inspect a repo before refactoring

**Body:**

When I explore unfamiliar code, a flat dependency graph often becomes a spiderweb: shared helpers connect everything and the useful boundaries disappear. I built RepoGraph to group files by directory and fold utility candidates, then let me expand the parts I need.

Run `npx repo-graph .` to generate an interactive HTML map. Click a file to inspect callers and dependencies; collapse a directory to see its connections at a higher level.

For Claude Code:

```sh
claude mcp add repograph -- npx -y repo-graph mcp
```

Claude gets three tools: scan the repository graph, generate the HTML map, and query direct/transitive callers of a changed file. It supports TypeScript/JavaScript, Python, Go, and Rust through static import analysis. Parsing is local with no telemetry or code execution. The HTML loads pinned rendering libraries from CDNs; graph data stays embedded in the file.

This is heuristic analysis, so runtime imports and some project-specific resolution rules can be missed. I'd welcome examples where clustering or utility folding hides something you need to see.

Source: https://github.com/Karry1123/repograph

Live zustand demo: https://karry1123.github.io/repograph/

## Reddit: r/webdev

**Title:** RepoGraph: a zero-config architecture map that groups directories and folds utilities to tame dependency spiderwebs

**Body:**

I wanted a quick way to get oriented in an unfamiliar project without setting up a service. Flat dependency graphs were difficult to read once shared helpers connected almost every module, so I built RepoGraph around directory clusters and utility folding.

```sh
npx repo-graph .
```

It writes an interactive HTML file: search paths, click files to inspect callers and dependencies, and collapse directories into summary nodes. Layer colors use filename heuristics rather than claiming to understand the design. You can also export JSON, Mermaid, or SVG.

It supports TypeScript/JavaScript, Python, Go, and Rust, plus three MCP tools for Claude. Parsing runs locally, without telemetry, repository uploads, or executing the project. A small HTML map can be around 40 KB; larger repositories produce larger files. Pinned browser libraries load from CDNs.

This first release uses static import resolution. Custom aliases, runtime loading, and language-specific build behavior have limits. I'd like feedback on whether the collapsed view helps you find architectural boundaries, and examples where it doesn't.

MIT licensed, Node.js 18+.

Source: https://github.com/Karry1123/repograph

Interactive zustand demo: https://karry1123.github.io/repograph/

## V2EX

**节点：** create / programmer（选择其中一个发布）

**标题：** 写了个 40KB 单文件代码拓扑图生成器，接手老项目看架构更直观，支持 Claude MCP 协议

接手老项目时，我经常先看目录和 import 关系，但把所有依赖都画出来，很容易变成一团蜘蛛网：几个公共工具模块就能把整张图连满。

所以做了 RepoGraph：按目录聚类，默认折叠工具模块，再用文件名规则标出入口、业务、数据等层次。双击目录可以折叠成一个汇总节点，点击文件可以查看调用方、依赖，以及沿调用链传播的影响范围。

使用方式：

```sh
npx repo-graph .
```

输出一个 HTML 文件，直接用浏览器打开，不用起服务。标题里的 40KB 是小型图的大致量级，不是固定大小；项目越大，嵌入的图数据越多。交互页面会从 CDN 加载固定版本的渲染库，因此打开时需要能访问这些资源。

目前支持四类语言：TypeScript/JavaScript、Python、Go、Rust。扫描在本地进行，不上传仓库、不采集遥测、不执行被扫描代码。HTML 中包含文件路径和关系数据，分享前请自行检查。

也支持 Claude Desktop 和 Claude Code 的 MCP：扫描架构图、生成 HTML、查询某个文件变更后的直接和间接调用方，共三个工具。

```sh
claude mcp add repograph -- npx -y repo-graph mcp
```

第一版采用静态分析和启发式规则，自定义别名、动态导入路径、宏等场景可能漏掉关系。欢迎拿真实项目试用，反馈哪些聚类有用、哪些折叠反而影响理解，也欢迎提交语言支持请求。

开源地址：https://github.com/Karry1123/repograph

在线体验（zustand）：https://karry1123.github.io/repograph/

MIT 协议，需要 Node.js 18+。

## Directory submissions

### punkpeye/awesome-mcp-servers

- [Karry1123/repograph](https://github.com/Karry1123/repograph) 📇 🏠 - Local architecture maps and caller impact analysis for TypeScript/JavaScript, Python, Go, and Rust, with directory clustering and utility folding.

### appcypher/awesome-mcp-servers

- [RepoGraph](https://github.com/Karry1123/repograph) - Generate interactive local architecture maps and query caller impact across TypeScript/JavaScript, Python, Go, and Rust repositories.

### modelcontextprotocol/servers community list

- **[RepoGraph](https://github.com/Karry1123/repograph)** - Generate local architecture maps and trace direct and transitive callers across TypeScript/JavaScript, Python, Go, and Rust codebases.
