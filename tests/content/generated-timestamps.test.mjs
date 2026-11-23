import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

// Dogfooding #272 / #265 : the planning commands wrote T00:00:00Z placeholders and
// `from: null` because the templates did not say what to put there.
const ROOT = path.resolve(import.meta.dirname, '../..');
const LANGS = ['en', 'fr', 'es', 'de', 'pt'];
const read = (...p) => fs.readFileSync(path.join(ROOT, ...p), 'utf8');
const NOW_CMD = 'date -u +%Y-%m-%dT%H:%M:%SZ';

describe('sprint-status schema template (#265, #272)', () => {
  it.each(LANGS)('specifies `from` on creation and a real timestamp (lang=%s)', (lang) => {
    const tpl = read('Project/i18n', lang, 'templates/sprint-status.md');
    expect(tpl).toContain('from: "none"');
    expect(tpl).toContain(NOW_CMD);
    expect(tpl).toContain('T00:00:00Z');
  });

  it('the yaml template has no empty `from` and says how to fill the timestamp', () => {
    const tpl = read('Project/templates/sprint-status.yaml.template');
    expect(tpl).not.toMatch(/from: ""/);
    expect(tpl).toContain(NOW_CMD);
  });
});

describe('user-story template (#265)', () => {
  it.each(LANGS)('asks for the bare epic id (lang=%s)', (lang) => {
    expect(read('Project/i18n', lang, 'templates/user-story.md')).toMatch(
      /\*\*EPIC\*\*: \{EPIC_ID\} <!--[^>]*EPIC-\d{3}/
    );
  });
});

describe('workflow-status.yaml example (#272)', () => {
  const cases = LANGS.flatMap((l) => ['init', 'status'].map((f) => [l, f]));
  it.each(cases)('initialized_at is a real-time instruction (%s/%s)', (lang, f) => {
    expect(read('Dev/i18n', lang, 'Workflow/commands', `${f}.md`)).toContain(NOW_CMD);
  });
});

// #291 / #292 / #293 / #294: implement must take real time, wait for CI and record the validation.
const IMPL_LAYERS = [
  '.claude/commands/bear-workflow',
  ...LANGS.map((l) => `Dev/i18n/${l}/Workflow/commands`),
  ...LANGS.map((l) => `marketplaces/${l}/plugins/bear-workflow/commands`),
];

describe.each(IMPL_LAYERS)('implement.md real-time and validation guidance (%s)', (dir) => {
  const md = () => read(dir, 'implement.md');

  it('#291: step 3.6 never invents the actual time (measured with date -u or left empty)', () => {
    const lines = md().split('\n');
    const i = lines.findIndex((l) => l.startsWith('**3.6'));
    const block = lines.slice(i, i + 8).join('\n');
    expect(block).toContain('--auto');
    expect(block).toContain('claude -p');
    expect(block).toContain(NOW_CMD);
    expect(block).toContain('started_at');
    expect(block).toContain('time_spent');
  });

  it('#292: every history entry written by implement takes the real UTC time', () => {
    const text = md();
    expect(text.split(NOW_CMD).length - 1).toBeGreaterThanOrEqual(2);
    const i = text.indexOf('history');
    expect(text.slice(i)).toContain(NOW_CMD);
  });

  it('#293: story validation waits for the PR checks and documents the done transition after merge', () => {
    const text = md();
    expect(text).toContain('.github/workflows');
    expect(text).toContain('gh pr checks --watch');
    expect(text).toContain('gh pr merge');
  });

  it('#294: story validation writes acceptance_criteria.validated and review', () => {
    const text = md();
    expect(text).toContain('acceptance_criteria.validated');
    expect(text).toContain('review.approved');
  });
});
