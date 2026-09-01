/**
 * Canonical JSON serialization (RFC 8785 / JCS compatible subset).
 * Ensures deterministic string representation regardless of key ordering.
 */

export function canonicalizeJson(obj: unknown): string {
  if (obj === null || typeof obj !== 'object') {
    return JSON.stringify(obj);
  }

  if (Array.isArray(obj)) {
    const entries = obj.map((item) => canonicalizeJson(item));
    return `[${entries.join(',')}]`;
  }

  const record = obj as Record<string, unknown>;
  const sortedKeys = Object.keys(record).sort();
  const entries = sortedKeys
    .filter((k) => record[k] !== undefined)
    .map((k) => `${JSON.stringify(k)}:${canonicalizeJson(record[k])}`);

  return `{${entries.join(',')}}`;
}
