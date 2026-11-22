import { describe, it, expect } from 'vitest';
import { isPlaceholderTimestamp, countPlaceholderTimestamps } from '../../cli/kanban/shared/timestamps.js';

describe('isPlaceholderTimestamp', () => {
  it.each(['2026-11-22T00:00:00Z', '2026-11-22T00:00:00.000Z', '2026-11-22T00:00:00.0Z'])('flags %s', (ts) => {
    expect(isPlaceholderTimestamp(ts)).toBe(true);
  });
  it.each(['2026-11-22T10:15:00Z', '2026-11-22T00:00:01Z', '2026-11-22T00:00:00+01:00', '2026-11-22', '', null, 42])(
    'ignores %s',
    (ts) => {
      expect(isPlaceholderTimestamp(ts)).toBe(false);
    }
  );
});

describe('countPlaceholderTimestamps', () => {
  it('counts nested timestamp keys, including unquoted YAML dates', () => {
    const data = {
      stories: {
        a: { history: [{ timestamp: '2026-11-22T00:00:00Z' }, { timestamp: '2026-11-22T09:00:00Z' }] },
        b: { history: [{ timestamp: new Date('2026-11-23T00:00:00Z') }] },
      },
    };
    expect(countPlaceholderTimestamps(data)).toBe(2);
  });
  it('returns 0 for non-objects', () => {
    expect(countPlaceholderTimestamps(null)).toBe(0);
    expect(countPlaceholderTimestamps('x')).toBe(0);
  });
});
