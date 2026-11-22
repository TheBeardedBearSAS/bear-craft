import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { runDoctor } from '../../cli/lib/doctor.js';

function exec(cmd) {
  if (cmd.includes('npm')) return '10.0.0';
  if (cmd.includes('claude')) return '2.1.326';
  if (cmd.includes('git')) return 'git version 2.45.0';
  if (cmd.includes('yq')) return 'yq version v4.44.1';
  return null;
}

describe('runDoctor — placeholder timestamps', () => {
  let dir;
  let spy;
  const out = () => spy.mock.calls.map((c) => String(c[0])).join('\n');
  const run = () => runDoctor(dir, { execFn: exec, claudeJsonPath: join(dir, 'absent.json') });
  const put = (rel, text) => {
    mkdirSync(join(dir, rel, '..'), { recursive: true });
    writeFileSync(join(dir, rel), text);
  };

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), 'bear-craft-doctor-ts-'));
    spy = vi.spyOn(console, 'log').mockImplementation(() => {});
  });
  afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
    spy.mockRestore();
    process.exitCode = undefined;
  });

  it('warns with the count of placeholder entries across both status files', () => {
    put(
      '.bmad/sprint-status.yaml',
      'stories:\n  US-1:\n    history:\n      - {timestamp: "2026-01-01T00:00:00Z"}\n      - {timestamp: "2026-01-01T08:00:00Z"}\n'
    );
    put('.bmad/workflow-status.yaml', 'history:\n  - timestamp: 2026-01-02T00:00:00Z\n');
    run();
    expect(out()).toMatch(/\[WARN\].*2.*placeholder/i);
    expect(process.exitCode).toBeUndefined();
  });

  it('is silent when files are absent', () => {
    run();
    expect(out()).not.toMatch(/placeholder/i);
  });

  it('is silent when timestamps are real', () => {
    put('.bmad/sprint-status.yaml', 'stories:\n  US-1:\n    history:\n      - {timestamp: "2026-01-01T08:00:00Z"}\n');
    run();
    expect(out()).not.toMatch(/placeholder/i);
  });

  it('does not crash on a malformed file', () => {
    put('.bmad/sprint-status.yaml', 'a: [unclosed\n');
    expect(() => run()).not.toThrow();
  });
});
