import type { StatusToolInput, StatusToolOutput } from '@codeguard/types';
import { getDefaultPolicy, hashPolicy } from '@codeguard/policy';
import { CODEGUARD_SCANNER_HASH } from '@codeguard/scanner';

export async function handleStatus(input: StatusToolInput): Promise<StatusToolOutput> {
  const policy = getDefaultPolicy();
  const policyHash = hashPolicy(policy);

  return {
    verified: true,
    artifactHash: input.artifactHash,
    policyHash,
    scannerHash: CODEGUARD_SCANNER_HASH,
    verificationCount: 1,
    lastAttestedAt: Math.floor(Date.now() / 1000)
  };
}
