import type { ScanToolInput, ScanToolOutput, Policy } from '@codeguard/types';
import { getDefaultPolicy, loadPolicyFromFile } from '@codeguard/policy';
import { scanRepository } from '@codeguard/scanner';

export async function handleScan(input: ScanToolInput): Promise<ScanToolOutput> {
  const repoPath = input.repoPath || process.cwd();
  let policy: Policy;

  if (input.policyPath) {
    policy = loadPolicyFromFile(input.policyPath);
  } else {
    policy = getDefaultPolicy();
  }

  const scanResult = await scanRepository(repoPath, policy);

  return {
    compliant: scanResult.isCompliant,
    artifactHash: scanResult.artifactHash,
    policyHash: scanResult.policyHash,
    summary: {
      secrets: scanResult.secretCount,
      licenseViolations: scanResult.licenseViolationCount,
      blockedDependencies: scanResult.blockedDependencyCount,
      testsPassed: scanResult.testsPassed
    },
    findings: scanResult.findings
  };
}
