'use client';

import React from 'react';
import { Terminal, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
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
  artifactHash = '0xc0fe2db586f999aa4df4c797731e42d33f5408e3e8fb27197330426389b103d4',
  findings = [],
  secretCount = 0,
  licenseViolationCount = 0,
  blockedDependencyCount = 0
}: ScanCardProps) {
  return (
    <div className={`rounded-lg border bg-surface p-5 flex flex-col justify-between transition-colors ${
      status === 'clean'
        ? 'border-emerald-800/80'
        : status === 'vulnerable'
        ? 'border-red-800/80'
        : 'border-zinc-800'
    }`}>
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80 mb-4">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-zinc-400" />
            <h4 className="text-sm font-semibold text-zinc-200">Local Scanner</h4>
          </div>
          <div>
            {status === 'clean' && (
              <span className="flex items-center gap-1 font-mono text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                <CheckCircle className="w-3 h-3" /> PASS
              </span>
            )}
            {status === 'vulnerable' && (
              <span className="flex items-center gap-1 font-mono text-xs px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800">
                <AlertCircle className="w-3 h-3" /> VIOLATIONS
              </span>
            )}
            {status === 'scanning' && (
              <span className="flex items-center gap-1 font-mono text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                <Loader2 className="w-3 h-3 animate-spin" /> EVALUATING
              </span>
            )}
            {status === 'idle' && (
              <span className="font-mono text-xs text-zinc-500">READY</span>
            )}
          </div>
        </div>

        <div className="mb-4">
          <div className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider mb-1">
            Committed Artifact Hash
          </div>
          <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800 font-mono text-xs text-zinc-300 break-all select-all">
            {artifactHash}
          </div>
        </div>

        {/* Counter Grid */}
        <div className="grid grid-cols-3 gap-2 mb-4 text-center font-mono text-xs">
          <div className={`p-2 rounded border ${secretCount > 0 ? 'bg-red-950/40 border-red-800 text-red-300' : 'bg-zinc-950 border-zinc-800 text-zinc-300'}`}>
            <div className="font-semibold">{secretCount}</div>
            <div className="text-[10px] text-zinc-500">Secrets</div>
          </div>
          <div className={`p-2 rounded border ${licenseViolationCount > 0 ? 'bg-red-950/40 border-red-800 text-red-300' : 'bg-zinc-950 border-zinc-800 text-zinc-300'}`}>
            <div className="font-semibold">{licenseViolationCount}</div>
            <div className="text-[10px] text-zinc-500">Licenses</div>
          </div>
          <div className={`p-2 rounded border ${blockedDependencyCount > 0 ? 'bg-red-950/40 border-red-800 text-red-300' : 'bg-zinc-950 border-zinc-800 text-zinc-300'}`}>
            <div className="font-semibold">{blockedDependencyCount}</div>
            <div className="text-[10px] text-zinc-500">Blocked Deps</div>
          </div>
        </div>

        {/* Findings Snippet Box */}
        {findings.length > 0 && (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {findings.map((f, i) => (
              <div key={i} className="p-2 rounded bg-zinc-950 border border-red-900/60 font-mono text-xs text-red-300">
                <div className="flex items-center justify-between text-[11px] text-red-400">
                  <span>{f.rule}</span>
                  <span>{f.file}{f.line ? `:${f.line}` : ''}</span>
                </div>
                <div className="text-zinc-300 mt-1">{f.message}</div>
                {f.snippet && (
                  <pre className="mt-1 p-1 bg-black rounded text-[10px] text-amber-300/90 overflow-x-auto">
                    {f.snippet}
                  </pre>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
