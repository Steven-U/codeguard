import { readFileSync } from 'node:fs';
import { relative } from 'node:path';
import type { Finding, Policy } from '@codeguard/types';

export const BUILTIN_SECRET_PATTERNS = [
  { id: 'openai-key', name: 'OpenAI API Key', regex: /sk-[a-zA-Z0-9_-]{20,}/g },
  { id: 'anthropic-key', name: 'Anthropic API Key', regex: /sk-ant-[a-zA-Z0-9_-]{20,}/g },
  { id: 'aws-key', name: 'AWS Access Key', regex: /AKIA[0-9A-Z]{16}/g },
  { id: 'generic-private-key', name: 'Private Key Block', regex: /-----BEGIN (RSA|EC|OPENSSH|PRIVATE) KEY-----/g },
  { id: 'github-token', name: 'GitHub Personal Token', regex: /gh[pousr]_[A-Za-z0-9_]{36,}/g },
  { id: 'generic-secret-assignment', name: 'Hardcoded Secret Assignment', regex: /(api_key|apiKey|secret_key|private_key|auth_token)\s*=\s*["']([A-Za-z0-9_\-./+=]{16,})["']/gi },
];

export async function scanSecrets(rootDir: string, files: string[], policy: Policy): Promise<Finding[]> {
  const findings: Finding[] = [];
  const patterns = [...BUILTIN_SECRET_PATTERNS];

  // Add custom patterns from policy if configured
  if (policy.rules.secretPatterns) {
    for (const p of policy.rules.secretPatterns) {
      try {
        patterns.push({
          id: p.id,
          name: p.name,
          regex: new RegExp(p.pattern, 'g')
        });
      } catch (err) {
        console.warn(`[CodeGuard] Invalid regex pattern for ${p.id}:`, err);
      }
    }
  }

  for (const filePath of files) {
    let content: string;
    try {
      content = readFileSync(filePath, 'utf8');
    } catch {
      continue; // Binary file or unreadable
    }

    const relPath = relative(rootDir, filePath).replace(/\\/g, '/');
    const lines = content.split('\n');

    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
      const line = lines[lineIndex];

      // Skip comment indicators in non-code test mocks if marked with @codeguard-ignore
      if (line.includes('@codeguard-ignore')) {
        continue;
      }

      for (const pattern of patterns) {
        pattern.regex.lastIndex = 0;
        if (pattern.regex.test(line)) {
          findings.push({
            type: 'secret',
            severity: 'critical',
            rule: `secret-detection:${pattern.id}`,
            message: `Detected sensitive pattern '${pattern.name}' in code`,
            file: relPath,
            line: lineIndex + 1,
            snippet: line.trim().slice(0, 80) // Stored locally only
          });
        }
      }
    }
  }

  return findings;
}
