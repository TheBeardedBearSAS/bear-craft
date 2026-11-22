import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../..');

// #274 : les exemples de « mauvais code » contenaient des clés `sk_live_…` qui
// déclenchent gitleaks / GitHub push protection dans les projets installés.
// Règle par défaut gitleaks (stripe-access-token) : (sk|rk)_(test|live|prod)_[a-zA-Z0-9]{10,99}.
// On est plus strict : toute clé Stripe-like suivie d'un caractère alphanumérique est interdite.
const STRIPE_LIKE = /\b(?:sk|rk|pk)_(?:test|live|prod)_[A-Za-z0-9]/;
const ROOTS = ['Dev', 'Project', '.claude', 'marketplaces'];

function* walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === 'node_modules' || e.name === '.git') continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (/\.(md|json|template|yaml|yml|sh|mjs|js)$/.test(e.name)) yield p;
  }
}

describe('aucun secret factice reconnu par les scanners', () => {
  it('ne contient aucune clé Stripe-like dans les sources distribuées', () => {
    const offenders = [];
    for (const r of ROOTS) {
      const dir = path.join(ROOT, r);
      if (!fs.existsSync(dir)) continue;
      for (const f of walk(dir)) {
        if (STRIPE_LIKE.test(fs.readFileSync(f, 'utf8'))) offenders.push(path.relative(ROOT, f));
      }
    }
    expect(offenders).toEqual([]);
  });
});
