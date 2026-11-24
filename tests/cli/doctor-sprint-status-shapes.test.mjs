import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { cpSync, mkdtempSync, rmSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { runDoctor } from '../../cli/lib/doctor.js';

const FIXTURES = join(import.meta.dirname, '..', 'fixtures');

function exec(cmd) {
  if (cmd.includes('npm')) return '10.0.0';
  if (cmd.includes('claude')) return '2.1.326';
  if (cmd.includes('git')) return 'git version 2.45.0';
  if (cmd.includes('yq')) return 'yq version v4.44.1';
  return null;
}

// Issue #307: data written by 10.1.1 is detected, with the fix to apply.
describe('runDoctor — 10.1.1 sprint-status shapes', () => {
  let dir;
  let spy;
  const out = () => spy.mock.calls.map((c) => String(c[0])).join('\n');
  const run = (fixture) => {
    cpSync(join(FIXTURES, fixture), dir, { recursive: true });
    runDoctor(dir, { execFn: exec, claudeJsonPath: join(dir, 'absent.json') });
  };

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), 'bear-craft-doctor-shapes-'));
    spy = vi.spyOn(console, 'log').mockImplementation(() => {});
  });
  afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
    spy.mockRestore();
    process.exitCode = undefined;
  });

  it('warns about the short metadata.sprint_id and names the folder id', () => {
    run('sprint-status-10.1.1');
    expect(out()).toMatch(/\[WARN\].*metadata\.sprint_id.*"sprint-1".*"sprint-1-walking_skeleton"/);
  });

  it('warns about a story-shaped cross_cutting_tasks block', () => {
    run('sprint-status-10.1.1');
    expect(out()).toMatch(/\[WARN\].*cross_cutting_tasks/);
  });

  it('is silent on a current sprint-status', () => {
    run('bmad-sprint-status');
    expect(out()).not.toMatch(/cross_cutting_tasks|metadata\.sprint_id/);
  });
});
