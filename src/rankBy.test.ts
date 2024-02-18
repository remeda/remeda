import { identity } from './identity';
import { rankBy } from './rankBy';

describe('runtime (dataFirst)', () => {
  it('works trivially with empty arrays', () => {
    expect(rankBy([], 1, identity)).toBe(0);
  });

  it('maintains the rank for items already in the array', () => {
    const data = [5, 1, 3] as const;
    const sorted = [...data].sort();
    for (let i = 0; i < sorted.length; i += 1) {
      // TODO: Use `Array.prototype.entries` once we bump our TS target so we
      // can get both the index and the item at the same time, and don't need
      // the non-null assertion.
      expect(rankBy(data, sorted[i]!, identity)).toBe(i);
    }
  });

  it('can rank items not in the array', () => {
    const data = [5, 1, 3] as const;
    expect(rankBy(data, 0, identity)).toBe(0);
    expect(rankBy(data, 2, identity)).toBe(1);
    expect(rankBy(data, 4, identity)).toBe(2);
  });

  it('finds items ranked at the end of the array', () => {
    const data = [5, 1, 3] as const;
    expect(rankBy(data, 6, identity)).toBe(3);
  });
});
