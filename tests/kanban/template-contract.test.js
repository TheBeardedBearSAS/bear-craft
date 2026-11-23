import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import * as yaml from 'js-yaml';
import { SprintStatusSchema, StoryFrontmatterSchema } from '../../cli/kanban/shared/schemas.js';
import { deriveStoryData } from '../../cli/kanban/server/services/markdown-metadata.js';

// Contract (#265): what the templates tell the planning commands to write is accepted by the Kanban.
const ROOT = path.resolve(import.meta.dirname, '../..');
const LANGS = ['en', 'fr', 'es', 'de', 'pt'];
const read = (lang, file) => fs.readFileSync(path.join(ROOT, 'Project/i18n', lang, 'templates', file), 'utf8');

describe.each(LANGS)('templates validate against the Kanban schemas (%s)', (lang) => {
  it('sprint-status.md YAML block is accepted and its creation entry has a string `from`', () => {
    const block = read(lang, 'sprint-status.md').match(/```yaml\n(# \.bmad\/sprint-status\.yaml[\s\S]*?)```/);
    const parsed = SprintStatusSchema.safeParse(yaml.load(block[1]));
    expect(parsed.success).toBe(true);
    const creation = Object.values(parsed.data.stories)
      .flatMap((s) => s.history)
      .find((h) => h.to === 'backlog');
    expect(creation.from).toBe('none');
  });

  it('sprint-status.md documents cross_cutting_tasks, accepted by the schema (#296)', () => {
    const tpl = read(lang, 'sprint-status.md');
    const block = tpl.match(/```yaml\n(# \.bmad\/sprint-status\.yaml[\s\S]*?)```/);
    const parsed = SprintStatusSchema.parse(yaml.load(block[1]));
    expect(Object.keys(parsed.cross_cutting_tasks ?? {}).length).toBeGreaterThan(0);
    expect(tpl).toContain('cross_cutting_tasks');
  });

  it('user-story.md, once filled, is accepted by StoryFrontmatterSchema', () => {
    const filled = read(lang, 'user-story.md')
      .replace(/\{ID\}/g, '001')
      .replace('{NOM}', 'Titre')
      .replace('{EPIC_ID}', 'EPIC-001')
      .replace('{POINTS}', '3')
      .replace(/\{[A-Z_]+\}/g, '');
    const data = deriveStoryData(filled);
    expect(data.epic_id).toBe('EPIC-001');
    expect(StoryFrontmatterSchema.safeParse(data).success).toBe(true);
  });
});
