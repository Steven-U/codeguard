'use client';

import React from 'react';
import { Lock, Globe, Shield, Terminal } from 'lucide-react';

export function PrivacyBoundary() {
  return (
    <div className="rounded-lg border border-zinc-800 bg-surface p-6">
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80 mb-5">
        <div>
          <h3 className="text-base font-semibold text-zinc-100 flex items-center gap-2">
            <Shield className="w-4 h-4 text-zinc-400" />
            Cryptographic Privacy Boundary
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Zero-knowledge proofs verify compliance predicates over private witnesses without disclosing source text or findings.
          </p>
        </div>
        <span className="text-[11px] font-mono px-2 py-0.5 rounded border border-zinc-700 bg-zinc-800 text-zinc-300">
          Compact v0.23+ &bull; ZKIR
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: Private Witness */}
        <div className="rounded border border-zinc-800 bg-zinc-950 p-4">
          <div className="flex items-center justify-between pb-2.5 border-b border-zinc-800/60 mb-3">
            <span className="flex items-center gap-1.5 text-xs font-mono font-medium text-emerald-400">
              <Lock className="w-3.5 h-3.5" />
              PRIVATE WITNESS (Client-Side)
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase">Never Disclosed</span>
          </div>

          <table className="w-full text-left text-xs font-mono">
            <tbody>
              <tr className="border-b border-zinc-900">
                <td className="py-1.5 text-zinc-400 pr-2">Repository Files</td>
                <td className="py-1.5 text-zinc-300 text-right">Raw source, ASTs, diffs</td>
              </tr>
              <tr className="border-b border-zinc-900">
                <td className="py-1.5 text-zinc-400 pr-2">Agent Context</td>
                <td className="py-1.5 text-zinc-300 text-right">Prompts, thoughts, history</td>
              </tr>
              <tr className="border-b border-zinc-900">
                <td className="py-1.5 text-zinc-400 pr-2">Violations / Findings</td>
                <td className="py-1.5 text-zinc-300 text-right">File paths, line numbers, snippets</td>
              </tr>
              <tr className="border-b border-zinc-900">
                <td className="py-1.5 text-zinc-400 pr-2">Detected Secrets</td>
                <td className="py-1.5 text-zinc-300 text-right">API keys, tokens, credentials</td>
              </tr>
              <tr>
                <td className="py-1.5 text-zinc-400 pr-2">Test Traces</td>
                <td className="py-1.5 text-zinc-300 text-right">Execution logs, stdout/stderr</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Right: Public Ledger */}
        <div className="rounded border border-zinc-800 bg-zinc-950 p-4">
          <div className="flex items-center justify-between pb-2.5 border-b border-zinc-800/60 mb-3">
            <span className="flex items-center gap-1.5 text-xs font-mono font-medium text-indigo-400">
              <Globe className="w-3.5 h-3.5" />
              PUBLIC LEDGER (Midnight Transcript)
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase">On-Chain State</span>
          </div>

          <table className="w-full text-left text-xs font-mono">
            <tbody>
              <tr className="border-b border-zinc-900">
                <td className="py-1.5 text-zinc-400 pr-2">policyHash</td>
                <td className="py-1.5 text-zinc-300 text-right truncate max-w-[160px]" title="0xde8ca453b1a3d3c138f3161533e7ea6c...">
                  0xde8c...7a29
                </td>
              </tr>
              <tr className="border-b border-zinc-900">
                <td className="py-1.5 text-zinc-400 pr-2">scannerHash</td>
                <td className="py-1.5 text-zinc-300 text-right truncate max-w-[160px]" title="0x760fe98c80b2b214eb109e08015015b4...">
                  0x760f...8de1
                </td>
              </tr>
              <tr className="border-b border-zinc-900">
                <td className="py-1.5 text-zinc-400 pr-2">lastArtifactHash</td>
                <td className="py-1.5 text-zinc-300 text-right truncate max-w-[160px]" title="0xc0fe2db586f999aa4df4c797731e42d3...">
                  0xc0fe...03d4
                </td>
              </tr>
              <tr className="border-b border-zinc-900">
                <td className="py-1.5 text-zinc-400 pr-2">verificationCount</td>
                <td className="py-1.5 text-zinc-300 text-right">Uint&lt;64&gt;</td>
              </tr>
              <tr>
                <td className="py-1.5 text-zinc-400 pr-2">attestedArtifacts</td>
                <td className="py-1.5 text-zinc-300 text-right">Map&lt;Bytes&lt;32&gt;, Boolean&gt;</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
