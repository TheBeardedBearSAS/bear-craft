import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

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

  it('plan: --only=prd ends by invoking the PRD gate or states it was not run', () => {
    const md = read(dir, 'plan.md');
    expect(md).toContain('/bear-gate:check prd');
    expect(md).toMatch(/NOT RUN|NON EXÉCUTÉ|NO EJECUTAD|NICHT AUSGEFÜHRT|NÃO EXECUTAD/i);
  });
});
