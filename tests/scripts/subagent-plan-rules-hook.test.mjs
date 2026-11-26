import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import { runHook, pathWithout, HOOKS_DIR, PROJECT_ROOT } from '../helpers/hook-harness.mjs';

// The built-in Plan subagent does not load the project's .claude/rules (measured 2026-11-26,
// RFC-002); general-purpose and custom agents do. subagent-plan-rules.sh gives Plan the
// minimal-change rule, since Plan decides the scope of a change. Explore is read-only: skipped.
const SCRIPT = path.join(HOOKS_DIR, 'subagent-plan-rules.sh');
const ROOT = path.join(PROJECT_ROOT, '.test-tmp', 'subagent-plan-rules');
const RULE = '# Minimal Change\n\nBuild only what the task needs.\n';
let dir;
let n = 0;

beforeEach(() => {
  dir = path.join(ROOT, `p${++n}`);
  fs.mkdirSync(path.join(dir, '.claude/rules'), { recursive: true });
});
afterAll(() => fs.rmSync(ROOT, { recursive: true, force: true }));

const MODES = [
  ['jq or node', {}],
  ['node fallback (no jq)', { PATH: pathWithout('jq') }],
];

describe.each(MODES)('subagent-plan-rules.sh — %s', (_label, env) => {
  const run = (agent_type) =>
    runHook(
      SCRIPT,
      { hook_event_name: 'SubagentStart', agent_type, cwd: dir },
      { env: { ...env, CLAUDE_PROJECT_DIR: dir } }
    );

  it('gives the Plan subagent the minimal-change rule', () => {
    fs.writeFileSync(path.join(dir, '.claude/rules/24-minimal-change.md'), RULE);
    const r = run('Plan');
    expect(r.status).toBe(0);
    expect(r.json.hookSpecificOutput.hookEventName).toBe('SubagentStart');
    expect(r.json.hookSpecificOutput.additionalContext).toContain('Build only what the task needs.');
  });

  it('stays silent for subagents that already load the project rules', () => {
    fs.writeFileSync(path.join(dir, '.claude/rules/24-minimal-change.md'), RULE);
    for (const t of ['general-purpose', 'Explore', 'bear-common:tdd-coach']) {
      const r = run(t);
      expect(r.status, t).toBe(0);
      expect(r.stdout.trim(), t).toBe('');
    }
  });

  it('stays silent when the project has no minimal-change rule', () => {
    const r = run('Plan');
    expect(r.status).toBe(0);
    expect(r.stdout.trim()).toBe('');
  });
});

describe('hook registration', () => {
  it('hooks.default.json registers the script on SubagentStart for Plan', () => {
    const cfg = JSON.parse(
      fs.readFileSync(path.join(PROJECT_ROOT, 'Dev/i18n/base/Common/hooks/templates/hooks.default.json'), 'utf8')
    );
    const entries = cfg.hooks.SubagentStart ?? [];
    const hit = entries.find(
      (e) => e.matcher === 'Plan' && e.hooks.some((h) => h.command.includes('subagent-plan-rules.sh'))
    );
    expect(hit).toBeTruthy();
  });
});
