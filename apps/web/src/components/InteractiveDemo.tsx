'use client';

import React, { useState } from 'react';
import { Play, RotateCcw, ShieldAlert, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { ScanCard } from './ScanCard';
import { PolicyCard } from './PolicyCard';
import { AttestationCard } from './AttestationCard';
import { PrivacyBoundary } from './PrivacyBoundary';
import type { Finding } from '@codeguard/types';

export function InteractiveDemo() {
  const [step, setStep] = useState<number>(0);
  const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'clean' | 'vulnerable'>('idle');
  const [isAttested, setIsAttested] = useState<boolean>(false);
  const [verifCount, setVerifCount] = useState<number>(14);

  const policyId = 'enterprise-v1';
  const policyHash = '0x4f8a3b21c990fe017654ba3210ef89a72c41890e7612f00a9d8e123456789abc';

  const vulnerableArtifact = '0x3333aaaa4444bbbb5555cccc6666dddd7777eeee8888ffff9999000011112222';
  const cleanArtifact = '0x91faa72c18d84b067a840e11892fc0b418a0902827164b38d011749102837461';

  const [currentArtifact, setCurrentArtifact] = useState<string>(vulnerableArtifact);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [secretCount, setSecretCount] = useState<number>(0);
  const [licenseCount, setLicenseCount] = useState<number>(0);
  const [blockedDepCount, setBlockedDepCount] = useState<number>(0);

  // Step 1: Simulate AI Agent committing vulnerable code (planted API Key + blocked package)
  const handleSimulateVulnerable = () => {
    setScanStatus('scanning');
    setStep(1);
    setIsAttested(false);
    setCurrentArtifact(vulnerableArtifact);

    setTimeout(() => {
      setScanStatus('vulnerable');
      setSecretCount(1);
      setLicenseCount(0);
      setBlockedDepCount(1);
      setFindings([
        {
          type: 'secret',
          severity: 'critical',
          rule: 'secret-detection:openai-key',
          message: "Detected OpenAI API Key in src/config.ts",
          file: 'src/config.ts',
          line: 7,
          snippet: 'openAiApiKey: "sk-proj-DEMO99887766554433221100aaabbbcccdddeeefff"'
        },
        {
          type: 'dependency',
          severity: 'critical',
          rule: 'blocked-dependency:event-stream@3.3.6',
          message: "Dependency 'event-stream@3.3.6' is explicitly blocked by enterprise policy",
          file: 'package.json',
          package: 'event-stream@3.3.6'
        }
      ]);
    }, 600);
  };

  // Step 2: Remediate code (Clean Environment Variables + Safe Dependencies)
  const handleSimulateClean = () => {
    setScanStatus('scanning');
    setStep(2);
    setIsAttested(false);
    setCurrentArtifact(cleanArtifact);

    setTimeout(() => {
      setScanStatus('clean');
      setSecretCount(0);
      setLicenseCount(0);
      setBlockedDepCount(0);
      setFindings([]);
    }, 600);
  };

  // Step 3: Attest on Midnight ZK Proof Server
  const handleAttest = () => {
    setScanStatus('scanning');
    setStep(3);

    setTimeout(() => {
      setScanStatus('clean');
      setIsAttested(true);
      setVerifCount((prev) => prev + 1);
    }, 800);
  };

  const handleReset = () => {
    setStep(0);
    setScanStatus('idle');
    setIsAttested(false);
    setFindings([]);
    setSecretCount(0);
    setLicenseCount(0);
    setBlockedDepCount(0);
  };

  return (
    <div className="space-y-8">
      {/* Action Control Bar */}
      <div className="rounded-2xl border border-slate-800 bg-midnight-900/90 p-5 glow-box">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              Interactive Hackathon Demo Controller
            </h3>
            <p className="text-xs text-slate-400">
              Walk through the 2-minute developer lifecycle: local interception &rarr; remediation &rarr; Midnight ZK proof.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleSimulateVulnerable}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                step === 1
                  ? 'bg-red-600 text-white shadow-lg shadow-red-900/40'
                  : 'bg-red-950/60 text-red-300 border border-red-800/60 hover:bg-red-900/80'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              1. Intercept Bad Agent Code
            </button>

            <button
              onClick={handleSimulateClean}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                step === 2
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40'
                  : 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 hover:bg-emerald-900/80'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              2. Remediate & Pass Scan
            </button>

            <button
              onClick={handleAttest}
              disabled={scanStatus !== 'clean'}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                scanStatus === 'clean'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/40 hover:bg-indigo-500'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              3. Generate ZK Proof & Attest
            </button>

            <button
              onClick={handleReset}
              className="p-2 rounded-xl text-slate-400 bg-slate-900 hover:text-white hover:bg-slate-800 transition-colors"
              title="Reset Demo"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Policy, Scan Result, Attestation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

      {/* Privacy Boundary Visualization */}
      <PrivacyBoundary />
    </div>
  );
}
