#!/usr/bin/env node
import { runServer } from './server.js';

runServer().catch((error) => {
  console.error('[CodeGuard MCP Server] Fatal error:', error);
  process.exit(1);
});
