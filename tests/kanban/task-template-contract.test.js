import { readFileSync } from 'node:fs';
import { describe, it, expect } from 'vitest';
import { deriveTaskData } from '../../cli/kanban/server/services/markdown-metadata.js';
import { TaskFrontmatterSchema } from '../../cli/kanban/shared/schemas.js';

// Contract: a task generated from each Project/i18n/<lang>/templates/task.md (bullets filled in as
// /bear-workflow:start does) must be read by the Kanban without diagnostics (issue #297).
const LANGS = ['en', 'fr', 'es', 'de', 'pt'];

function generate(lang) {
  return readFileSync(`Project/i18n/${lang}/templates/task.md`, 'utf8')
    .replaceAll('{ID}', '001')
    .replaceAll('{DESCRIPTION}', 'Set up CI')
    .replaceAll('{US_ID}', 'US-001')
    .replaceAll('{TYPE}', '[OPS]')
    .replaceAll('{ESTIMATION}', '2.5')
    .replaceAll('{DATE}', '2026-11-23');
}

describe('deriveTaskData (task template contract)', () => {
  for (const lang of LANGS) {
    it(`${lang}: generated task validates against TaskFrontmatterSchema`, () => {
      const res = TaskFrontmatterSchema.safeParse(deriveTaskData(generate(lang)));
      expect(res.error?.issues).toBeUndefined();
      expect(res.data).toMatchObject({
        id: 'TASK-001',
        us_id: 'US-001',
        type: 'OPS',
        estimation_hours: 2.5,
        status: 'to-do',
      });
    });
  }

  it('accepts a bare type and an explicit status', () => {
    const d = deriveTaskData(
      '# TASK-002: x\n\n## Metadata\n- **ID**: TASK-002\n- **US**: US-001\n- **Type**: BE\n- **Status**: In Progress\n'
    );
    expect(TaskFrontmatterSchema.parse(d)).toMatchObject({ type: 'BE', status: 'in-progress' });
  });

  it('accepts a cross-cutting task with no US (issue #306)', () => {
    const d = deriveTaskData(
      '# TASK-051: Update CI\n\n## Metadata\n- **ID**: TASK-051\n- **US**: —\n- **Type**: [OPS]\n- **Estimation**: 1h\n'
    );
    const res = TaskFrontmatterSchema.safeParse(d);
    expect(res.error?.issues).toBeUndefined();
    expect(res.data.us_id).toBeUndefined();
  });

  it('returns {} when nothing is found', () => {
    expect(deriveTaskData('just prose')).toEqual({});
  });
});
