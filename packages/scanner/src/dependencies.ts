import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Finding, Policy } from '@codeguard/types';

export async function scanDependencies(rootDir: string, policy: Policy): Promise<Finding[]> {
  const findings: Finding[] = [];
  const blockedList = policy.rules.blockedDependencies ?? [];

  const pkgJsonPath = join(rootDir, 'package.json');
  if (existsSync(pkgJsonPath)) {
    try {
      const content = JSON.parse(readFileSync(pkgJsonPath, 'utf8'));
      const allDeps = {
        ...content.dependencies,
        ...content.devDependencies,
        ...content.peerDependencies
      };

      for (const blocked of blockedList) {
        if (blocked.includes('@')) {
          const [blockedName, blockedVer] = blocked.split('@');
          if (allDeps[blockedName]) {
            const installedVer = allDeps[blockedName].replace(/^[\^~>=<]/, '');
            if (installedVer === blockedVer || allDeps[blockedName].includes(blockedVer)) {
              findings.push({
                type: 'dependency',
                severity: 'critical',
                rule: `blocked-dependency:${blocked}`,
                message: `Dependency '${blocked}' is explicitly blocked by enterprise policy`,
                file: 'package.json',
                package: blocked
              });
            }
          }
        } else {
          // Blocked by package name
          if (allDeps[blocked]) {
            findings.push({
              type: 'dependency',
              severity: 'critical',
              rule: `blocked-dependency:${blocked}`,
              message: `Package '${blocked}' is blocklisted by enterprise policy`,
              file: 'package.json',
              package: blocked
            });
          }
        }
      }
    } catch (err) {
      console.warn(`[CodeGuard] Failed to parse package.json for dependency scan:`, err);
    }
  }

  return findings;
}
