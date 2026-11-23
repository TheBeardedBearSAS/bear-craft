import { describe, it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const CLI = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../cli/index.js');

describe('bear-craft kanban --help (#271)', () => {
  for (const flag of ['--help', '-h']) {
    it(`prints the usage and exits 0 without starting the server (${flag})`, () => {
      const res = spawnSync(process.execPath, [CLI, 'kanban', flag], {
        encoding: 'utf8',
        timeout: 8000,
        cwd: path.dirname(CLI),
      });
      expect(res.error).toBeUndefined();
      expect(res.status).toBe(0);
      expect(res.stdout).toContain('Usage');
      expect(res.stdout).toContain('--port');
      expect(res.stdout).toContain('--readonly');
      expect(res.stdout).not.toMatch(/localhost:\d+|listening/i);
    });
  }
});
