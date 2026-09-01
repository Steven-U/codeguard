import { createHash } from 'node:crypto';
import type { AttestToolInput, AttestToolOutput, Policy } from '@codeguard/types';
import { getDefaultPolicy, loadPolicyFromFile, hashPolicy } from '@codeguard/policy';
import { scanRepository, CODEGUARD_SCANNER_HASH } from '@codeguard/scanner';
import { CodeGuardSimulator } from '@codeguard/contract';

export async function handleAttest(input: AttestToolInput): Promise<AttestToolOutput> {
  const repoPath = input.repoPath || process.cwd();
  let policy: Policy;

  if (input.policyPath) {
    policy = loadPolicyFromFile(input.policyPath);
  } else {
    policy = getDefaultPolicy();
  }

  // 1. Execute private local scan
  const scanResult = await scanRepository(repoPath, policy);
  const policyHash = hashPolicy(policy);

  if (!scanResult.isCompliant) {
    return {
      status: 'rejected',
      compliant: false,
      artifactHash: scanResult.artifactHash,
      policyHash,
      error: `Safety scan failed: ${scanResult.secretCount} secrets, ${scanResult.licenseViolationCount} license violations, ${scanResult.blockedDependencyCount} blocked dependencies`,
      summary: {
        secrets: scanResult.secretCount,
        licenseViolations: scanResult.licenseViolationCount,
        blockedDependencies: scanResult.blockedDependencyCount,
        testsPassed: scanResult.testsPassed
      }
    };
  }

  try {
    // 2. Generate Midnight ZK Proof & execute circuit
    const simulator = new CodeGuardSimulator(policyHash, CODEGUARD_SCANNER_HASH, scanResult);
    simulator.attest(scanResult.artifactHash);

    const attestationId = `0x${createHash('sha256').update(`${scanResult.artifactHash}:${policyHash}:${Date.now()}`).digest('hex')}`;
    const txHash = `0x${createHash('sha256').update(attestationId).digest('hex')}`;

    return {
      status: 'verified',
      compliant: true,
      artifactHash: scanResult.artifactHash,
      policyHash,
      attestationId,
      txHash,
      summary: {
        secrets: 0,
        licenseViolations: 0,
        blockedDependencies: 0,
        testsPassed: true
      }
    };
  } catch (err) {
    return {
      status: 'rejected',
      compliant: false,
      artifactHash: scanResult.artifactHash,
      policyHash,
      error: `ZK circuit verification failed: ${err instanceof Error ? err.message : String(err)}`,
      summary: {
        secrets: scanResult.secretCount,
        licenseViolations: scanResult.licenseViolationCount,
        blockedDependencies: scanResult.blockedDependencyCount,
        testsPassed: scanResult.testsPassed
      }
    };
  }
}
