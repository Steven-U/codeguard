'use client';

import React from 'react';
import { FileText, Check } from 'lucide-react';

interface PolicyCardProps {
  policyId?: string;
  policyHash?: string;
}

export function PolicyCard({
  policyId = 'enterprise-v1',
  policyHash = '0xde8ca453b1a3d3c138f3161533e7ea6cc31fffbdaef3014b16e1eca44fa67a29'
}: PolicyCardProps) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-surface p-5 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80 mb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-zinc-400" />
            <h4 className="text-sm font-semibold text-zinc-200">Registered Policy</h4>
          </div>
          <span className="font-mono text-xs text-zinc-400 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800">
            {policyId}
          </span>
        </div>

        <div className="mb-4">
          <div className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider mb-1">
            Policy Commitment Hash
          </div>
          <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800 font-mono text-xs text-zinc-300 break-all select-all">
            {policyHash}
          </div>
        </div>

        <div className="space-y-2 text-xs font-mono">
          <div className="flex items-center justify-between p-2 rounded bg-zinc-950/60 border border-zinc-800/50">
            <span className="text-zinc-400">maxSecrets</span>
            <span className="text-zinc-200 font-semibold">0</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded bg-zinc-950/60 border border-zinc-800/50">
            <span className="text-zinc-400">maxLicenseViolations</span>
            <span className="text-zinc-200 font-semibold">0</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded bg-zinc-950/60 border border-zinc-800/50">
            <span className="text-zinc-400">maxBlockedDeps</span>
            <span className="text-zinc-200 font-semibold">0</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded bg-zinc-950/60 border border-zinc-800/50">
            <span className="text-zinc-400">testsRequired</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> true
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
