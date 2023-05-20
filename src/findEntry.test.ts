import { findEntry } from './findEntry';
import { describe, expect } from 'vitest';
import { pipe } from './pipe';

const testObject = {
  1: { a: 'a', b: 'b', d: 'd' },
  '2': { f: true, z: false, d: 'd' },
  abc: { g: 'g', f: true, 123: [1, 2], d: 'd' },
} as const;
const expected1 = ['1', { a: 'a', b: 'b', d: 'd' }];
const expected2 = ['2', { f: true, z: false, d: 'd' }];
const expectedAbc = ['abc', { g: 'g', f: true, 123: [1, 2], d: 'd' }];

describe('findEntries', () => {
  describe('data first', () => {
    it('returns first of multiple matches', () => {
      expect(
        findEntry(testObject, (_, value) => {
          return value.d == 'd';
        })
      ).toEqual(expected1);
      expect(
        findEntry(testObject, (_, value) => {
          return 'f' in value && value.f;
        })
      ).toEqual(expected2);
    });

    it('allows to find by both key and value', () => {
      expect(
        findEntry(testObject, (key, value) => {
          return typeof key === 'string' && key.includes('b') && value.d == 'd';
        })
      ).toEqual(expectedAbc);
    });

    it('returns undefined if no match', () => {
      expect(findEntry(testObject, (_, value) => !value.d)).toEqual(undefined);
    });

    expect(
      pipe(
        testObject,
        findEntry((_, value) => value.d == 'd')
      )
    ).toEqual(expected1);
  });

  describe('data last', () => {
    it('returns first of multiple matches', () => {
      expect(
        pipe(
          testObject,
          findEntry((_, value) => {
            return value.d == 'd';
          })
        )
      ).toEqual(expected1);
      expect(
        pipe(
          testObject,
          findEntry((_, value) => {
            return 'f' in value && value.f;
          })
        )
      ).toEqual(expected2);
    });

    it('allows to find by both key and value', () => {
      expect(
        pipe(
          testObject,
          findEntry((key, value) => {
            return (
              typeof key === 'string' && key.includes('b') && value.d == 'd'
            );
          })
        )
      ).toEqual(expectedAbc);
    });

    it('returns undefined if no match', () => {
      expect(
        pipe(
          testObject,
          findEntry((_, value) => !value.d)
        )
      ).toEqual(undefined);
    });
  });
});
