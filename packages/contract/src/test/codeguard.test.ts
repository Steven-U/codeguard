import { describe, it, expect } from 'vitest';
import { CodeGuardSimulator } from '../simulator.js';
import { getDefaultPolicy, hashPolicy } from '@codeguard/policy';
import { CODEGUARD_SCANNER_HASH } from '@codeguard/scanner';
import { bytesToHex } from '@codeguard/commitment';
import type { ScanResult } from '@codeguard/types';

describe('CodeGuard Midnight Smart Contract', () => {
  const policy = getDefaultPolicy();
  const policyHash = hashPolicy(policy);
  const scannerHash = CODEGUARD_SCANNER_HASH;
  const sampleArtifactHash = '0x1111222233334444555566667777888899990000aaaabbbbccccddddeeeeffff';

  const compliantScan: ScanResult = {
    artifactHash: sampleArtifactHash,
    policyHash,
    scannerHash,
    secretCount: 0,
    licenseViolationCount: 0,
    blockedDependencyCount: 0,
    testsPassed: true,
    isCompliant: true,
    scannedAt: 1788354000,
    findings: []
  };

  it('initializes ledger state with registered policy hash and zero verifications', () => {
    const simulator = new CodeGuardSimulator(policyHash, scannerHash, compliantScan);
    const ledger = simulator.getLedger();

    expect(bytesToHex(ledger.policyHash)).toEqual(policyHash.toLowerCase());
    expect(bytesToHex(ledger.scannerHash)).toEqual(scannerHash.toLowerCase());
    expect(ledger.verificationCount).toEqual(0n);
  });

  it('successfully generates attestation and updates on-chain counter for compliant scan', () => {
    const simulator = new CodeGuardSimulator(policyHash, scannerHash, compliantScan);
    const nextLedger = simulator.attest(sampleArtifactHash);

    expect(nextLedger.verificationCount).toEqual(1n);
    expect(bytesToHex(nextLedger.lastArtifactHash)).toEqual(sampleArtifactHash.toLowerCase());
  });

  it('rejects attestation when private witness contains hardcoded secrets', () => {
    const nonCompliantScan: ScanResult = {
      ...compliantScan,
      secretCount: 1,
      isCompliant: false
    };

    const simulator = new CodeGuardSimulator(policyHash, scannerHash, nonCompliantScan);
    expect(() => simulator.attest(sampleArtifactHash)).toThrow(/secrets detected/);
  });

  it('rejects attestation when private witness contains prohibited licenses', () => {
    const nonCompliantScan: ScanResult = {
      ...compliantScan,
      licenseViolationCount: 2,
      isCompliant: false
    };

    const simulator = new CodeGuardSimulator(policyHash, scannerHash, nonCompliantScan);
    expect(() => simulator.attest(sampleArtifactHash)).toThrow(/license violations detected/);
  });

  it('rejects attestation when private witness contains blocked dependencies', () => {
    const nonCompliantScan: ScanResult = {
      ...compliantScan,
      blockedDependencyCount: 1,
      isCompliant: false
    };

    const simulator = new CodeGuardSimulator(policyHash, scannerHash, nonCompliantScan);
    expect(() => simulator.attest(sampleArtifactHash)).toThrow(/blocked dependencies detected/);
  });

  it('rejects attestation when private witness indicates tests failed', () => {
    const nonCompliantScan: ScanResult = {
      ...compliantScan,
      testsPassed: false,
      isCompliant: false
    };

    const simulator = new CodeGuardSimulator(policyHash, scannerHash, nonCompliantScan);
    expect(() => simulator.attest(sampleArtifactHash)).toThrow(/test suite failed/);
  });

  it('rejects attestation when evaluated policy hash does not match registered on-chain policy', () => {
    const tamperedPolicyScan: ScanResult = {
      ...compliantScan,
      policyHash: '0x9999999999999999999999999999999999999999999999999999999999999999'
    };

    const simulator = new CodeGuardSimulator(policyHash, scannerHash, tamperedPolicyScan);
    expect(() => simulator.attest(sampleArtifactHash)).toThrow(/policy hash mismatch/);
  });

  it('rejects attestation when public artifact hash does not match private scan commitment', () => {
    const simulator = new CodeGuardSimulator(policyHash, scannerHash, compliantScan);
    const mismatchedArtifact = '0x8888888888888888888888888888888888888888888888888888888888888888';
    expect(() => simulator.attest(mismatchedArtifact)).toThrow(/artifact commitment mismatch/);
  });
});
