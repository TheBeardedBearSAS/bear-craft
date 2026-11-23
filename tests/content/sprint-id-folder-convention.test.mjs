import { readFileSync } from 'node:fs';
import { describe, it, expect } from 'vitest';

// Issue #298: one sprint id everywhere = the sprint folder id (sprint-<N>-<slug>).
const FILES = [
  ...['en', 'fr', 'es', 'de', 'pt'].map((l) => `Dev/i18n/${l}/Workflow/commands/start.md`),
  '.claude/commands/bear-workflow/start.md',
];

describe('/bear-workflow:start writes the folder id as metadata.sprint_id', () => {
  for (const f of FILES) {
    it(f, () => {
      const text = readFileSync(f, 'utf8');
      expect(text).toContain('sprint-{N}-{slug}');
      expect(text).not.toContain('(`sprint-{N}`)');
      expect(text).not.toContain('sprint_id: "sprint-2"');
    });
  }
});
