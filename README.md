# CodeGuard: Confidential AI Agent Attestation Engine

> **"Prove your AI agent followed the rules. Don't reveal the code."**

Built for the **Midnight Buildathon (Wave 1)** on [Akindo](https://app.akindo.io/wave-hacks/jaMZjqPOBsLXvjdG?tab=overview).

[![Midnight Network](https://img.shields.io/badge/Midnight-ZK_Network-blueviolet?style=flat-square)](https://midnight.network)
[![Compact Language](https://img.shields.io/badge/Compact-v0.23+-indigo?style=flat-square)](https://docs.midnight.network)
[![MCP Compatible](https://img.shields.io/badge/Model_Context_Protocol-Ready-cyan?style=flat-square)](https://modelcontextprotocol.io)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-green?style=flat-square)](LICENSE)

---

## 1. Executive Summary

As autonomous AI coding agents (Cursor, Claude Code, Devin, custom agent swarms) become integral to engineering teams, enterprises face an intractable tension: **they must enforce strict security and compliance policies on AI-generated code, but they cannot leak proprietary source code, internal prompts, dependency trees, or credentials to external verification servers or public blockchains.**

**CodeGuard** resolves this tension by marrying **local-first deterministic security scanning** with **Midnight’s zero-knowledge smart contract architecture**.

```
LOCAL / PRIVATE (Never Disclosed)
──────────────────────────────────────────────────────────
• Proprietary source code & ASTs
• AI agent prompts, scratchpads & context windows
• Internal dependency manifests
• Exact vulnerability findings, tokens & line numbers
                           │
                           ▼
                  [Local Witness Generator]
                           │
                           ▼
              [Midnight Local Proof Server]
                           │
                           ▼ (Zero-Knowledge Proof)
PUBLIC ON MIDNIGHT LEDGER
──────────────────────────────────────────────────────────
✓ policyHash:            0x4f8a...3b21
✓ scannerHash:           0xaa17...9c42
✓ artifactCommitment:    0x91fa...a72c
✓ verificationCount:     +1
✓ status:                VERIFIED_COMPLIANT
```

---

## 2. Core Value Proposition

Instead of claiming to merely "scan code with ZK", CodeGuard establishes a **Confidential Agent Attestation Protocol**:

1. **Deterministic Artifact Commitment:** The local repository state is committed into a canonical, sorted SHA-256 manifest hash before scanning.
2. **Deterministic Policy Commitment:** The enterprise security policy is canonicalized (RFC 8785) into an immutable on-chain policy hash.
3. **Zero-Leakage Local Evaluation:** A local scanner checks secrets, prohibited copyleft licenses, blocked dependencies, and test execution.
4. **Midnight Zero-Knowledge Attestation:** A Compact smart contract circuit proves that the private witness corresponds to the committed artifact and satisfies all registered policy constraints.

---

## 3. Trust Model & Cryptographic Guarantees

> **Wave 1 Trust Assumption:**
> Wave 1 assumes the CodeGuard scanner is trusted to faithfully produce its witness on the developer's local machine. Midnight proves that the private witness satisfies the registered constraints and corresponds to the committed artifact without revealing the witness contents or source code.
>
> *(Wave 2 will introduce cryptographic scanner-build hash bindings and in-circuit signature verification).*

---

## 4. Wave 1 Policy Predicates

CodeGuard Wave 1 evaluates four strict compliance predicates inside the Midnight ZK circuit:

| Policy Predicate | Allowed Threshold | Description |
| :--- | :--- | :--- |
| **`secretCount`** | `== 0` | Zero exposed API keys, private keys, AWS tokens, or credential assignments |
| **`licenseViolationCount`** | `== 0` | Zero prohibited copyleft licenses (GPL, AGPL, SSPL, etc.) |
| **`blockedDependencyCount`** | `== 0` | Zero blocklisted, deprecated, or vulnerable packages |
| **`testsPassed`** | `== true` | Code modifications pass the automated local test suite |

---

## 5. System Architecture & Monorepo Structure

```text
codeguard/
├── apps/
│   ├── mcp-server/              # Model Context Protocol (MCP) server for Cursor / Claude agents
│   │   └── src/
│   │       ├── tools/
│   │       │   ├── scan.ts      # codeguard_scan (local evaluation)
│   │       │   ├── attest.ts    # codeguard_attest (ZK proof generation & Midnight submission)
│   │       │   └── status.ts    # codeguard_status (query public attestation registry)
│   │       └── server.ts
│   │
│   └── web/                     # Interactive UI / Privacy Boundary Dashboard
│       └── src/
│           ├── components/
│           │   ├── PrivacyBoundary.tsx   # Visual split: Private Local vs Public Ledger
│           │   ├── ScanCard.tsx          # Local scan results & findings
│           │   ├── PolicyCard.tsx        # Registered enterprise policy commitment
│           │   ├── AttestationCard.tsx   # Verified Midnight proof badge & tx
│           │   └── InteractiveDemo.tsx   # 2-minute hackathon demo stepper
│           └── app/page.tsx
│
├── packages/
│   ├── contract/                # Midnight Compact smart contract
│   │   ├── src/
│   │   │   ├── codeguard.compact        # Circuit: binds private scan witness to public artifact & policy hash
│   │   │   ├── witnesses.ts             # Witness provider bindings
│   │   │   └── test/
│   │   │       ├── codeguard-simulator.ts
│   │   │       └── codeguard.test.ts    # Vitest contract test suite
│   │   └── package.json
│   │
│   ├── scanner/                 # Deterministic local security engine
│   │   └── src/
│   │       ├── scan.ts          # Core scan orchestrator
│   │       ├── secrets.ts       # Zero-leakage regex/entropy secret detection
│   │       ├── licenses.ts      # Prohibited dependency license checker
│   │       ├── dependencies.ts  # Blocklisted packages checker
│   │       └── tests.ts         # Local test suite validator
│   │
│   ├── commitment/              # Deterministic artifact commitment
│   │   └── src/
│   │       ├── manifest.ts      # Lexicographically sorted canonical file manifest builder
│   │       └── hash.ts          # SHA-256 commitment generator
│   │
│   ├── policy/                  # Policy schemas & canonicalization
│   │   └── src/
│   │       ├── types.ts
│   │       └── canonicalize.ts  # RFC 8785 canonical JSON hashing
│   │
│   └── types/                   # Shared TypeScript interfaces
│
├── policies/
│   ├── enterprise-v1.json       # Standard enterprise baseline policy
│   └── strict-v1.json           # Zero-tolerance fintech policy
│
├── demo/
│   ├── vulnerable-repo/         # Planted failure fixture (hardcoded secret & blocked package)
│   ├── clean-repo/              # Clean fixture for 100% verified attestation demo
│   └── run-demo.js              # Automated CLI demo runner
│
├── package.json
└── README.md
```

---

## 6. Compact Smart Contract (`codeguard.compact`)

```compact
pragma language_version >= 0.22;

import CompactStandardLibrary;

export struct ScanWitness {
  artifactHash: Bytes<32>;
  policyHash: Bytes<32>;
  scannerHash: Bytes<32>;
  secretCount: Uint<16>;
  licenseViolationCount: Uint<16>;
  blockedDependencyCount: Uint<16>;
  testsPassed: Boolean;
}

export ledger policyHash: Bytes<32>;
export ledger scannerHash: Bytes<32>;
export ledger lastArtifactHash: Bytes<32>;
export ledger verificationCount: Uint<64>;
export ledger attestedArtifacts: Map<Bytes<32>, Boolean>;

witness getScanWitness(): ScanWitness;

constructor(
  initialPolicyHash: Bytes<32>,
  initialScannerHash: Bytes<32>
) {
  policyHash = disclose(initialPolicyHash);
  scannerHash = disclose(initialScannerHash);
  verificationCount = disclose(0 as Uint<64>);
}

export circuit attest(artifactHash: Bytes<32>): [] {
  const scan = getScanWitness();

  // 1. Assert binding: private scan MUST match public artifact commitment
  assert(scan.artifactHash == artifactHash, "artifact commitment mismatch");

  // 2. Assert policy binding: private scan MUST evaluate against registered policy
  assert(scan.policyHash == policyHash, "policy hash mismatch");
  assert(scan.scannerHash == scannerHash, "scanner hash mismatch");

  // 3. Core Policy Constraints
  assert(scan.secretCount == 0 as Uint<16>, "secrets detected");
  assert(scan.licenseViolationCount == 0 as Uint<16>, "license violations detected");
  assert(scan.blockedDependencyCount == 0 as Uint<16>, "blocked dependencies detected");
  assert(scan.testsPassed, "test suite failed");

  // 4. Update public state
  const disclosedHash = disclose(artifactHash);
  lastArtifactHash = disclosedHash;
  attestedArtifacts.insert(disclosedHash, disclose(true));
  verificationCount = disclose((verificationCount + 1) as Uint<64>);
}
```

---

## 7. Model Context Protocol (MCP) Integration

CodeGuard exposes standard MCP tools for AI IDEs like Cursor and Claude Desktop:

### 1. `codeguard_scan`
Runs private scan locally on repository changes without transmitting code.
```json
{
  "name": "codeguard_scan",
  "arguments": {
    "repoPath": "./my-private-app",
    "policyPath": "./policies/enterprise-v1.json"
  }
}
```

### 2. `codeguard_attest`
Generates Midnight ZK proof and updates on-chain attestation status.
```json
{
  "name": "codeguard_attest",
  "arguments": {
    "repoPath": "./my-private-app"
  }
}
```

### 3. `codeguard_status`
Queries public ledger for verification status of an artifact commitment hash.
```json
{
  "name": "codeguard_status",
  "arguments": {
    "artifactHash": "0x91faa72c18d84b067a840e11892fc0b418a0902827164b38d011749102837461"
  }
}
```

---

## 8. Quickstart & 2-Minute Demo

### 1. Clone & Build Monorepo
```bash
git clone https://github.com/steven-u/codeguard.git
cd codeguard
npm install
npm run build
```

### 2. Run Compact Contract Tests
```bash
npm run test:contract
```

### 3. Run Automated 2-Minute Demo Flow
```bash
npm run demo:scan
```

### 4. Start Interactive Web Dashboard
```bash
npm run web
# Open http://localhost:3000 to interact with the Privacy Boundary & Live Stepper
```

---

## 9. Definition of Done (Wave 1 Checklist)

- [x] Compact contract compiles with Midnight compiler (`compact compile`)
- [x] Deterministic repository artifact commitment hashing (manifest + SHA-256)
- [x] Zero-leakage secrets scanner with regex & pattern detection
- [x] Prohibited license detection (GPL, AGPL, SSPL, etc.)
- [x] Blocked dependency validator
- [x] Private witness binds artifact hash and policy hash to circuit
- [x] Unit test suite passing for all assertion paths and rejection edge cases
- [x] MCP server implementing `codeguard_scan`, `codeguard_attest`, and `codeguard_status`
- [x] Next.js interactive privacy boundary & attestation dashboard
- [x] Clean and vulnerable demo fixtures with automated runner
- [x] Clear documentation of trust assumptions and zero-knowledge privacy guarantees

---

## 10. Wave 2 & Wave 3 Roadmap

* **Wave 2:**
  * In-circuit cryptographic signature verification for trusted scanner binaries (Ed25519/Secp256k1).
  * GitHub Actions / GitLab CI/CD gate bot that automatically blocks merges lacking a valid Midnight attestation.
* **Wave 3:**
  * Autonomous Agent Reputation Registry: aggregate trust scores for AI coding agents based on historical compliance.
  * Multi-policy staking and decentralized arbiter resolution for compliance disputes.

---

## License

Apache-2.0 &bull; Built for the Midnight Developer Community.
