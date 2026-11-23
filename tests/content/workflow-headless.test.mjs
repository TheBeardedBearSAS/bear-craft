import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { NOT_RUN } from './headless-lint.mjs';

// #266: /bear-workflow:design must not block in plan mode nor loop on ScheduleWakeup under `claude -p`.
// #267: /bear-workflow:plan --only=prd must run (or explicitly report skipping) /bear-gate:check prd.
const ROOT = path.resolve(import.meta.dirname, '../..');
const LANGS = ['en', 'fr', 'es', 'de', 'pt'];

const layers = [
  { name: '.claude', dir: '.claude/commands/bear-workflow' },
  ...LANGS.map((l) => ({ name: `Dev/i18n/${l}`, dir: `Dev/i18n/${l}/Workflow/commands` })),
  ...LANGS.map((l) => ({ name: `marketplaces/${l}`, dir: `marketplaces/${l}/plugins/bear-workflow/commands` })),
];

const read = (dir, file) => fs.readFileSync(path.join(ROOT, dir, file), 'utf8');

describe.each(layers)('headless-safe workflow commands ($name)', ({ dir }) => {
  it('design: headless mode writes the plan to a file, no plan mode, no ScheduleWakeup', () => {
    const md = read(dir, 'design.md');
    expect(md).toMatch(/Headless/i);
    expect(md).toContain('claude -p');
    expect(md).toContain('ScheduleWakeup');
    expect(md).toContain('project-management/design-plan.md');
  });

  it('design: the "mandatory plan mode" line carries the headless exception; no --continue ambiguity; no interactive stack question', () => {
    const lines = read(dir, 'design.md').split('\n');
    const i = lines.findIndex((l) => l.startsWith('## Plan Mode'));
    const first = lines.slice(i).find((l) => l.startsWith('> **'));
    expect(first).toContain('claude -p');
    const headless = lines.find((l) => l.includes('ScheduleWakeup'));
    expect(headless).not.toContain('--continue');
    expect(lines.join('\n')).toContain('CLAUDE.md');
  });

  it('design: the design review gate invokes /bear-gate:check spec or states NOT RUN', () => {
    const md = read(dir, 'design.md');
    expect(md).toContain('/bear-gate:check spec');
    expect(md).toMatch(NOT_RUN);
  });

  it('implement: the mandatory plan mode has the same headless exception', () => {
    const md = read(dir, 'implement.md');
    expect(md).toMatch(/Headless/i);
    expect(md).toContain('claude -p');
    expect(md).toContain('ScheduleWakeup');
  });

  it('plan: --only=prd ends by invoking the PRD gate or states it was not run', () => {
    const md = read(dir, 'plan.md');
    expect(md).toContain('/bear-gate:check prd');
    expect(md).toMatch(NOT_RUN);
  });
});
