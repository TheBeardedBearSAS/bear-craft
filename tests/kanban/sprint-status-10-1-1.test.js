import { describe, it, expect, beforeAll } from 'vitest';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Repository } from '../../cli/kanban/server/services/repository.js';
import { createApp } from '../../cli/kanban/server/app.js';

// Issue #307: a .bmad/sprint-status.yaml written by 10.1.1 (story-shaped cross_cutting_tasks,
// short metadata.sprint_id) must not blank every story status.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../fixtures/sprint-status-10.1.1');

let repo;
let app;

beforeAll(async () => {
  repo = new Repository(path.join(ROOT, 'project-management'));
  await repo.refresh();
  app = createApp({ repository: repo, port: 3737, projectRoot: ROOT });
});

describe('10.1.1 sprint-status (#307)', () => {
  it('keeps the YAML statuses despite the malformed cross_cutting_tasks block', () => {
    const byId = Object.fromEntries(repo.listStories().map((s) => [s.id, s]));
    expect(byId['US-001'].status).toBe('done');
    expect(byId['US-002'].status).toBe('done');
  });

  it('reports the file as usable, with a warning naming the ignored key', async () => {
    const diag = await (await app.request('/api/diagnostics')).json();
    const ss = JSON.stringify(diag);
    expect(ss).not.toMatch(/"state":"invalid"/);
    expect(ss).toMatch(/cross_cutting_tasks/);
  });

  it('exposes no garbage sprint-level task', async () => {
    const body = await (await app.request('/api/sprints/current')).json();
    expect(body.sprint.state).toBe('closed');
    expect(body.cross_cutting_tasks.total).toBe(0);
  });
});
