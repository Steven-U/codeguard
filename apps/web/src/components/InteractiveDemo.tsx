'use client';

import React, { useState } from 'react';
import { Play, RotateCcw, AlertTriangle, Check, ArrowRight, Terminal } from 'lucide-react';
import { ScanCard } from './ScanCard';
import { PolicyCard } from './PolicyCard';
import { AttestationCard } from './AttestationCard';
import { PrivacyBoundary } from './PrivacyBoundary';
import type { Finding } from '@codeguard/types';

export function InteractiveDemo() {
  const [step, setStep] = useState<number>(0);
  const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'clean' | 'vulnerable'>('idle');
  const [isAttested, setIsAttested] = useState<boolean>(false);
  const [verifCount, setVerifCount] = useState<number>(1);
  const [logs, setLogs] = useState<string[]>([]);

  const policyId = 'enterprise-v1';
  const policyHash = '0xde8ca453b1a3d3c138f3161533e7ea6cc31fffbdaef3014b16e1eca44fa67a29';

  const vulnerableArtifact = '0x71ffecf4325faa2504cea3787e48fb1f3957733c442c5d6e681d82f8c52b7202';
  const cleanArtifact = '0xc0fe2db586f999aa4df4c797731e42d33f5408e3e8fb27197330426389b103d4';

  const [currentArtifact, setCurrentArtifact] = useState<string>(cleanArtifact);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [secretCount, setSecretCount] = useState<number>(0);
  const [licenseCount, setLicenseCount] = useState<number>(0);
  const [blockedDepCount, setBlockedDepCount] = useState<number>(0);

  const addLog = (msg: string) => {
    setLogs((prev) => [...prev, `[${new Date().toISOString().slice(11, 19)}] ${msg}`]);
  };

  // Step 1: Planted violation
  const handleSimulateVulnerable = () => {
    setScanStatus('scanning');
    setStep(1);
    setIsAttested(false);
    setCurrentArtifact(vulnerableArtifact);
    setLogs([]);
    addLog('Scanning local directory: demo/vulnerable-repo');

    setTimeout(() => {
      setScanStatus('vulnerable');
      setSecretCount(2);
      setLicenseCount(0);
      setBlockedDepCount(1);
      const newFindings: Finding[] = [
        {
          type: 'secret',
          severity: 'critical',
          rule: 'secret-detection:openai-key',
          message: "Detected OpenAI API Key in src/config.ts",
          file: 'src/config.ts',
          line: 7,
          snippet: 'openAiApiKey: "sk-mock-demo-key-never-active-00112233445566778899"'
        },
        {
          type: 'dependency',
          severity: 'critical',
          rule: 'blocked-dependency:event-stream@3.3.6',
          message: "Dependency 'event-stream@3.3.6' is blocklisted by policy",
          file: 'package.json',
          package: 'event-stream@3.3.6'
        }
      ];
      setFindings(newFindings);
      addLog('Scan failed: 2 secrets detected, 1 blocked dependency');
      addLog('Circuit assertion rejected locally: assert(scan.secretCount == 0)');
      addLog('Zero private files transmitted.');
    }, 400);
  };

  // Step 2: Remediate
  const handleSimulateClean = () => {
    setScanStatus('scanning');
    setStep(2);
    setIsAttested(false);
    setCurrentArtifact(cleanArtifact);
    addLog('Scanning local directory: demo/clean-repo');

    setTimeout(() => {
      setScanStatus('clean');
      setSecretCount(0);
      setLicenseCount(0);
      setBlockedDepCount(0);
      setFindings([]);
      addLog('Scan passed: 0 secrets, 0 license violations, 0 blocked deps, tests PASS');
      addLog(`Artifact commitment computed: ${cleanArtifact.slice(0, 18)}...`);
    }, 400);
  };

  // Step 3: Attest
  const handleAttest = () => {
    setScanStatus('scanning');
    setStep(3);
    addLog('Building private witness ScanWitness { secretCount: 0, testsPassed: true, ... }');
    addLog('Calling Midnight proof server (http://127.0.0.1:6300)...');

    setTimeout(() => {
      setScanStatus('clean');
      setIsAttested(true);
      setVerifCount((prev) => prev + 1);
      addLog('Zero-Knowledge proof generated in 248ms');
      addLog('Transaction settled on Midnight ledger: status = VERIFIED_COMPLIANT');
      addLog(`verificationCount incremented to #${verifCount + 1}`);
    }, 600);
  };

  const handleReset = () => {
    setStep(0);
    setScanStatus('idle');
    setIsAttested(false);
    setFindings([]);
    setSecretCount(0);
    setLicenseCount(0);
    setBlockedDepCount(0);
    setLogs([]);
  };

  return (
    <div className="space-y-6">
      {/* Control bar */}
      <div className="rounded-lg border border-zinc-800 bg-surface p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono font-medium text-zinc-300">
            TEST HARNESS &bull; 3-STEP VERIFICATION FLOW
          </div>
          <div className="text-xs text-zinc-500 mt-0.5">
            Test policy violation interception, remediation, and zero-knowledge proof generation.
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleSimulateVulnerable}
            className={`px-3 py-1.5 rounded text-xs font-mono transition-colors border ${
              step === 1
                ? 'bg-red-950 text-red-200 border-red-700'
                : 'bg-zinc-900 text-zinc-300 border-zinc-700 hover:bg-zinc-800'
            }`}
          >
            1. Plant Violation
          </button>

          <button
            onClick={handleSimulateClean}
            className={`px-3 py-1.5 rounded text-xs font-mono transition-colors border ${
              step === 2
                ? 'bg-emerald-950 text-emerald-200 border-emerald-700'
                : 'bg-zinc-900 text-zinc-300 border-zinc-700 hover:bg-zinc-800'
            }`}
          >
            2. Remediate
          </button>

          <button
            onClick={handleAttest}
            disabled={scanStatus !== 'clean'}
            className={`px-3 py-1.5 rounded text-xs font-mono transition-colors border ${
              scanStatus === 'clean'
                ? 'bg-indigo-950 text-indigo-200 border-indigo-600 hover:bg-indigo-900'
                : 'bg-zinc-950 text-zinc-600 border-zinc-800 cursor-not-allowed'
            }`}
          >
            3. Attest on Midnight
          </button>

          <button
            onClick={handleReset}
            className="p-1.5 rounded border border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900 transition-colors"
            title="Reset Harness"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Grid: 3 Data Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <PolicyCard policyId={policyId} policyHash={policyHash} />
        <ScanCard
          status={scanStatus}
          artifactHash={currentArtifact}
          findings={findings}
          secretCount={secretCount}
          licenseViolationCount={licenseCount}
          blockedDependencyCount={blockedDepCount}
        />
        <AttestationCard
          isAttested={isAttested}
          artifactHash={currentArtifact}
          policyHash={policyHash}
          verificationCount={verifCount}
        />
      </div>

      {/* Realtime Terminal Execution Trace */}
      {logs.length > 0 && (
        <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
          <div className="flex items-center gap-2 pb-2 border-b border-zinc-900 text-[11px] font-mono text-zinc-500 uppercase tracking-wider mb-2">
            <Terminal className="w-3.5 h-3.5" />
            Execution Trace Log
          </div>
          <div className="space-y-1 font-mono text-xs text-zinc-300">
            {logs.map((log, idx) => (
              <div key={idx} className="leading-relaxed">
                <span className="text-zinc-500">&gt;</span> {log}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cryptographic Privacy Boundary */}
      <PrivacyBoundary />
    </div>
  );
}
