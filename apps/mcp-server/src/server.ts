import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema
} from '@modelcontextprotocol/sdk/types.js';

import { handleScan } from './tools/scan.js';
import { handleAttest } from './tools/attest.js';
import { handleStatus } from './tools/status.js';
import { getDefaultPolicy, hashPolicy, loadPolicyFromFile } from '@codeguard/policy';

export function createMcpServer() {
  const server = new Server(
    {
      name: 'codeguard-mcp-server',
      version: '0.1.0'
    },
    {
      capabilities: {
        tools: {}
      }
    }
  );

  // List available CodeGuard security & attestation tools
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [
        {
          name: 'codeguard_scan',
          description: 'Run local privacy-preserving safety scan on a repository against an approved policy (secrets, licenses, blocked dependencies, tests). Code never leaves local machine.',
          inputSchema: {
            type: 'object',
            properties: {
              repoPath: {
                type: 'string',
                description: 'Path to local repository directory to scan (defaults to current working directory).'
              },
              policyPath: {
                type: 'string',
                description: 'Path to custom policy JSON file (defaults to standard enterprise-v1 policy).'
              }
            }
          }
        },
        {
          name: 'codeguard_attest',
          description: 'Scan repository locally, generate Midnight Zero-Knowledge proof of compliance, and submit confidential attestation to Midnight ledger.',
          inputSchema: {
            type: 'object',
            properties: {
              repoPath: {
                type: 'string',
                description: 'Path to local repository directory to attest.'
              },
              policyPath: {
                type: 'string',
                description: 'Path to custom policy JSON file.'
              }
            }
          }
        },
        {
          name: 'codeguard_status',
          description: 'Query public Midnight ledger for attestation status of an artifact commitment hash.',
          inputSchema: {
            type: 'object',
            properties: {
              artifactHash: {
                type: 'string',
                description: '0x-prefixed 32-byte artifact commitment hash.'
              }
            },
            required: ['artifactHash']
          }
        },
        {
          name: 'codeguard_get_policy',
          description: 'Inspect registered enterprise policy rules and compute its deterministic on-chain SHA-256 policy hash.',
          inputSchema: {
            type: 'object',
            properties: {
              policyPath: {
                type: 'string',
                description: 'Optional path to policy JSON file.'
              }
            }
          }
        }
      ]
    };
  });

  // Handle tool execution requests
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
      if (name === 'codeguard_scan') {
        const result = await handleScan((args as any) || {});
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2)
            }
          ]
        };
      }

      if (name === 'codeguard_attest') {
        const result = await handleAttest((args as any) || {});
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2)
            }
          ]
        };
      }

      if (name === 'codeguard_status') {
        const result = await handleStatus((args as any) || { artifactHash: '' });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2)
            }
          ]
        };
      }

      if (name === 'codeguard_get_policy') {
        const policy = (args as any)?.policyPath
          ? loadPolicyFromFile((args as any).policyPath)
          : getDefaultPolicy();
        const policyHash = hashPolicy(policy);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ policy, policyHash }, null, 2)
            }
          ]
        };
      }

      throw new Error(`Unknown CodeGuard MCP tool: ${name}`);
    } catch (error) {
      return {
        isError: true,
        content: [
          {
            type: 'text',
            text: `Error executing ${name}: ${error instanceof Error ? error.message : String(error)}`
          }
        ]
      };
    }
  });

  return server;
}

export async function runServer() {
  const server = createMcpServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('[CodeGuard MCP Server] Running on stdio');
}
