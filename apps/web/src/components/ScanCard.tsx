'use client';

import React from 'react';
import { Search, AlertTriangle, CheckCircle2, ShieldX, Binary } from 'lucide-react';
import type { Finding } from '@codeguard/types';

interface ScanCardProps {
  status: 'idle' | 'scanning' | 'clean' | 'vulnerable';
  artifactHash?: string;
  findings?: Finding[];
  secretCount?: number;
  licenseViolationCount?: number;
  blockedDependencyCount?: number;
}

export function ScanCard({
  status,
  artifactHash = '0x91faa72c18d84b067a840e11892fc0b418a0902827164b38d011749102837461',
  findings = [],
  secretCount = 0,
  licenseViolationCount = 0,
  blockedDependencyCount = 0
}: ScanCardProps) {
  return (
    <div className={`rounded-2xl border p-6 transition-all ${
      status === 'clean'
        ? 'border-emerald-700/60 bg-midnight-900/90 glow-box-green'
        : status === 'vulnerable'
        ? 'border-red-700/60 bg-midnight-900/90 glow-box-red'
        : 'border-slate-800 bg-midnight-900/80'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Search className="w-5 h-5 text-indigo-400" />
          <h4 className="font-semibold text-white">Local Scanner Engine</h4>
        </div>
        <div>
          {status === 'clean' && (
            <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700">
              <CheckCircle2 className="w-3.5 h-3.5" /> COMPLIANT
            </span>
          )}
          {status === 'vulnerable' && (
            <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-red-950 text-red-300 border border-red-700">
              <ShieldX className="w-3.5 h-3.5" /> BLOCKED
            </span>
          )}
          {status === 'scanning' && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-700 animate-pulse">
              SCANNING...
            </span>
          )}
          {status === 'idle' && (
            <span className="text-xs text-slate-400">Ready</span>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <Binary className="w-3.5 h-3.5 text-slate-500" />
            <span>Deterministic Artifact Commitment:</span>
          </div>
          <div className="font-mono text-xs text-slate-300 truncate" title={artifactHash}>
            {artifactHash}
          </div>
        </div>

        {/* Scan Counters */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className={`p-2.5 rounded border ${secretCount > 0 ? 'bg-red-950/30 border-red-800/50 text-red-300' : 'bg-slate-950/40 border-slate-800 text-slate-300'}`}>
            <div className="font-bold text-sm">{secretCount}</div>
            <div className="text-[10px] text-slate-400">Secrets</div>
          </div>
          <div className={`p-2.5 rounded border ${licenseViolationCount > 0 ? 'bg-red-950/30 border-red-800/50 text-red-300' : 'bg-slate-950/40 border-slate-800 text-slate-300'}`}>
            <div className="font-bold text-sm">{licenseViolationCount}</div>
            <div className="text-[10px] text-slate-400">Licenses</div>
          </div>
          <div className={`p-2.5 rounded border ${blockedDependencyCount > 0 ? 'bg-red-950/30 border-red-800/50 text-red-300' : 'bg-slate-950/40 border-slate-800 text-slate-300'}`}>
            <div className="font-bold text-sm">{blockedDependencyCount}</div>
            <div className="text-[10px] text-slate-400">Blocked Deps</div>
          </div>
        </div>

        {/* Findings List (if vulnerable) */}
        {findings.length > 0 && (
          <div className="mt-3 space-y-2 max-h-48 overflow-y-auto">
            <div className="text-xs font-semibold text-red-400 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Safety Violations ({findings.length}):</span>
            </div>
            {findings.map((f, i) => (
              <div key={i} className="p-2.5 rounded bg-red-950/20 border border-red-900/40 text-xs">
                <div className="font-medium text-red-300">{f.message}</div>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                  {f.file} {f.line ? `line ${f.line}` : ''}
                </div>
                {f.snippet && (
                  <div className="mt-1.5 p-1 rounded bg-black/50 text-amber-300/90 font-mono text-[10px] truncate">
                    {f.snippet}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
