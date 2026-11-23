/**
 * Migrations of an existing `.claude/settings.json` (shared by `doctor --fix` and `update`).
 * @module cli/lib/settings-migrate
 */

import fs from 'fs';
import path from 'path';
import c from './colors.js';
import { removeDenyRules } from '../../Dev/scripts/lib/merge-hooks.mjs';

export const LEGACY_CREDENTIALS_DENY = 'Read(**/*credentials*)';

// #295 : `Read(**/.env.*)` bloquait aussi .env.dist / .env.example (gabarits sans secret).
export const LEGACY_ENV_DENY = 'Read(**/.env.*)';

const REPLACEMENT_ENV_DENY = [
  'Read(**/.env.local)',
  'Read(**/.env.*.local)',
  'Read(**/.env.production*)',
  'Read(**/.env.prod*)',
  'Read(**/.env.staging*)',
  'Read(**/.env.development*)',
  'Read(**/.env.test*)',
];

const REPLACEMENT_CREDENTIALS_DENY = [
  'Read(**/*credentials.json)',
  'Read(**/credentials.tfrc.json)',
  'Read(**/.credentials*)',
  'Read(**/.aws/credentials)',
  'Read(**/.git-credentials)',
];

/**
 * Migrate the legacy `Read(**\/*credentials*)` and `Read(**\/.env.*)` deny rules: back up settings.json (same mode),
 * drop only those rules, add the narrower replacements. Invalid JSON or a failed write never alters the original file.
 * @param {string} targetPath
 * @returns {'fixed'|'unchanged'|'failed'}
 */
export function fixLegacyCredentialsDeny(targetPath) {
  const file = path.join(targetPath, '.claude', 'settings.json');
  const fail = (msg) => {
    console.log(`  ${c.red}[FAIL]${c.reset} ${msg}`);
    return 'failed';
  };
  let raw;
  let settings;
  try {
    raw = fs.readFileSync(file, 'utf8');
    settings = JSON.parse(raw);
  } catch {
    return fail('.claude/settings.json is invalid JSON — not modified, fix it by hand');
  }
  if (settings === null || typeof settings !== 'object' || Array.isArray(settings)) {
    return fail('.claude/settings.json is invalid JSON (not an object) — not modified, fix it by hand');
  }
  const { settings: next, removed } = removeDenyRules(settings, [LEGACY_CREDENTIALS_DENY, LEGACY_ENV_DENY]);
  if (removed === 0) return 'unchanged';
  const hadRule = (rule) => settings.permissions.deny.includes(rule);
  const replacements = [
    ...(hadRule(LEGACY_CREDENTIALS_DENY) ? REPLACEMENT_CREDENTIALS_DENY : []),
    ...(hadRule(LEGACY_ENV_DENY) ? REPLACEMENT_ENV_DENY : []),
  ];
  for (const rule of replacements) {
    if (!next.permissions.deny.includes(rule)) next.permissions.deny.push(rule);
  }
  const stamp = new Date().toISOString().replaceAll(/[-:.]/g, '');
  const backup = `${file}.bak-${stamp}`;
  const tmp = `${file}.tmp-${process.pid}`;
  try {
    const mode = fs.statSync(file).mode & 0o777;
    fs.writeFileSync(backup, raw, { mode });
    fs.chmodSync(backup, mode);
    fs.writeFileSync(tmp, `${JSON.stringify(next, null, 2)}\n`, { mode });
    fs.chmodSync(tmp, mode);
    fs.renameSync(tmp, file);
  } catch (error) {
    fs.rmSync(tmp, { force: true });
    fs.rmSync(backup, { force: true });
    return fail(`Could not write .claude/settings.json (${error.code || error.message}) — original left intact`);
  }
  console.log(
    `  ${c.green}[FIXED]${c.reset} Replaced legacy deny rule(s) with ${replacements.join(', ')} (backup: ${path.basename(backup)})`
  );
  return 'fixed';
}
