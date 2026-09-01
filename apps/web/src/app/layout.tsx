import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CodeGuard — Confidential AI Agent Attestation & Safety Engine',
  description: 'Prove your AI agent followed security rules without revealing proprietary source code or prompts. Built on Midnight Network.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-midnight-900 text-slate-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
