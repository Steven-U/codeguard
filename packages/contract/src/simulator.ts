import {
  type CircuitContext,
  sampleContractAddress,
  createConstructorContext,
  createCircuitContext
} from '@midnight-ntwrk/compact-runtime';
import {
  Contract,
  type Ledger,
  ledger
} from './managed/codeguard/contract/index.js';
import { type CodeGuardPrivateState, createWitnesses } from './witnesses.js';
import type { ScanResult } from '@codeguard/types';
import { hexToBytes } from '@codeguard/commitment';

export class CodeGuardSimulator {
  readonly contract: Contract<CodeGuardPrivateState>;
  circuitContext: CircuitContext<CodeGuardPrivateState>;

  constructor(
    initialPolicyHashHex: string,
    initialScannerHashHex: string,
    initialScan?: ScanResult
  ) {
    const witnesses = createWitnesses(initialScan);
    this.contract = new Contract<CodeGuardPrivateState>(witnesses);

    const initialPolicyBytes = hexToBytes(initialPolicyHashHex);
    const initialScannerBytes = hexToBytes(initialScannerHashHex);

    const {
      currentPrivateState,
      currentContractState,
      currentZswapLocalState
    } = this.contract.initialState(
      createConstructorContext({ currentScan: initialScan }, '0'.repeat(64)),
      initialPolicyBytes,
      initialScannerBytes
    );

    this.circuitContext = createCircuitContext(
      sampleContractAddress(),
      currentZswapLocalState,
      currentContractState,
      currentPrivateState
    );
  }

  public getLedger(): Ledger {
    return ledger(this.circuitContext.currentQueryContext.state);
  }

  public getPrivateState(): CodeGuardPrivateState {
    return this.circuitContext.currentPrivateState;
  }

  public setScanWitness(scan: ScanResult): void {
    this.circuitContext.currentPrivateState = {
      currentScan: scan
    };
  }

  public attest(artifactHashHex: string): Ledger {
    const artifactBytes = hexToBytes(artifactHashHex);
    this.circuitContext = this.contract.impureCircuits.attest(
      this.circuitContext,
      artifactBytes
    ).context;
    return ledger(this.circuitContext.currentQueryContext.state);
  }
}
