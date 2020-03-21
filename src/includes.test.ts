import { pipe } from './pipe';
import { includes } from './includes';

describe('includes', () => {
  describe('data first', () => {
    it('works with number arrays', () => {
      expect(includes([1, 2, 3, 4, 5], 2)).toBe(true);
      expect(includes([1, 2, 3, 4, 5], 6)).toBe(false);
    });

    it('works with string arrays', () => {
      expect(includes(['a', 'b', 'c', 'd', 'e'], 'c')).toBe(true);
      expect(includes(['a', 'b', 'c', 'd', 'e'], 'f')).toBe(false);
    });

    it('works with objects', () => {
      expect(includes({ a: 1, b: 2, c: 3 }, 1)).toBe(true);
      expect(includes({ a: 1, b: 2, c: 3 }, 4)).toBe(false);
    });

    it('works with strings', () => {
      expect(includes('this is a demo-string', 'demo')).toBe(true);
      expect(includes('this is a demo-string', 'not-there')).toBe(false);
    });

    it('works with arrays of objects', () => {
      expect(includes([{ a: 1 }, { b: 1 }, { c: 1 }], { a: 1 })).toBe(true);
      expect(includes([{ a: 1 }, { b: 1 }, { c: 1 }], { a: 2 })).toBe(false);
    });

    it('falls back to false for numbers', () => {
      expect(includes(123456, 12)).toBe(false);
    });
  });

  describe('data last', () => {
    it('works with number arrays', () => {
      expect(
        pipe(
          [1, 2, 3, 4, 5],
          includes(2)
        )
      ).toBe(true);

      expect(
        pipe(
          [1, 2, 3, 4, 5],
          includes(6)
        )
      ).toBe(false);
    });

    it('works with string arrays', () => {
      expect(
        pipe(
          ['a', 'b', 'c', 'd', 'e'],
          includes('c')
        )
      ).toBe(true);

      expect(
        pipe(
          ['a', 'b', 'c', 'd', 'e'],
          includes('f')
        )
      ).toBe(false);
    });

    it('works with objects', () => {
      expect(
        pipe(
          { a: 1, b: 2, c: 3 },
          includes(1)
        )
      ).toBe(true);

      expect(
        pipe(
          { a: 1, b: 2, c: 3 },
          includes(4)
        )
      ).toBe(false);
    });

    it('works with strings', () => {
      expect(
        pipe(
          'this is a demo-string',
          includes('demo')
        )
      ).toBe(true);

      expect(
        pipe(
          'this is a demo-string',
          includes('not-there')
        )
      ).toBe(false);
    });

    it('works with arrays of objects', () => {
      expect(
        pipe(
          [{ a: 1 }, { b: 1 }, { c: 1 }],
          includes({ a: 1 })
        )
      ).toBe(true);

      expect(
        pipe(
          [{ a: 1 }, { b: 1 }, { c: 1 }],
          includes({ a: 2 })
        )
      ).toBe(false);
    });

    it('falls back to false for numbers', () => {
      expect(
        pipe(
          123456,
          includes(12)
        )
      ).toBe(false);
    });
  });
});
