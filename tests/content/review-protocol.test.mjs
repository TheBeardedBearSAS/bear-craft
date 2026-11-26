import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../..');
const LANGS = ['en', 'fr', 'es', 'de', 'pt'];
const POINTER = '.claude/references/base/review-protocol.md';

// RFC-002 phase 3: every stack reviewer reads the code around the diff and writes structured
// findings, through one shared protocol file (additive: the 100-point scoring is unchanged).
const reviewers = (lang) => {
  const base = path.join(ROOT, 'Dev/i18n', lang);
  return fs
    .readdirSync(base)
    .map((tech) => path.join(base, tech, 'agents'))
    .filter((d) => fs.existsSync(d))
    .flatMap((d) =>
      fs
        .readdirSync(d)
        .filter((f) => f.endsWith('-reviewer.md'))
        .map((f) => path.join(d, f))
    );
};

describe('review protocol', () => {
  for (const lang of LANGS) {
    it(`${lang}: ships Common/references/review-protocol.md`, () => {
      expect(fs.existsSync(path.join(ROOT, 'Dev/i18n', lang, 'Common/references/review-protocol.md'))).toBe(true);
    });

    it(`${lang}: every stack reviewer points to the protocol`, () => {
      const files = reviewers(lang);
      expect(files.length).toBeGreaterThanOrEqual(15);
      for (const f of files) expect(fs.readFileSync(f, 'utf8'), path.relative(ROOT, f)).toContain(POINTER);
    });
  }
});
