import { describe, it, expect } from 'vitest';
import { SprintStatusSchema } from '../../cli/kanban/shared/schemas.js';

// Dogfooding #265: the planning commands wrote `from: null` on the creation entry
// and the whole sprint-status.yaml was rejected (empty board).
describe('SprintStatusSchema : creation history written by the planning commands', () => {
  const doc = (story) => ({
    metadata: { sprint_id: 'sprint-1', name: 'S1', start_date: '', end_date: '' },
    stories: { 'US-001': { title: 'Login', status: 'backlog', ...story } },
  });
  const created = { timestamp: '2026-11-18T09:30:12Z', to: 'backlog', by: 'auto', reason: 'Story created' };

  it('accepts a creation entry whose `from` is null (no previous status)', () => {
    const parsed = SprintStatusSchema.safeParse(doc({ history: [{ ...created, from: null }] }));
    expect(parsed.success).toBe(true);
    expect(parsed.data.stories['US-001'].history[0].from).toBe('none');
  });

  it('normalizes an empty `from` to "none" too', () => {
    const parsed = SprintStatusSchema.safeParse(doc({ history: [{ ...created, from: '' }] }));
    expect(parsed.data.stories['US-001'].history[0].from).toBe('none');
  });

  it('accepts a creation entry whose `from` is the documented "none"', () => {
    expect(SprintStatusSchema.safeParse(doc({ history: [{ ...created, from: 'none' }] })).success).toBe(true);
  });

  it('accepts previous_status: null', () => {
    const parsed = SprintStatusSchema.safeParse(doc({ previous_status: null }));
    expect(parsed.success).toBe(true);
    expect(parsed.data.stories['US-001'].previous_status).toBe('');
  });
});
