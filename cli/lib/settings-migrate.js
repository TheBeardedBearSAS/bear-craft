/**
 * Migrations of an existing `.claude/settings.json` (shared by `doctor --fix` and `update`).
 * @module cli/lib/settings-migrate
 */

import fs from 'fs';
import path from 'path';
import c from './colors.js';
import { removeDenyRules } from '../../Dev/scripts/lib/merge-hooks.mjs';

export const LEGACY_CREDENTIALS_DENY = 'Read(**/*credentials*)';

const REPLACEMENT_CREDENTIALS_DENY = [
  'Read(**/*credentials.json)',
  'Read(**/credentials.tfrc.json)',
  'Read(**/.credentials*)',
  'Read(**/.aws/credentials)',
  'Read(**/.git-credentials)',
];

/**
 * Migrate the legacy `Read(**\/*credentials*)` deny rule: back up settings.json (same mode), drop only that rule,
 * add the narrower replacements. Invalid JSON or a failed write never alters the original file.
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
  const { settings: next, removed } = removeDenyRules(settings, [LEGACY_CREDENTIALS_DENY]);
  if (removed === 0) return 'unchanged';
  for (const rule of REPLACEMENT_CREDENTIALS_DENY) {
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
    `  ${c.green}[FIXED]${c.reset} Replaced ${LEGACY_CREDENTIALS_DENY} with ${REPLACEMENT_CREDENTIALS_DENY.join(', ')} (backup: ${path.basename(backup)})`
  );
  return 'fixed';
}
