import { describe, it, expect } from 'vitest';
import { getDefaultPolicy, hashPolicy, canonicalizeJson } from './index.js';

describe('Policy Canonicalization and Hashing', () => {
  it('produces deterministic canonical JSON regardless of key ordering', () => {
    const objA = { b: 2, a: 1, c: { z: 26, y: 25 } };
    const objB = { a: 1, c: { y: 25, z: 26 }, b: 2 };

    expect(canonicalizeJson(objA)).toEqual(canonicalizeJson(objB));
  });

  it('generates consistent 32-byte SHA-256 policy hash', () => {
    const policy = getDefaultPolicy();
    const hash1 = hashPolicy(policy);
    const hash2 = hashPolicy(policy);

    expect(hash1).toEqual(hash2);
    expect(hash1).toMatch(/^0x[a-f0-9]{64}$/);
  });

  it('detects policy rule changes with distinct policy hash', () => {
    const policyA = getDefaultPolicy();
    const policyB = {
      ...policyA,
      rules: {
        ...policyA.rules,
        maxSecrets: 1
      }
    };

    expect(hashPolicy(policyA)).not.toEqual(hashPolicy(policyB));
  });
});
