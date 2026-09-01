import type { Witnesses, ScanWitness, Ledger } from './managed/codeguard/contract/index.js';
import type { WitnessContext } from '@midnight-ntwrk/compact-runtime';
import type { ScanResult } from '@codeguard/types';
import { hexToBytes } from '@codeguard/commitment';

export interface CodeGuardPrivateState {
  currentScan?: ScanResult;
}

export const createWitnesses = (initialScan?: ScanResult): Witnesses<CodeGuardPrivateState> => ({
  getScanWitness(context: WitnessContext<Ledger, CodeGuardPrivateState>): [CodeGuardPrivateState, ScanWitness] {
    const scan = context.privateState.currentScan || initialScan;
    if (!scan) {
      throw new Error('No private scan witness provided to CodeGuard witness provider');
    }

    const witness: ScanWitness = {
      artifactHash: hexToBytes(scan.artifactHash),
      policyHash: hexToBytes(scan.policyHash),
      scannerHash: hexToBytes(scan.scannerHash),
      secretCount: BigInt(scan.secretCount),
      licenseViolationCount: BigInt(scan.licenseViolationCount),
      blockedDependencyCount: BigInt(scan.blockedDependencyCount),
      testsPassed: scan.testsPassed
    };

    return [context.privateState, witness];
  }
});
