/**
 * CodeGuard Types
 * Core domain types for Confidential AI Agent Attestation & Safety Verification.
 */

export type FindingType = 'secret' | 'license' | 'dependency' | 'tests';
export type SeverityLevel = 'critical' | 'high' | 'medium' | 'low';

export interface Finding {
  type: FindingType;
  severity: SeverityLevel;
  rule: string;
  message: string;
  file?: string;
  line?: number;
  snippet?: string; // Kept strictly local, never leaves client
  package?: string;
}

export interface PolicySecretPattern {
  id: string;
  name: string;
  pattern: string;
}

export interface PolicyRules {
  maxSecrets: number;
  maxLicenseViolations: number;
  maxBlockedDependencies: number;
  testsRequired: boolean;
  prohibitedLicenses?: string[];
  blockedDependencies?: string[];
  secretPatterns?: PolicySecretPattern[];
}

export interface Policy {
  id: string;
  name: string;
  version: number;
  description?: string;
  rules: PolicyRules;
}

export interface ArtifactFileEntry {
  path: string;
  sha256: string;
  size: number;
}

export interface ArtifactCommitment {
  artifactHash: string; // 0x-prefixed hex string (32 bytes)
  manifest: ArtifactFileEntry[];
  totalFiles: number;
  totalBytes: number;
}

/**
 * ScanResult contains the local private scan output.
 * In Midnight ZK proof generation, this structure feeds the witness generator.
 */
export interface ScanResult {
  artifactHash: string; // 0x hex 32 bytes
  policyHash: string;   // 0x hex 32 bytes
  scannerHash: string;  // 0x hex 32 bytes

  secretCount: number;
  licenseViolationCount: number;
  blockedDependencyCount: number;
  testsPassed: boolean;

  isCompliant: boolean;
  scannedAt: number; // Unix timestamp
  findings: Finding[]; // Detailed findings (kept local)
}

/**
 * Public On-Chain Attestation Record
 */
export interface AttestationRecord {
  attestationId: string;
  artifactHash: string;
  policyHash: string;
  scannerHash: string;
  verified: boolean;
  timestamp: number;
  txHash?: string;
  network: string;
}

/**
 * MCP Server Tool Input / Output Interfaces
 */
export interface ScanToolInput {
  repoPath?: string;
  policyId?: string;
  policyPath?: string;
}

export interface ScanToolOutput {
  compliant: boolean;
  artifactHash: string;
  policyHash: string;
  summary: {
    secrets: number;
    licenseViolations: number;
    blockedDependencies: number;
    testsPassed: boolean;
  };
  findings: Finding[];
}

export interface AttestToolInput {
  repoPath?: string;
  policyId?: string;
  policyPath?: string;
}

export interface AttestToolOutput {
  status: 'verified' | 'rejected';
  compliant: boolean;
  artifactHash: string;
  policyHash: string;
  attestationId?: string;
  txHash?: string;
  error?: string;
  summary: {
    secrets: number;
    licenseViolations: number;
    blockedDependencies: number;
    testsPassed: boolean;
  };
}

export interface StatusToolInput {
  artifactHash: string;
}

export interface StatusToolOutput {
  verified: boolean;
  artifactHash: string;
  policyHash?: string;
  scannerHash?: string;
  verificationCount: number;
  lastAttestedAt?: number;
}
