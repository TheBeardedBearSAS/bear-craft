/**
 * CLI `doctor` command — environment diagnostics & installation health check.
 * @module cli/lib/doctor
 */

import fs from 'fs';
import path from 'path';
import os from 'os';
import { execSync } from 'child_process';
import c from './colors.js';
import { listDirs } from './fs-utils.js';
import { assertSafeTarget } from './path-safety.js';
import { MIN_CLAUDE_CODE, RECOMMENDED_CLAUDE_CODE, assessClaude } from './claude-code.js';
import { removeDenyRules } from '../../Dev/scripts/lib/merge-hooks.mjs';
import { diagnosePlugins, readInstallJson } from './plugin-install.js';
import * as yaml from 'js-yaml';
import { countPlaceholderTimestamps } from '../kanban/shared/timestamps.js';

/**
 * OS-specific yq installation hints. Returned as a list of one-liner instructions
 * that the user can copy/paste.
 * @returns {string[]}
 */
function yqInstallHints() {
  const platform = os.platform();
  if (platform === 'darwin') {
    return ['brew install yq'];
  }
  if (platform === 'linux') {
    return [
      'sudo apt-get install yq           # Debian/Ubuntu (snap version)',
      'sudo snap install yq              # Snap (Mike Farah build, recommended)',
      'wget https://github.com/mikefarah/yq/releases/latest/download/yq_linux_amd64 -O /usr/local/bin/yq && chmod +x /usr/local/bin/yq',
    ];
  }
  if (platform === 'win32') {
    return ['winget install --id MikeFarah.yq  # Windows native', 'Or use WSL: see Linux instructions above'];
  }
  return ['See https://github.com/mikefarah/yq#install for your platform'];
}

/**
 * Read `permissions.allow` of the project's .claude/settings.json (empty when absent or invalid).
 * @param {string} targetPath
 * @returns {string[]}
 */
function readAllowRules(targetPath) {
  return readPermissionList(targetPath, 'allow');
}

const LEGACY_CREDENTIALS_DENY = 'Read(**/*credentials*)';

const REPLACEMENT_CREDENTIALS_DENY = ['Read(**/credentials.json)', 'Read(**/.credentials*)'];

/**
 * Migrate the legacy `Read(**\/*credentials*)` deny rule: back up settings.json (same mode), drop only that rule,
 * add the narrower replacements. Invalid JSON or a failed write never alters the original file.
 * @param {string} targetPath
 * @returns {'fixed'|'unchanged'|'failed'}
 */
function fixLegacyCredentialsDeny(targetPath) {
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

function readDenyRules(targetPath) {
  return readPermissionList(targetPath, 'deny');
}

function readPermissionList(targetPath, key) {
  try {
    const settings = JSON.parse(fs.readFileSync(path.join(targetPath, '.claude', 'settings.json'), 'utf8'));
    return Array.isArray(settings?.permissions?.[key]) ? settings.permissions[key] : [];
  } catch {
    return [];
  }
}

/**
 * Whether Claude Code recorded the workspace (or a parent directory) as trusted in ~/.claude.json.
 * Headless runs (`claude -p`) skip the trust dialog and silently ignore project permissions on an untrusted workspace.
 * @param {string} targetPath
 * @param {string} claudeJsonPath
 * @returns {boolean}
 */
function isWorkspaceTrusted(targetPath, claudeJsonPath) {
  let projects;
  try {
    projects = JSON.parse(fs.readFileSync(claudeJsonPath, 'utf8'))?.projects ?? {};
  } catch {
    return false;
  }
  const candidates = new Set([path.resolve(targetPath)]);
  try {
    candidates.add(fs.realpathSync(targetPath));
  } catch {
    // keep the resolved path only
  }
  for (const start of candidates) {
    for (let dir = start; ; dir = path.dirname(dir)) {
      if (projects[dir]?.hasTrustDialogAccepted === true) return true;
      if (path.dirname(dir) === dir) break;
    }
  }
  return false;
}

/**
 * Run a shell command and return the trimmed output, or null on failure.
 * @param {string} cmd - Shell command to execute
 * @returns {string|null}
 */
function tryExec(cmd) {
  try {
    return execSync(cmd, { encoding: 'utf8', timeout: 10_000 }).trim();
  } catch {
    return null;
  }
}

// --- Placeholder timestamps check (#272) ---
const STATUS_FILES = ['sprint-status.yaml', 'workflow-status.yaml'];

function countPlaceholderTimestampsInStatusFiles(targetPath) {
  let total = 0;
  for (const name of STATUS_FILES) {
    try {
      const text = fs.readFileSync(path.join(targetPath, '.bmad', name), 'utf8');
      total += countPlaceholderTimestamps(yaml.load(text));
    } catch {
      // absent or malformed: nothing to report here
    }
  }
  return total;
}
// --- end placeholder timestamps check ---

/**
 * Run the doctor command against a target directory.
 * @param {string} targetPath - Absolute path to the project directory
 * @param {Object} [deps] - Injectable dependencies for testing
 * @param {function} [deps.execFn] - Custom exec function
 */
function runDoctor(targetPath, deps = {}) {
  const exec = deps.execFn || tryExec;
  // Defense-in-depth: refuse system targets even in read-only commands (CC-REL-05).
  const safeTarget = assertSafeTarget(targetPath);
  let passed = 0;
  let failed = 0;
  let warned = 0;

  console.log(`\n${c.bold}Bear Craft Doctor — Environment Diagnostics${c.reset}`);
  console.log(`${c.dim}Directory: ${safeTarget}${c.reset}\n`);
  targetPath = safeTarget;

  // 1. Node.js version >= 20
  const nodeVer = process.version;
  const major = Number.parseInt(nodeVer.slice(1), 10);
  if (major >= 20) {
    console.log(`  ${c.green}[OK]${c.reset} Node.js ${nodeVer}`);
    passed++;
  } else {
    console.log(`  ${c.red}[FAIL]${c.reset} Node.js ${nodeVer} — requires >= 20`);
    failed++;
  }

  // 2. npm available
  const npmVer = exec('npm --version');
  if (npmVer) {
    console.log(`  ${c.green}[OK]${c.reset} npm ${npmVer}`);
    passed++;
  } else {
    console.log(`  ${c.red}[FAIL]${c.reset} npm not found`);
    failed++;
  }

  // 3. Claude Code installed and >= MIN_CLAUDE_CODE (security baseline)
  const claudeVerRaw = exec('claude --version');
  const claude = assessClaude(claudeVerRaw);
  if (claude.found) {
    if (claude.tooOld) {
      console.log(
        `  ${c.red}[FAIL]${c.reset} Claude Code ${claude.version} — requires >= ${MIN_CLAUDE_CODE} (security fixes: CVE-2026-86063, CVE-2026-103435, CVE-2026-103012)`
      );
      console.log(`         Upgrade: ${c.cyan}npm install -g @anthropic-ai/claude-code@latest${c.reset}`);
      failed++;
    } else if (claude.belowRecommended) {
      console.log(
        `  ${c.yellow}[WARN]${c.reset} Claude Code ${claude.version} — recommended ${RECOMMENDED_CLAUDE_CODE} (latest permission fixes)`
      );
      warned++;
    } else {
      console.log(`  ${c.green}[OK]${c.reset} Claude Code ${claude.version || claude.raw}`);
      passed++;
    }
  } else {
    console.log(
      `  ${c.red}[FAIL]${c.reset} Claude Code not found (required: bear-craft installs its plugins through it)`
    );
    console.log(`         Install: ${c.cyan}npm install -g @anthropic-ai/claude-code${c.reset}`);
    failed++;
  }

  // 4. Git available
  const gitVer = exec('git --version');
  if (gitVer) {
    console.log(`  ${c.green}[OK]${c.reset} ${gitVer}`);
    passed++;
  } else {
    console.log(`  ${c.red}[FAIL]${c.reset} git not found`);
    failed++;
  }

  // 5. yq available (Mike Farah version) — required for monorepo YAML config (claude-projects.yaml)
  const yqVer = exec('yq --version');
  if (yqVer) {
    console.log(`  ${c.green}[OK]${c.reset} ${yqVer}`);
    passed++;
  } else {
    console.log(
      `  ${c.yellow}[WARN]${c.reset} yq not found (required for monorepo YAML config — claude-projects.yaml)`
    );
    for (const hint of yqInstallHints()) {
      console.log(`         ${c.cyan}${hint}${c.reset}`);
    }
    warned++;
  }

  // 6. .claude/ structure integrity
  const claudeDir = path.join(targetPath, '.claude');
  if (fs.existsSync(claudeDir)) {
    console.log(`  ${c.green}[OK]${c.reset} .claude/ directory exists`);
    passed++;

    // Check required subdirs: a plugin installation (.bear-craft/install.json) only copies references
    const pluginInstall = readInstallJson(targetPath) !== null;
    const requiredDirs = pluginInstall ? ['references'] : ['commands', 'agents', 'references', 'skills'];
    for (const dir of requiredDirs) {
      if (fs.existsSync(path.join(claudeDir, dir))) {
        console.log(`  ${c.green}[OK]${c.reset} .claude/${dir}/`);
        passed++;
      } else {
        console.log(`  ${c.yellow}[WARN]${c.reset} .claude/${dir}/ missing`);
        warned++;
      }
    }

    // CLAUDE.md
    if (fs.existsSync(path.join(claudeDir, 'CLAUDE.md'))) {
      console.log(`  ${c.green}[OK]${c.reset} .claude/CLAUDE.md`);
      passed++;
    } else {
      console.log(`  ${c.yellow}[WARN]${c.reset} .claude/CLAUDE.md missing`);
      warned++;
    }
  } else {
    console.log(`  ${c.yellow}[WARN]${c.reset} .claude/ directory not found (not installed here)`);
    warned++;
  }

  // 6a. Workspace trust: permissions.allow is ignored by headless runs on an untrusted workspace
  if (readAllowRules(targetPath).length > 0) {
    const claudeJsonPath =
      deps.claudeJsonPath || path.join(process.env.CLAUDE_CONFIG_DIR || os.homedir(), '.claude.json');
    if (isWorkspaceTrusted(targetPath, claudeJsonPath)) {
      console.log(`  ${c.green}[OK]${c.reset} Workspace trusted (permissions.allow applies)`);
      passed++;
    } else {
      console.log(
        `  ${c.yellow}[WARN]${c.reset} Workspace not trusted — permissions.allow in .claude/settings.json is silently ignored by headless runs (claude -p)`
      );
      console.log(`         Open ${c.cyan}claude${c.reset} once in this directory and accept the trust dialog`);
      warned++;
    }
  }

  // 6a'. Legacy deny rule that blocks writing docs/ADR/stories mentioning "credentials" (#275)
  if (deps.fix === true && fs.existsSync(path.join(targetPath, '.claude', 'settings.json'))) {
    if (fixLegacyCredentialsDeny(targetPath) === 'failed') failed++;
  }
  if (readDenyRules(targetPath).includes(LEGACY_CREDENTIALS_DENY)) {
    console.log(
      `  ${c.yellow}[WARN]${c.reset} .claude/settings.json still denies ${LEGACY_CREDENTIALS_DENY} (blocks docs, ADRs and stories whose name contains "credentials")`
    );
    console.log(
      `         Run ${c.cyan}bear-craft doctor --fix${c.reset} (or replace it with Read(**/credentials.json) and Read(**/.credentials*) in permissions.deny)`
    );
    warned++;
  }

  // 6b. Plugins: marketplace copy, settings.json entries and registration on this machine
  const runFn =
    deps.runFn ||
    ((cmd, args) => {
      const out = exec([cmd, ...args].join(' '));
      return { status: out === null ? 1 : 0, stdout: out ?? '', stderr: '' };
    });
  for (const { level, message } of diagnosePlugins(targetPath, { execFn: runFn })) {
    if (level === 'ok') {
      console.log(`  ${c.green}[OK]${c.reset} ${message}`);
      passed++;
    } else if (level === 'warn') {
      console.log(`  ${c.yellow}[WARN]${c.reset} ${message}`);
      warned++;
    } else {
      console.log(`  ${c.red}[FAIL]${c.reset} ${message}`);
      failed++;
    }
  }

  // 7. Shell scripts have execute permissions
  const scriptsDir = path.join(targetPath, 'Dev', 'scripts');
  if (fs.existsSync(scriptsDir)) {
    try {
      const files = fs.readdirSync(scriptsDir).filter((f) => f.endsWith('.sh'));
      let execCount = 0;
      let noExecCount = 0;
      for (const f of files) {
        try {
          fs.accessSync(path.join(scriptsDir, f), fs.constants.X_OK);
          execCount++;
        } catch {
          noExecCount++;
        }
      }
      if (noExecCount === 0 && execCount > 0) {
        console.log(`  ${c.green}[OK]${c.reset} Shell scripts executable (${execCount} scripts)`);
        passed++;
      } else if (noExecCount > 0) {
        console.log(`  ${c.yellow}[WARN]${c.reset} ${noExecCount} script(s) missing execute permission`);
        warned++;
      }
    } catch {
      // scriptsDir not readable
    }
  }

  // 7b. Placeholder timestamps in status files (#272) — warning only
  const placeholders = countPlaceholderTimestampsInStatusFiles(targetPath);
  if (placeholders > 0) {
    console.log(
      `  ${c.yellow}[WARN]${c.reset} ${placeholders} placeholder timestamp(s) (T00:00:00Z) in .bmad/sprint-status.yaml / workflow-status.yaml — use the real current time`
    );
    warned++;
  }

  // 8. i18n base dirs
  const i18nBase = path.join(targetPath, 'Dev', 'i18n');
  if (fs.existsSync(i18nBase)) {
    const langs = listDirs(i18nBase);
    if (langs.length > 0) {
      console.log(`  ${c.green}[OK]${c.reset} i18n base dirs: ${c.cyan}${langs.join(', ')}${c.reset}`);
      passed++;
    } else {
      console.log(`  ${c.yellow}[WARN]${c.reset} i18n/ exists but no language dirs found`);
      warned++;
    }
  }

  // Summary
  console.log('');
  if (failed === 0 && warned === 0) {
    console.log(`${c.green}All checks passed! (${passed} OK)${c.reset}\n`);
  } else if (failed === 0) {
    console.log(`${c.green}${passed} passed${c.reset}, ${c.yellow}${warned} warning(s)${c.reset}\n`);
  } else {
    console.log(
      `${c.green}${passed} passed${c.reset}, ${c.red}${failed} failed${c.reset}, ${c.yellow}${warned} warning(s)${c.reset}\n`
    );
    process.exitCode = 1;
  }
}

export { runDoctor };
