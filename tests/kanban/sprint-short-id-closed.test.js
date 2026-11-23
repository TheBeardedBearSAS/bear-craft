import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { Repository } from '../../cli/kanban/server/services/repository.js';
import { createApp } from '../../cli/kanban/server/app.js';

// Issue #298: sprint written by /bear-workflow:start (short metadata.sprint_id, "Dates" row) then closed.
const FOLDER = 'sprint-1-walking_skeleton';
const YAML = `version: "1.0"
metadata:
  sprint_id: "sprint-1"
  name: "Walking skeleton"
  start_date: "2026-11-23"
  end_date: "2026-12-04"
  closed_date: "2026-12-04"
stories:
  US-001: { title: "A", status: "done", story_points: 5, sprint_id: "${FOLDER}" }
  US-002: { title: "B", status: "done", story_points: 3, sprint_id: "${FOLDER}" }
`;
const GOAL = `# Sprint 1 : Walking skeleton

## Informations

| Attribut | Valeur |
|----------|--------|
| Numéro | 1 |
| Dates | 2026-11-23 → 2026-12-04 (10 jours) |
`;

let dir;
let app;

beforeAll(async () => {
  dir = await mkdtemp(path.join(tmpdir(), 'kanban-short-id-'));
  await mkdir(path.join(dir, '.bmad'), { recursive: true });
  await writeFile(path.join(dir, '.bmad', 'sprint-status.yaml'), YAML);
  const pm = path.join(dir, 'project-management');
  await mkdir(path.join(pm, 'sprints', FOLDER), { recursive: true });
  await writeFile(path.join(pm, 'sprints', FOLDER, 'sprint-goal.md'), GOAL);
  const repo = new Repository(pm);
  await repo.refresh();
  app = createApp({ repository: repo, port: 3737 });
});

afterAll(() => rm(dir, { recursive: true, force: true }));

describe('closed sprint with a short metadata.sprint_id', () => {
  it('is closed under the folder id, with its stories', async () => {
    const body = await (await app.request(`/api/sprints/${FOLDER}`)).json();
    expect(body.sprint.state).toBe('closed');
    expect(body.stories.map((s) => s.id).sort()).toEqual(['US-001', 'US-002']);
  });

  it('has one velocity entry', async () => {
    const v = await (await app.request('/api/velocity')).json();
    expect(v.sprints).toHaveLength(1);
    expect(v.average).toBe(8);
  });
});
