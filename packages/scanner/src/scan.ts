import { createHash } from 'node:crypto';
import type { Finding, Policy, ScanResult } from '@codeguard/types';
import { hashPolicy } from '@codeguard/policy';
import { computeArtifactCommitment } from '@codeguard/commitment';
import { scanSecrets } from './secrets.js';
import { scanLicenses } from './licenses.js';
import { scanDependencies } from './dependencies.js';
import { checkTests } from './tests.js';

export const CODEGUARD_SCANNER_VERSION = '0.1.0';
export const CODEGUARD_SCANNER_HASH = `0x${createHash('sha256').update(`codeguard-scanner-v${CODEGUARD_SCANNER_VERSION}`).digest('hex')}`;

export async function scanRepository(rootDir: string, policy: Policy, options?: { testsPassed?: boolean }): Promise<ScanResult> {
  const commitment = computeArtifactCommitment(rootDir);
  const filePaths = commitment.manifest.map((m) => `${rootDir}/${m.path}`);

  const secretsFindings = await scanSecrets(rootDir, filePaths, policy);
  const licenseFindings = await scanLicenses(rootDir, policy);
  const dependencyFindings = await scanDependencies(rootDir, policy);
  const testResult = await checkTests(rootDir, policy);

  const testsPassed = options?.testsPassed !== undefined ? options.testsPassed : testResult.passed;

  const allFindings: Finding[] = [
    ...secretsFindings,
    ...licenseFindings,
    ...dependencyFindings,
    ...testResult.findings
  ];

  const secretCount = secretsFindings.length;
  const licenseViolationCount = licenseFindings.length;
  const blockedDependencyCount = dependencyFindings.length;

  const isCompliant =
    secretCount <= policy.rules.maxSecrets &&
    licenseViolationCount <= policy.rules.maxLicenseViolations &&
    blockedDependencyCount <= policy.rules.maxBlockedDependencies &&
    (!policy.rules.testsRequired || testsPassed);

  const policyHash = hashPolicy(policy);

  return {
    artifactHash: commitment.artifactHash,
    policyHash,
    scannerHash: CODEGUARD_SCANNER_HASH,
    secretCount,
    licenseViolationCount,
    blockedDependencyCount,
    testsPassed,
    isCompliant,
    scannedAt: Math.floor(Date.now() / 1000),
    findings: allFindings
  };
}
