'use client';

import React from 'react';
import { Lock, Eye, ShieldCheck, FileCode, KeyRound, CheckCircle2, XCircle } from 'lucide-react';

export function PrivacyBoundary() {
  return (
    <div className="rounded-2xl border border-slate-800 bg-midnight-900/90 p-6 glow-box">
      <div className="flex items-center gap-2 mb-4">
        <ShieldCheck className="w-6 h-6 text-indigo-400" />
        <h3 className="text-xl font-bold text-white tracking-tight">Zero-Trust Privacy Boundary</h3>
      </div>
      <p className="text-sm text-slate-400 mb-6">
        Midnight’s zero-knowledge architecture proves full policy adherence without revealing proprietary source code, prompts, or vulnerability findings to external entities.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Side: Confidential Local Environment */}
        <div className="rounded-xl border border-emerald-950/60 bg-emerald-950/20 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="flex items-center gap-2 text-sm font-semibold text-emerald-400">
              <Lock className="w-4 h-4" />
              CONFIDENTIAL (Local Only)
            </span>
            <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-900/50 text-emerald-300">
              Never Leaves Client
            </span>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-center gap-2">
              <FileCode className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Proprietary source code files & repository tree</span>
            </li>
            <li className="flex items-center gap-2">
              <KeyRound className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>API keys, secrets, credentials, env tokens</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>AI Agent prompts, scratchpads & context windows</span>
            </li>
            <li className="flex items-center gap-2">
              <XCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Exact vulnerability finding locations & line numbers</span>
            </li>
          </ul>
        </div>

        {/* Right Side: Public Ledger Layer */}
        <div className="rounded-xl border border-indigo-950/60 bg-indigo-950/20 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="flex items-center gap-2 text-sm font-semibold text-indigo-400">
              <Eye className="w-4 h-4" />
              PUBLIC ON MIDNIGHT LEDGER
            </span>
            <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-900/50 text-indigo-300">
              Verifiable by Anyone
            </span>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-center gap-2 font-mono text-[11px]">
              <span className="text-indigo-400 font-bold">•</span>
              <span className="text-slate-400">policyHash:</span>
              <span className="text-indigo-300">0x4f8a...3b21</span>
            </li>
            <li className="flex items-center gap-2 font-mono text-[11px]">
              <span className="text-indigo-400 font-bold">•</span>
              <span className="text-slate-400">scannerHash:</span>
              <span className="text-indigo-300">0xaa17...9c42</span>
            </li>
            <li className="flex items-center gap-2 font-mono text-[11px]">
              <span className="text-indigo-400 font-bold">•</span>
              <span className="text-slate-400">artifactCommitment:</span>
              <span className="text-indigo-300">0x91fa...a72c</span>
            </li>
            <li className="flex items-center gap-2 font-mono text-[11px]">
              <span className="text-indigo-400 font-bold">•</span>
              <span className="text-slate-400">verificationState:</span>
              <span className="text-emerald-400 font-semibold">VERIFIED_COMPLIANT</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
