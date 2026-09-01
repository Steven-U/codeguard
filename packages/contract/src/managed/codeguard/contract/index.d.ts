import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export type ScanWitness = { artifactHash: Uint8Array;
                            policyHash: Uint8Array;
                            scannerHash: Uint8Array;
                            secretCount: bigint;
                            licenseViolationCount: bigint;
                            blockedDependencyCount: bigint;
                            testsPassed: boolean
                          };

export type Witnesses<PS> = {
  getScanWitness(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, ScanWitness];
}

export type ImpureCircuits<PS> = {
  attest(context: __compactRuntime.CircuitContext<PS>,
         artifactHash_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
}

export type ProvableCircuits<PS> = {
  attest(context: __compactRuntime.CircuitContext<PS>,
         artifactHash_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
}

export type PureCircuits = {
}

export type Circuits<PS> = {
  attest(context: __compactRuntime.CircuitContext<PS>,
         artifactHash_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
}

export type Ledger = {
  readonly policyHash: Uint8Array;
  readonly scannerHash: Uint8Array;
  readonly lastArtifactHash: Uint8Array;
  readonly verificationCount: bigint;
  attestedArtifacts: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): boolean;
    [Symbol.iterator](): Iterator<[Uint8Array, boolean]>
  };
}

export type ContractReferenceLocations = any;

export declare const contractReferenceLocations : ContractReferenceLocations;

export declare class Contract<PS = any, W extends Witnesses<PS> = Witnesses<PS>> {
  witnesses: W;
  circuits: Circuits<PS>;
  impureCircuits: ImpureCircuits<PS>;
  provableCircuits: ProvableCircuits<PS>;
  constructor(witnesses: W);
  initialState(context: __compactRuntime.ConstructorContext<PS>,
               initialPolicyHash_0: Uint8Array,
               initialScannerHash_0: Uint8Array): __compactRuntime.ConstructorResult<PS>;
}

export declare function ledger(state: __compactRuntime.StateValue | __compactRuntime.ChargedState): Ledger;
export declare const pureCircuits: PureCircuits;
