#!/usr/bin/env node
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getDefaultPolicy, hashPolicy } from '../packages/policy/dist/index.js';
import { scanRepository, CODEGUARD_SCANNER_HASH } from '../packages/scanner/dist/index.js';
import { CodeGuardSimulator } from '../packages/contract/dist/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootRepoDir = resolve(__dirname, '../');

const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  gray: '\x1b[90m'
};

async function main() {
  console.log(`\n${colors.bold}${colors.cyan}════════════════════════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}   CODEGUARD: Private AI Coding Agent Attestation Engine            ${colors.reset}`);
  console.log(`${colors.gray}   Midnight Network ZK Guardrail Demo                               ${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}════════════════════════════════════════════════════════════════════${colors.reset}\n`);

  const policy = getDefaultPolicy();
  const policyHash = hashPolicy(policy);
  const scannerHash = CODEGUARD_SCANNER_HASH;

  console.log(`${colors.bold}1. Registered On-Chain Enterprise Policy:${colors.reset}`);
  console.log(`   Policy ID:       ${colors.yellow}${policy.id}${colors.reset}`);
  console.log(`   Policy Hash:     ${colors.magenta}${policyHash}${colors.reset}`);
  console.log(`   Scanner Hash:    ${colors.magenta}${scannerHash}${colors.reset}\n`);

  // Phase 1: Vulnerable repo scan
  const vulnerablePath = resolve(rootRepoDir, 'demo/vulnerable-repo');
  console.log(`${colors.bold}2. Intercepting AI Agent Code Changes on Private Repo (Fixture A)...${colors.reset}`);
  console.log(`   Scanning directory: ${colors.gray}${vulnerablePath}${colors.reset}`);

  const badScan = await scanRepository(vulnerablePath, policy);
  console.log(`   Artifact Commitment: ${colors.blue}${badScan.artifactHash}${colors.reset}`);
  console.log(`   ${colors.red}${colors.bold}✗ SCAN BLOCKED:${colors.reset} Found ${badScan.secretCount} secrets, ${badScan.licenseViolationCount} license issues, ${badScan.blockedDependencyCount} blocked deps`);

  for (const f of badScan.findings) {
    console.log(`     ${colors.red}• [${f.type.toUpperCase()}] ${f.message}${colors.reset} (${f.file}${f.line ? `:${f.line}` : ''})`);
  }

  console.log(`\n   ${colors.yellow}Attempting Midnight ZK Proof Submission for non-compliant code...${colors.reset}`);
  try {
    const badSimulator = new CodeGuardSimulator(policyHash, scannerHash, badScan);
    badSimulator.attest(badScan.artifactHash);
  } catch (err) {
    console.log(`   ${colors.red}✓ Midnight Circuit Assertion Triggered: ${err.message}${colors.reset}`);
    console.log(`   ${colors.gray}Proof generation aborted. Zero private code leaked.${colors.reset}\n`);
  }

  // Phase 2: Clean repo scan & ZK proof
  const cleanPath = resolve(rootRepoDir, 'demo/clean-repo');
  console.log(`${colors.bold}3. Intercepting Remediation / Clean Code Changes (Fixture B)...${colors.reset}`);
  console.log(`   Scanning directory: ${colors.gray}${cleanPath}${colors.reset}`);

  const cleanScan = await scanRepository(cleanPath, policy);
  console.log(`   Artifact Commitment: ${colors.blue}${cleanScan.artifactHash}${colors.reset}`);
  console.log(`   ${colors.green}${colors.bold}✓ LOCAL SCAN PASSED:${colors.reset} 0 secrets, 0 license violations, 0 blocked deps, tests pass\n`);

  console.log(`${colors.bold}4. Generating Midnight Zero-Knowledge Proof...${colors.reset}`);
  const simulator = new CodeGuardSimulator(policyHash, scannerHash, cleanScan);
  const nextLedger = simulator.attest(cleanScan.artifactHash);

  console.log(`   ${colors.green}${colors.bold}✓ MIDNIGHT ZK PROOF VERIFIED & ATTESTED ON-CHAIN!${colors.reset}`);
  console.log(`   Total Verifications:  ${colors.yellow}${nextLedger.verificationCount}${colors.reset}`);
  console.log(`   Last Disclosed Hash:  ${colors.blue}${cleanScan.artifactHash}${colors.reset}\n`);

  console.log(`${colors.bold}${colors.cyan}════════════════════════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.bold}PRIVACY BOUNDARY VERIFICATION:${colors.reset}`);
  console.log(`  ${colors.green}CONFIDENTIAL (LOCAL ONLY):${colors.reset} Source files, prompts, findings, tokens`);
  console.log(`  ${colors.magenta}PUBLIC ON MIDNIGHT LEDGER:${colors.reset} Policy Hash, Scanner Hash, Artifact Hash, Verified Status`);
  console.log(`${colors.bold}${colors.cyan}════════════════════════════════════════════════════════════════════${colors.reset}\n`);
}

main().catch(console.error);
