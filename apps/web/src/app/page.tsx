'use client';

import React from 'react';
import { Shield, Terminal, Lock, CheckCircle, ArrowUpRight } from 'lucide-react';
import { InteractiveDemo } from '@/components/InteractiveDemo';

export default function HomePage() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-10 space-y-10">
      {/* Top Header */}
      <header className="border-b border-zinc-800/80 pb-8 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                Midnight Buildathon Wave 1
              </span>
              <span className="text-xs font-mono text-zinc-500">
                Akindo Hackathon
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-100">
              CodeGuard
            </h1>
            <p className="text-sm text-zinc-400 mt-1 max-w-2xl">
              Confidential AI agent guardrail &amp; attestation protocol. Prove your coding agent satisfied enterprise security policies without disclosing source code, prompts, or vulnerability findings.
            </p>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <a
              href="https://github.com/steven-u/codeguard"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded border border-zinc-700 bg-zinc-900 text-zinc-200 hover:bg-zinc-800 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <span>Repository</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500" />
            </a>
            <a
              href="https://docs.midnight.network"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded border border-zinc-700 bg-zinc-900 text-zinc-200 hover:bg-zinc-800 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <span>Midnight Docs</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500" />
            </a>
          </div>
        </div>

        {/* Technical Badges */}
        <div className="flex flex-wrap items-center gap-2 pt-2 text-xs font-mono text-zinc-400">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800">
            <Shield className="w-3.5 h-3.5 text-indigo-400" />
            <span>Compact Circuit (v0.23+)</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800">
            <Terminal className="w-3.5 h-3.5 text-zinc-300" />
            <span>Model Context Protocol (MCP)</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Zero-Knowledge Proofs</span>
          </div>
        </div>
      </header>

      {/* Main Interactive Demo & Test Stepper */}
      <section>
        <InteractiveDemo />
      </section>

      {/* Technical Protocol Architecture */}
      <section className="rounded-lg border border-zinc-800 bg-surface p-6 space-y-6">
        <h2 className="text-base font-semibold text-zinc-100">
          Protocol Architecture &amp; Execution Pipeline
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded border border-zinc-800/80 bg-zinc-950 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-zinc-400">01 / LOCAL SCAN</span>
              <span className="text-[10px] font-mono text-zinc-500">MCP TOOL</span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              When an AI agent modifies code, CodeGuard’s local MCP tool intercepts the change. It executes deterministic regex &amp; entropy checks for secrets, scans dependencies for copyleft licenses, and checks blocklisted packages.
            </p>
          </div>

          <div className="p-4 rounded border border-zinc-800/80 bg-zinc-950 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-zinc-400">02 / COMPACT PROOF</span>
              <span className="text-[10px] font-mono text-zinc-500">ZK CIRCUIT</span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              The local Midnight Proof Server ingests the scan metrics as a private witness. The Compact circuit verifies that <code className="text-zinc-200">secretCount == 0</code> and that the evaluated policy matches the registered on-chain hash.
            </p>
          </div>

          <div className="p-4 rounded border border-zinc-800/80 bg-zinc-950 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-zinc-400">03 / LEDGER REGISTRY</span>
              <span className="text-[10px] font-mono text-zinc-500">ATTESTATION</span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Midnight verifies the ZK proof on-chain and updates the public attestation counter. Downstream CI/CD deployment pipelines verify compliance without ever having access to the developer’s private source code.
            </p>
          </div>
        </div>
      </section>

      {/* Terminal Quickstart */}
      <section className="rounded-lg border border-zinc-800 bg-surface p-6 space-y-4">
        <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
          <Terminal className="w-4 h-4 text-zinc-400" />
          Developer CLI Quickstart
        </h3>
        <div className="p-3.5 rounded bg-zinc-950 border border-zinc-800/80 font-mono text-xs text-zinc-300 space-y-2">
          <div className="text-zinc-500"># 1. Run all 15 unit and circuit tests</div>
          <div className="text-zinc-200">pnpm test</div>
          <div className="text-zinc-500 pt-1"># 2. Run automated 2-minute demonstration</div>
          <div className="text-zinc-200">pnpm demo:scan</div>
          <div className="text-zinc-500 pt-1"># 3. Recompile Midnight Compact contract</div>
          <div className="text-zinc-200">pnpm --filter @codeguard/contract compact</div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-6 border-t border-zinc-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 font-mono gap-2">
        <div>
          CodeGuard &bull; Confidential AI Agent Guardrail Engine
        </div>
        <div>
          Built for Midnight Network &bull; Apache-2.0
        </div>
      </footer>
    </main>
  );
}
