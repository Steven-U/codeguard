import { describe, it, expect } from 'vitest';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
import { computeArtifactCommitment } from './index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootRepoDir = resolve(__dirname, '../../../');

describe('Artifact Commitment Hashing', () => {
  it('computes deterministic artifact commitment for clean demo fixture', () => {
    const fixturePath = resolve(rootRepoDir, 'demo/clean-repo');
    const commitment1 = computeArtifactCommitment(fixturePath);
    const commitment2 = computeArtifactCommitment(fixturePath);

    expect(commitment1.artifactHash).toEqual(commitment2.artifactHash);
    expect(commitment1.artifactHash).toMatch(/^0x[a-f0-9]{64}$/);
    expect(commitment1.totalFiles).toBeGreaterThan(0);
  });

  it('generates different artifact commitments for different repositories', () => {
    const cleanPath = resolve(rootRepoDir, 'demo/clean-repo');
    const vulnerablePath = resolve(rootRepoDir, 'demo/vulnerable-repo');

    const cleanCommitment = computeArtifactCommitment(cleanPath);
    const vulnCommitment = computeArtifactCommitment(vulnerablePath);

    expect(cleanCommitment.artifactHash).not.toEqual(vulnCommitment.artifactHash);
  });
});
