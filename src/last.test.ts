import { last } from './last';
import { pipe } from './pipe';
import { AssertEqual, NonEmptyArray } from './_types';

describe('last', () => {
  describe('data last', () => {
    test('should return last', () => {
      expect(last([1, 2, 3] as const)).toEqual(3);
    });

    test('empty array', () => {
      expect(last([] as const)).toEqual(undefined);
    });

    test('should work in pipe', () => {
      const result = pipe([1, 2, 3] as const, last);
      expect(result).toEqual(3);
    })
  });

  describe('types', () => {
    test('should return T | undefined for Array input', () => {
      const input: Array<number> = [1, 2, 3];
      const actual = last(input);
      const result: AssertEqual<typeof actual, number | undefined> = true;
      expect(result).toEqual(true);
    });

    test('should not return undefined for non empty arrays', () => {
      const input: NonEmptyArray<number> = [1, 2, 3];
      const data = last(input);
      const result: AssertEqual<typeof data, number> = true;
      expect(result).toEqual(true);
    });

    test('should infer type in pipes', () => {
      const data = pipe('this is a text', data => data.split(''), last());
      const result: AssertEqual<typeof data, string | undefined> = true;
      expect(result).toEqual(true);
    });
  });
});
