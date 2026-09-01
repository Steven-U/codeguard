'use client';

import React from 'react';
import { Cpu, CheckCircle2, ShieldAlert } from 'lucide-react';

interface AttestationCardProps {
  isAttested: boolean;
  attestationId?: string;
  txHash?: string;
  artifactHash?: string;
  policyHash?: string;
  verificationCount?: number;
}

export function AttestationCard({
  isAttested,
  attestationId = '0x8fa72109841bcefa019283746152431289471928374615243128947192837461',
  txHash = '0x3b21908471239084712098347102938471029384710293847102938471029384',
  verificationCount = 1
}: AttestationCardProps) {
  return (
    <div className={`rounded-lg border bg-surface p-5 flex flex-col justify-between transition-colors ${
      isAttested ? 'border-indigo-800' : 'border-zinc-800'
    }`}>
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80 mb-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-zinc-400" />
            <h4 className="text-sm font-semibold text-zinc-200">Midnight Proof & Ledger</h4>
          </div>
          <div>
            {isAttested ? (
              <span className="flex items-center gap-1 font-mono text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-semibold">
                <CheckCircle2 className="w-3 h-3" /> VERIFIED_ON_CHAIN
              </span>
            ) : (
              <span className="font-mono text-xs text-zinc-500">IDLE</span>
            )}
          </div>
        </div>

        {isAttested ? (
          <div className="space-y-3 font-mono text-xs">
            <div>
              <div className="text-[11px] text-zinc-500 uppercase tracking-wider mb-1">
                Attestation Identifier
              </div>
              <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800 text-zinc-300 break-all select-all">
                {attestationId}
              </div>
            </div>

            <div>
              <div className="text-[11px] text-zinc-500 uppercase tracking-wider mb-1">
                Transaction Hash
              </div>
              <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800 text-zinc-300 break-all select-all">
                {txHash}
              </div>
            </div>

            <div className="flex items-center justify-between p-2 rounded bg-zinc-950 border border-zinc-800 text-xs">
              <span className="text-zinc-400">Total Verifications:</span>
              <span className="text-emerald-400 font-bold">#{verificationCount}</span>
            </div>
          </div>
        ) : (
          <div className="py-12 text-center text-xs font-mono text-zinc-500">
            Awaiting local witness evaluation and ZK proof generation.
          </div>
        )}
      </div>
    </div>
  );
}
