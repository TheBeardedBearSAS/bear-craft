import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as yaml from 'js-yaml';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../..');

// Every command, skill and agent description is listed to the model in every session of a
// project that enables the bear-* plugins (RFC-002). Keep them to one short line.
const MAX = 100;
const ROOTS = ['Dev/i18n', 'Project/i18n'];

function* walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (
      /\/commands\/[^/]+\.md$|\/skills\/[^/]+\/SKILL\.md$|\/agents\/[^/]+\.md$/.test(p.split(path.sep).join('/'))
    )
      yield p;
  }
}

const files = ROOTS.flatMap((r) => [...walk(path.join(ROOT, r))]);

describe(`command/skill/agent descriptions <= ${MAX} characters`, () => {
  it('finds files to check', () => expect(files.length).toBeGreaterThan(100));
  for (const f of files) {
    const m = fs.readFileSync(f, 'utf8').match(/^---\n([\s\S]*?)\n---/);
    if (!m) continue;
    const fm = yaml.load(m[1]);
    if (!fm || typeof fm.description !== 'string') continue;
    it(path.relative(ROOT, f), () => {
      expect(fm.description.trim().length, fm.description).toBeLessThanOrEqual(MAX);
    });
  }
});
