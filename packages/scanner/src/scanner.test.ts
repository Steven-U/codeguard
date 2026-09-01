import { describe, it, expect } from 'vitest';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
import { getDefaultPolicy } from '@codeguard/policy';
import { scanRepository } from './index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootRepoDir = resolve(__dirname, '../../../');

describe('Deterministic Local Scanner', () => {
  const policy = getDefaultPolicy();

  it('detects planted secrets and blocked dependencies in vulnerable demo repo', async () => {
    const vulnPath = resolve(rootRepoDir, 'demo/vulnerable-repo');
    const result = await scanRepository(vulnPath, policy);

    expect(result.isCompliant).toBe(false);
    expect(result.secretCount).toBeGreaterThanOrEqual(1);
    expect(result.blockedDependencyCount).toBeGreaterThanOrEqual(1);
    expect(result.findings.some((f) => f.type === 'secret')).toBe(true);
    expect(result.findings.some((f) => f.type === 'dependency')).toBe(true);
  });

  it('passes cleanly for compliant clean demo repo', async () => {
    const cleanPath = resolve(rootRepoDir, 'demo/clean-repo');
    const result = await scanRepository(cleanPath, policy);

    expect(result.isCompliant).toBe(true);
    expect(result.secretCount).toBe(0);
    expect(result.licenseViolationCount).toBe(0);
    expect(result.blockedDependencyCount).toBe(0);
    expect(result.testsPassed).toBe(true);
    expect(result.findings).toHaveLength(0);
  });
});
