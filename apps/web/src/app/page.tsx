'use client';

import React from 'react';
import { Shield, Sparkles, Terminal, Github, Lock, CheckCircle } from 'lucide-react';
import { InteractiveDemo } from '@/components/InteractiveDemo';

export default function HomePage() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      {/* Header Section */}
      <header className="text-center mb-12 space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/40 bg-indigo-950/40 text-indigo-300 text-xs font-semibold tracking-wide">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          Midnight Buildathon Wave 1
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-400">
            CodeGuard
          </span>
          <span className="text-slate-400 font-light block text-2xl md:text-3xl mt-2">
            Confidential AI Agent Guardrail & Attestation Engine
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-slate-400 text-base">
          Prove your AI coding agent complied with strict security policies{' '}
          <strong className="text-slate-200">without disclosing source code, prompts, or vulnerability findings</strong>{' '}
          to third parties or public blockchains.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs text-slate-300 font-mono">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
            <Shield className="w-4 h-4 text-indigo-400" />
            <span>Compact Smart Contract v0.23+</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span>Model Context Protocol (MCP)</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span>Zero-Knowledge Proofs</span>
          </div>
        </div>
      </header>

      {/* Interactive Demo Section */}
      <section className="mb-16">
        <InteractiveDemo />
      </section>

      {/* Architecture Overview */}
      <section className="rounded-2xl border border-slate-800 bg-midnight-900/60 p-8 space-y-6">
        <h2 className="text-2xl font-bold text-white">How CodeGuard Works with Midnight</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-xl bg-slate-950/50 border border-slate-800/80 space-y-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-950 text-indigo-400 flex items-center justify-center font-bold text-sm">
              1
            </div>
            <h4 className="font-semibold text-white text-base">Local MCP Interception</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              When Cursor, Claude, or an autonomous coding agent suggests code modifications, CodeGuard MCP intercepts the diff and runs local zero-leakage safety scans (secrets, licenses, blocked deps, tests).
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-950/50 border border-slate-800/80 space-y-3">
            <div className="w-8 h-8 rounded-lg bg-purple-950 text-purple-400 flex items-center justify-center font-bold text-sm">
              2
            </div>
            <h4 className="font-semibold text-white text-base">Local ZK Proof Generation</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              The scan findings are packaged into a private witness. The local Midnight Proof Server evaluates the Compact circuit constraints against the committed artifact hash without disclosing raw files.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-950/50 border border-slate-800/80 space-y-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-950 text-emerald-400 flex items-center justify-center font-bold text-sm">
              3
            </div>
            <h4 className="font-semibold text-white text-base">On-Chain Attestation Registry</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Midnight verifies the zero-knowledge proof and updates the on-chain attestation registry. CI/CD or deployment gates can now trustlessly verify compliance before shipping.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-16 text-center text-xs text-slate-500 border-t border-slate-800/80 pt-8 flex items-center justify-between">
        <div>
          CodeGuard &copy; 2026 &bull; Built for Midnight Buildathon Wave 1
        </div>
        <div className="font-mono text-slate-400">
          Powered by Midnight Network (Zero-Knowledge Architecture)
        </div>
      </footer>
    </main>
  );
}
