'use client';

import React from 'react';
import { Scroll, CheckCircle, ShieldAlert } from 'lucide-react';

interface PolicyCardProps {
  policyId?: string;
  policyHash?: string;
}

export function PolicyCard({
  policyId = 'enterprise-v1',
  policyHash = '0x4f8a3b21c990fe017654ba3210ef89a72c41890e7612f00a9d8e123456789abc'
}: PolicyCardProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-midnight-900/80 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Scroll className="w-5 h-5 text-indigo-400" />
          <h4 className="font-semibold text-white">Registered Security Policy</h4>
        </div>
        <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/60">
          {policyId}
        </span>
      </div>

      <div className="space-y-3">
        <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
          <div className="text-xs text-slate-400 mb-1">On-Chain Policy Hash (SHA-256):</div>
          <div className="font-mono text-xs text-indigo-300 truncate" title={policyHash}>
            {policyHash}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-slate-300 bg-slate-950/40 p-2 rounded border border-slate-800/50">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Secrets: 0 max</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300 bg-slate-950/40 p-2 rounded border border-slate-800/50">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Copyleft: 0 max</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300 bg-slate-950/40 p-2 rounded border border-slate-800/50">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Blocked Deps: 0</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300 bg-slate-950/40 p-2 rounded border border-slate-800/50">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Tests: Required</span>
          </div>
        </div>
      </div>
    </div>
  );
}
