// Detection (warning only) of placeholder timestamps such as "2026-11-22T00:00:00Z",
// written when a command guessed the date instead of using the real clock (#272).
// Midnight sharp can be legitimate, so callers must warn, never reject.
const PLACEHOLDER_RE = /^\d{4}-\d{2}-\d{2}T00:00:00(\.0+)?Z$/;

export function isPlaceholderTimestamp(ts) {
  return typeof ts === 'string' && PLACEHOLDER_RE.test(ts);
}

/**
 * Count placeholder values under any `timestamp` key of a parsed YAML document.
 * Unquoted YAML timestamps arrive as Date objects, hence the ISO conversion.
 */
export function countPlaceholderTimestamps(node) {
  if (Array.isArray(node)) return node.reduce((n, v) => n + countPlaceholderTimestamps(v), 0);
  if (!node || typeof node !== 'object' || node instanceof Date) return 0;
  let count = 0;
  for (const [key, value] of Object.entries(node)) {
    if (key === 'timestamp') {
      const ts = value instanceof Date && !Number.isNaN(value.getTime()) ? value.toISOString() : value;
      if (isPlaceholderTimestamp(ts)) count++;
    } else {
      count += countPlaceholderTimestamps(value);
    }
  }
  return count;
}
