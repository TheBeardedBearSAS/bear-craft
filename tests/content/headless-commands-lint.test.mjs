import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import {
  extractHeadlessBlocks,
  positiveToolMentions,
  lintHeadlessCommand,
  lintGateParagraph,
  headlessTokens,
  gateTokens,
} from './headless-lint.mjs';

// Static guarantee for `claude -p` behaviour: a fake `claude` cannot run a command's logic, so the
// headless guidance is linted by block/sentence. See docs/HEADLESS-COMMANDS.md.
const ROOT = path.resolve(import.meta.dirname, '../..');
const LANGS = ['en', 'fr', 'es', 'de', 'pt'];
const layers = [
  { name: '.claude', dir: '.claude/commands/bear-workflow' },
  ...LANGS.map((l) => ({ name: `Dev/i18n/${l}`, dir: `Dev/i18n/${l}/Workflow/commands` })),
  ...LANGS.map((l) => ({ name: `marketplaces/${l}`, dir: `marketplaces/${l}/plugins/bear-workflow/commands` })),
];
const read = (dir, cmd) => fs.readFileSync(path.join(ROOT, dir, `${cmd}.md`), 'utf8');
const REF = 'Dev/i18n/en/Workflow/commands';

describe.each(layers)('headless lint ($name)', ({ dir }) => {
  it.each(['design', 'implement'])('%s: headless block is sound', (cmd) => {
    expect(lintHeadlessCommand(read(dir, cmd), { name: cmd })).toEqual([]);
  });
  it('design: spec gate paragraph invokes /bear-gate:check spec with a NOT RUN fallback', () => {
    expect(lintGateParagraph(read(dir, 'design'), '/bear-gate:check spec', { name: 'design' })).toEqual([]);
  });
  it('plan: PRD gate paragraph invokes /bear-gate:check prd with a NOT RUN fallback', () => {
    expect(lintGateParagraph(read(dir, 'plan'), '/bear-gate:check prd', { name: 'plan' })).toEqual([]);
  });
  it.each(['design', 'implement'])('%s: literals match the English reference', (cmd) => {
    expect(headlessTokens(read(dir, cmd))).toEqual(headlessTokens(read(REF, cmd)));
  });
  it.each([
    ['design', '/bear-gate:check spec'],
    ['plan', '/bear-gate:check prd'],
  ])('%s: gate literals match the English reference', (cmd, gate) => {
    expect(gateTokens(read(dir, cmd), gate)).toEqual(gateTokens(read(REF, cmd), gate));
  });
});

describe('linter self-test (positive/negative fixtures)', () => {
  const good =
    '# Cmd\n\n> **Headless mode (`claude -p`, no TTY).** Plan mode is suspended: do not call `ScheduleWakeup`, `AskUserQuestion` or any tool that waits. Write the plan to `project-management/design-plan.md`.\n\nNext.\n';

  it('accepts a sound block', () => {
    expect(lintHeadlessCommand(good, { name: 'design' })).toEqual([]);
  });
  it('rejects a positive instruction to call ScheduleWakeup', () => {
    const bad = good.replace(
      'do not call `ScheduleWakeup`, `AskUserQuestion`',
      'call `ScheduleWakeup` to wait. Do not call `AskUserQuestion`'
    );
    expect(lintHeadlessCommand(bad, { name: 'design' }).join()).toContain(
      'ScheduleWakeup mentioned outside a prohibition'
    );
  });
  it('rejects a positive AskUserQuestion in a separate sentence', () => {
    const bad = good.replace('or any tool', 'or any tool. Then use `AskUserQuestion` to confirm. Or any tool');
    expect(lintHeadlessCommand(bad, { name: 'design' }).join()).toContain(
      'AskUserQuestion mentioned outside a prohibition'
    );
  });
  it('rejects a missing headless block, a missing claude -p, and a missing design-plan path', () => {
    expect(lintHeadlessCommand('# Cmd\n', { name: 'design' })[0]).toContain('exactly 1 headless block');
    expect(lintHeadlessCommand(good.replace('`claude -p`', 'x'), { name: 'design' }).join()).toContain('claude -p');
    expect(lintHeadlessCommand(good.replace('design-plan.md', 'plan.md'), { name: 'design' }).join()).toContain(
      'design-plan.md'
    );
  });
  it('rejects ScheduleWakeup mentioned outside the block', () => {
    expect(lintHeadlessCommand(`${good}\nUse ScheduleWakeup here.\n`, { name: 'design' }).join()).toContain(
      'outside the headless block'
    );
  });
  it('rejects a block that no longer forbids a tool', () => {
    expect(lintHeadlessCommand(good.replace('`AskUserQuestion` ', ''), { name: 'design' }).join()).toContain(
      'does not forbid AskUserQuestion'
    );
  });
  it('accepts localized prohibitions and rejects their positive form', () => {
    expect(
      positiveToolMentions('ne pas y entrer et ne pas appeler `ScheduleWakeup`, `AskUserQuestion` ni autre.')
    ).toEqual([]);
    expect(positiveToolMentions('weder `ScheduleWakeup` noch `AskUserQuestion` aufrufen.')).toEqual([]);
    expect(positiveToolMentions('Appeler `ScheduleWakeup` pour attendre.')).toHaveLength(1);
  });
  it('a prohibition does not cover a later positive clause of the same sentence', () => {
    expect(positiveToolMentions('ne pas y entrer et appeler `ScheduleWakeup` pour attendre.')).toHaveLength(1);
    expect(positiveToolMentions('do not enter it and do not call `ScheduleWakeup`.')).toEqual([]);
  });
  it.each([
    'Registrar no log, chamar `AskUserQuestion` para confirmar.',
    'Wenn nicht anders angegeben, `ScheduleWakeup` aufrufen.',
    'Si no hay respuesta, llamar a `ScheduleWakeup`.',
    'Si no hay respuesta llamar a `ScheduleWakeup`.',
    'If no reply, call `ScheduleWakeup`.',
    'Do not enter plan mode, call `ScheduleWakeup`.',
    'Do not skip. Call `AskUserQuestion` to confirm.',
    '`ScheduleWakeup` aufrufen.',
  ])('false-negative regression: rejects %s', (text) => {
    expect(positiveToolMentions(text)).toHaveLength(1);
  });
  it.each([
    'do not call `ScheduleWakeup` and `AskUserQuestion`.',
    'do not call `ScheduleWakeup`, `AskUserQuestion` or any tool.',
    'Do not call `ScheduleWakeup` or `AskUserQuestion`.',
    'ne pas appeler `ScheduleWakeup` et `AskUserQuestion`.',
    "N'appelez pas `ScheduleWakeup` ni `AskUserQuestion`.",
    'ne jamais appeler `AskUserQuestion`.',
    'No llamar a `ScheduleWakeup` y `AskUserQuestion`.',
    'no entrar en él ni llamar a `ScheduleWakeup` ni a `AskUserQuestion`.',
    'Seguir sin llamar a `AskUserQuestion`.',
    'Nunca llamar a `ScheduleWakeup`.',
    'não entrar nele nem chamar `ScheduleWakeup` e `AskUserQuestion`.',
    'Não chamar `AskUserQuestion` e `ScheduleWakeup`.',
    '`ScheduleWakeup` und `AskUserQuestion` nicht aufrufen.',
    'nicht in den Plan Mode wechseln und weder `ScheduleWakeup` noch `AskUserQuestion` aufrufen.',
    'Niemals `ScheduleWakeup` aufrufen.',
    '`ScheduleWakeup` must never be called.',
    '`AskUserQuestion` and `ScheduleWakeup` must not be called.',
  ])('legitimate prohibition accepted: %s', (text) => {
    expect(positiveToolMentions(text)).toEqual([]);
  });
  it('rejects a positive AskUserQuestion outside the headless block, accepts a prohibited one', () => {
    const md = `${good}\nUse \`AskUserQuestion\` to ask the stack.\n`;
    expect(lintHeadlessCommand(md, { name: 'design' }).join()).toContain(
      'AskUserQuestion mentioned outside a prohibition'
    );
    expect(lintHeadlessCommand(`${good}\nNever call \`AskUserQuestion\` here.\n`, { name: 'design' })).toEqual([]);
  });
  it('a non-headless blockquote mentioning ScheduleWakeup is not tolerated', () => {
    expect(lintHeadlessCommand(`${good}\n> **Note** do not use ScheduleWakeup\n`, { name: 'design' }).join()).toContain(
      'outside the headless block'
    );
  });
  it('extracts only headless blockquotes', () => {
    expect(extractHeadlessBlocks('> **Plan mode** x\n\n> **Modo headless (`claude -p`).** a\n> b\n')).toHaveLength(1);
  });
  it('gate paragraph needs both the gate and NOT RUN', () => {
    expect(
      lintGateParagraph('Run `/bear-gate:check prd` then done.', '/bear-gate:check prd', { name: 'plan' })
    ).toHaveLength(1);
    expect(
      lintGateParagraph('Run `/bear-gate:check prd`; else NOT RUN.', '/bear-gate:check prd', { name: 'plan' })
    ).toEqual([]);
  });
  it('cross-language tokens differ when a literal path drifts', () => {
    expect(headlessTokens(good)).not.toEqual(headlessTokens(good.replace('design-plan.md', 'plan.md')));
  });
});
