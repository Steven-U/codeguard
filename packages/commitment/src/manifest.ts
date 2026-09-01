import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { createHash } from 'node:crypto';
import type { ArtifactFileEntry, ArtifactCommitment } from '@codeguard/types';

export const DEFAULT_IGNORE_PATTERNS = [
  /^\.git(\/|$)/,
  /^node_modules(\/|$)/,
  /^dist(\/|$)/,
  /^build(\/|$)/,
  /^\.next(\/|$)/,
  /^\.turbo(\/|$)/,
  /^\.DS_Store$/,
  /\.log$/,
  /^\.env(\.local|\.production|\.development)?$/
];

function shouldIgnore(relativePath: string, ignorePatterns = DEFAULT_IGNORE_PATTERNS): boolean {
  return ignorePatterns.some((pattern) => pattern.test(relativePath));
}

function collectFiles(rootDir: string, currentDir = rootDir): string[] {
  const entries = readdirSync(currentDir);
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = join(currentDir, entry);
    const relPath = relative(rootDir, fullPath).replace(/\\/g, '/');

    if (shouldIgnore(relPath)) {
      continue;
    }

    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      files.push(...collectFiles(rootDir, fullPath));
    } else if (stat.isFile()) {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Builds a deterministic canonical manifest and returns the artifact commitment.
 */
export function computeArtifactCommitment(rootDir: string): ArtifactCommitment {
  const filePaths = collectFiles(rootDir);
  const manifest: ArtifactFileEntry[] = [];
  let totalBytes = 0;

  for (const filePath of filePaths) {
    const relPath = relative(rootDir, filePath).replace(/\\/g, '/');
    const content = readFileSync(filePath);
    const sha256 = createHash('sha256').update(content).digest('hex');
    const size = content.length;
    totalBytes += size;

    manifest.push({
      path: relPath,
      sha256,
      size
    });
  }

  // Sort lexicographically by relative path for strict determinism
  manifest.sort((a, b) => a.path.localeCompare(b.path));

  // Compute root artifact commitment hash from canonical manifest representation
  const manifestContent = manifest.map((entry) => `${entry.path}:${entry.sha256}:${entry.size}`).join('\n');
  const artifactHash = `0x${createHash('sha256').update(manifestContent, 'utf8').digest('hex')}`;

  return {
    artifactHash,
    manifest,
    totalFiles: manifest.length,
    totalBytes
  };
}
