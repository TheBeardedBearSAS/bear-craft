import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../..');

// #274 : les exemples de « mauvais code » contenaient des clés factices (`sk_live_…`, `sk-live-…`,
// JWT `eyJ…`) qui déclenchent gitleaks / GitHub push protection dans les projets installés.
// Seuls des placeholders non matchants (`<YOUR_API_KEY>`, `<ACCESS_TOKEN>`) sont acceptés.
const PATTERNS = {
  stripe: /\b(?:sk|rk|pk)[-_](?:test|live|prod)[-_][A-Za-z0-9]/,
  openai: /\bsk-(?:proj-|ant-)?[A-Za-z0-9_-]{16,}/,
  aws: /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b(?<!EXAMPLE)/,
  github: /\b(?:ghp_|gho_|ghs_|github_pat_)[A-Za-z0-9_]{20,}/,
  slack: /\bxox[baprs]-[A-Za-z0-9-]{10,}/,
  jwt: /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{5,}/,
};
const ROOTS = ['Dev', 'Project', 'Infra', '.claude', 'marketplaces'];

function* walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === 'node_modules' || e.name === '.git') continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (e.isFile()) yield p;
  }
}

describe('aucun secret factice reconnu par les scanners', () => {
  it('ne contient aucune clé factice dans les sources distribuées', () => {
    const offenders = [];
    for (const r of ROOTS) {
      const dir = path.join(ROOT, r);
      if (!fs.existsSync(dir)) continue;
      for (const f of walk(dir)) {
        const text = fs.readFileSync(f, 'utf8');
        if (text.includes('\0')) continue;
        for (const [name, re] of Object.entries(PATTERNS)) {
          if (re.test(text)) offenders.push(`${name}: ${path.relative(ROOT, f)}`);
        }
      }
    }
    expect(offenders).toEqual([]);
  });
});
