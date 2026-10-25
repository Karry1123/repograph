#!/usr/bin/env node
// Convenience entrypoint: `node dist/index.js` starts the MCP stdio server.
// Used by hosted directories (Glama, Smithery) that default to dist/index.js.
import { startMcpServer } from './src/index.js';

startMcpServer().catch((error: unknown) => {
  console.error(error instanceof Error ? error.stack ?? error.message : String(error));
  process.exit(1);
});
