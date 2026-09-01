import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Finding, Policy } from '@codeguard/types';

export async function scanLicenses(rootDir: string, policy: Policy): Promise<Finding[]> {
  const findings: Finding[] = [];
  const prohibited = new Set((policy.rules.prohibitedLicenses ?? []).map((l) => l.toUpperCase()));

  const pkgJsonPath = join(rootDir, 'package.json');
  if (existsSync(pkgJsonPath)) {
    try {
      const content = JSON.parse(readFileSync(pkgJsonPath, 'utf8'));
      const rootLicense = (content.license || content.licenses || '').toString().toUpperCase();

      for (const forbidden of prohibited) {
        if (rootLicense.includes(forbidden)) {
          findings.push({
            type: 'license',
            severity: 'critical',
            rule: `license-policy:${forbidden}`,
            message: `Root package license '${rootLicense}' violates prohibited license policy (${forbidden})`,
            file: 'package.json'
          });
        }
      }

      // Check dependencies if metadata or known license annotations are present
      const deps = { ...content.dependencies, ...content.devDependencies };
      for (const [depName, version] of Object.entries(deps)) {
        // Check for common restrictive GPL-only packages or annotations
        if (depName.includes('gpl') || depName.includes('agpl')) {
          findings.push({
            type: 'license',
            severity: 'high',
            rule: 'license-policy:prohibited-copyleft',
            message: `Dependency '${depName}@${version}' appears to be licensed under a prohibited copyleft license`,
            file: 'package.json',
            package: depName
          });
        }
      }
    } catch (err) {
      console.warn(`[CodeGuard] Failed to parse package.json for license scan:`, err);
    }
  }

  return findings;
}
