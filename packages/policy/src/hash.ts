import { createHash } from 'node:crypto';
import type { Policy } from '@codeguard/types';
import { canonicalizeJson } from './canonicalize.js';

/**
 * Computes deterministic SHA-256 policy hash.
 * Returns 0x-prefixed 32-byte hex string (64 characters).
 */
export function hashPolicy(policy: Policy): string {
  // Normalize rules object to ensure canonical hash
  const canonicalString = canonicalizeJson({
    id: policy.id,
    version: policy.version,
    rules: {
      maxSecrets: policy.rules.maxSecrets,
      maxLicenseViolations: policy.rules.maxLicenseViolations,
      maxBlockedDependencies: policy.rules.maxBlockedDependencies,
      testsRequired: policy.rules.testsRequired,
      prohibitedLicenses: (policy.rules.prohibitedLicenses ?? []).slice().sort(),
      blockedDependencies: (policy.rules.blockedDependencies ?? []).slice().sort(),
      secretPatterns: (policy.rules.secretPatterns ?? []).slice().sort((a, b) => a.id.localeCompare(b.id)),
    }
  });

  const hash = createHash('sha256').update(canonicalString, 'utf8').digest('hex');
  return `0x${hash}`;
}
