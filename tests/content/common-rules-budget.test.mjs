import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../..');
const LANGS = ['en', 'fr', 'es', 'de', 'pt'];

// Common rules are copied to .claude/rules/ and loaded in EVERY session. Measured with
// bear-craft-bench (RFC-002, 2026-11-26): the 10.1.2 rules (~109 KB) cost ~44k tokens per
// session, about 85% of Bear Craft's startup context, for no measurable effect on the code.
// Rules stay short and imperative; the full text lives in .claude/references/base/ (read on demand).
const MAX_RULES_BYTES = 9000;

const rulesDir = (lang) => path.join(ROOT, 'Dev/i18n', lang, 'Common/rules');
const refsDir = (lang) => path.join(ROOT, 'Dev/i18n', lang, 'Common/references');
const ruleFiles = (lang) =>
  fs
    .readdirSync(rulesDir(lang))
    .filter((f) => f.endsWith('.md'))
    .map((f) => path.join(rulesDir(lang), f));

describe('Common rules loaded at launch stay within budget', () => {
  for (const lang of LANGS) {
    it(`${lang}: Common rules total <= ${MAX_RULES_BYTES} bytes`, () => {
      const total = ruleFiles(lang).reduce((n, f) => n + fs.statSync(f).size, 0);
      expect(total).toBeLessThanOrEqual(MAX_RULES_BYTES);
    });

    it(`${lang}: ships the minimal-change rule (RFC-002, rule 24)`, () => {
      expect(fs.existsSync(path.join(rulesDir(lang), '24-minimal-change.md'))).toBe(true);
    });

    it(`${lang}: every rule points to a reference that ships in Common/references`, () => {
      for (const f of ruleFiles(lang)) {
        const content = fs.readFileSync(f, 'utf8');
        const m = content.match(/\.claude\/references\/base\/([a-z-]+\.md)/);
        expect(m, `${path.basename(f)} has no .claude/references/base/ pointer`).not.toBeNull();
        expect(fs.existsSync(path.join(refsDir(lang), m[1])), `${lang}/Common/references/${m[1]}`).toBe(true);
      }
    });
  }
});

// The project CLAUDE.md scaffold is loaded in every session too. It used to carry the whole
// Scrum/BMAD guide (~6 KB); that guide now lives in project-management/README.md.
const MAX_SCAFFOLD_CLAUDE_MD_BYTES = 1500;
const scaffold = (lang, f) => path.join(ROOT, 'Project/i18n', lang, 'scaffold', f);

describe('project CLAUDE.md scaffold stays short', () => {
  for (const lang of LANGS) {
    it(`${lang}: scaffold CLAUDE.md <= ${MAX_SCAFFOLD_CLAUDE_MD_BYTES} bytes and keeps the stack placeholders`, () => {
      const text = fs.readFileSync(scaffold(lang, 'CLAUDE.md'), 'utf8');
      expect(Buffer.byteLength(text)).toBeLessThanOrEqual(MAX_SCAFFOLD_CLAUDE_MD_BYTES);
      expect(text).toMatch(/^\{\{STACK_BLOCK\}\}$/m);
      expect(text).toMatch(/^\{\{QUALITY_BLOCK\}\}$/m);
      expect(text).toContain('project-management/README.md');
    });

    it(`${lang}: project-management README is copied verbatim, so it has no placeholders`, () => {
      const text = fs.readFileSync(scaffold(lang, 'project-management__README.md'), 'utf8');
      expect(text).not.toMatch(/\{\{[A-Z_]+\}\}/);
      expect(text).toContain('/bear-gate:check');
    });
  }
});
