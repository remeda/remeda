import { NonEmptyArray } from './_types';
import { sample } from './sample';

describe('at runtime', () => {
  describe.each([[generateRandomArray()]])('mathy stuff', array => {
    it.each(allIndices(array))(
      'returns the right number of items',
      sampleSize => {
        const result = sample(array, sampleSize);
        expect(result).toHaveLength(sampleSize);
      }
    );

    it.each(allIndices(array))(
      "doesn't make items up (returns a subset of the input array)",
      sampleSize => {
        const result = sample(array, sampleSize);

        for (const item of result) {
          expect(array).toContain(item);
        }
      }
    );

    it('returns a random result', () => {
      const collector = new Set<number>();
      // We iterate because we might hit randomly on the same item several
      // times. We took a large enough number so that it's unlikely to happen
      // every time.
      for (let iteration = 0; iteration < 100; iteration++) {
        if (collector.size > 1) {
          break;
        }
        const [item] = sample(array, 1);
        collector.add(item);
      }
      expect(collector.size).toBeGreaterThan(1);
    });

    it.each(allIndices(array))("doesn't return repetitions", sampleSize => {
      const result = sample(array, sampleSize);
      expect(result).toHaveLength(new Set(result).size);
    });

    it.each(allIndices(array))("doesn't reorder items", sampleSize => {
      const result = sample(array, sampleSize);

      // Scan the result array and make sure each item is after the previous one
      // in the input array.
      result.reduce((lastInputIndex, item) => {
        const currentInputIndex = array.indexOf(item);
        expect(currentInputIndex).toBeGreaterThan(lastInputIndex);
        return currentInputIndex;
      }, -1 /* outside of the array */);
    });
  });

  describe('identity', () => {
    it('for full (=== n) sample size', () => {
      const array = [1, 2, 3];
      const result = sample(array, 3);
      expect(result).toBe(array);
    });

    it('for large (> n) sample sizes', () => {
      const array = [1, 2, 3];
      const result = sample(array, 10);
      expect(result).toBe(array);
    });

    it('on empty arrays', () => {
      const array: Array<number> = [];
      const result = sample(array, 1);
      expect(result).toBe(array);
    });

    it('on empty arrays and sample size 0', () => {
      const array: Array<number> = [];
      const result = sample(array, 0);
      expect(result).toBe(array);
    });
  });

  describe('edge cases', () => {
    it('works on empty arrays', () => {
      const result = sample([], 1);
      expect(result).toStrictEqual([]);
    });

    it('throws on negative sample size', () => {
      expect(() => sample([1, 2, 3], -1 as number)).toThrow();
    });

    it('throws on non-integer sample size', () => {
      expect(() => sample([1, 2, 3], 0.5)).toThrow();
    });
  });
});

describe('typing', () => {
  describe('sampleSize 0', () => {
    it('on arrays', () => {
      const array: Array<number> = [1, 2, 3, 4, 5];
      const result = sample(array, 0);
      expectTypeOf(result).toEqualTypeOf<[]>();
    });

    it('on readonly arrays', () => {
      const array: ReadonlyArray<number> = [1, 2, 3, 4, 5];
      const result = sample(array, 0);
      expectTypeOf(result).toEqualTypeOf<[]>();
    });

    it('on tuples', () => {
      const array: [number, number, number, number, number] = [1, 2, 3, 4, 5];
      const result = sample(array, 0);
      expectTypeOf(result).toEqualTypeOf<[]>();
    });

    it('on readonly tuples', () => {
      const array = [1, 2, 3, 4, 5] as const;
      const result = sample(array, 0);
      expectTypeOf(result).toEqualTypeOf<[]>();
    });

    it('on tuples with rest tail', () => {
      const array: [number, ...Array<number>] = [1, 2, 3, 4, 5];
      const result = sample(array, 0);
      expectTypeOf(result).toEqualTypeOf<[]>();
    });

    it('on tuples with rest head', () => {
      const array: [...Array<number>, number] = [1, 2, 3, 4, 5];
      const result = sample(array, 0);
      expectTypeOf(result).toEqualTypeOf<[]>();
    });

    it('on readonly tuples with rest tail', () => {
      const array: readonly [number, ...Array<number>] = [1, 2, 3, 4, 5];
      const result = sample(array, 0);
      expectTypeOf(result).toEqualTypeOf<[]>();
    });

    it('on readonly tuples with rest head', () => {
      const array: readonly [...Array<number>, number] = [1, 2, 3, 4, 5];
      const result = sample(array, 0);
      expectTypeOf(result).toEqualTypeOf<[]>();
    });
  });

  describe('sampleSize < n', () => {
    it('on arrays', () => {
      const array: Array<number> = [1, 2, 3, 4, 5];
      const result = sample(array, 4);
      expectTypeOf(result).toEqualTypeOf<
        | []
        | [number]
        | [number, number]
        | [number, number, number]
        | [number, number, number, number]
      >();
    });

    it('on readonly arrays', () => {
      const array: ReadonlyArray<number> = [1, 2, 3, 4, 5];
      const result = sample(array, 4);
      expectTypeOf(result).toEqualTypeOf<
        | []
        | [number]
        | [number, number]
        | [number, number, number]
        | [number, number, number, number]
      >();
    });

    it('on tuples', () => {
      const array: [1, 2, 3, 4, 5] = [1, 2, 3, 4, 5];
      const result = sample(array, 4);
      expectTypeOf(result).toEqualTypeOf<
        [1 | 2 | 3 | 4 | 5, 2 | 3 | 4 | 5, 3 | 4 | 5, 4 | 5]
      >();
    });

    it('on readonly tuples', () => {
      const array = [1, 2, 3, 4, 5] as const;
      const result = sample(array, 4);
      expectTypeOf(result).toEqualTypeOf<
        [1 | 2 | 3 | 4 | 5, 2 | 3 | 4 | 5, 3 | 4 | 5, 4 | 5]
      >();
    });

    it('on tuples with rest tail', () => {
      const array: [number, boolean, ...Array<string>] = [
        1,
        true,
        'hello',
        'world',
        'yey',
      ];
      const result = sample(array, 4);
      expectTypeOf(result).toEqualTypeOf<
        // TODO: This type is OK (it doesn't type things incorrectly) but it's
        // not as narrow as it could be. If the tuple has only 2 elements, the
        // result should be: `[number, boolean]` and similarly for 3 elements.
        // Only when the tuple has 4 elements then the type of the first and
        // second item should be loosened because we don't know how many items
        // are in the input.
        | [string | number | boolean, string | boolean]
        | [string | number | boolean, string | boolean, string]
        | [string | number | boolean, string | boolean, string, string]
      >();
    });

    it('on readonly tuples with rest tail', () => {
      const array: readonly [number, boolean, ...Array<string>] = [
        1,
        true,
        'hello',
        'world',
        'yey',
      ];
      const result = sample(array, 4);
      expectTypeOf(result).toEqualTypeOf<
        // TODO: This type is OK (it doesn't type things incorrectly) but it's
        // not as narrow as it could be. If the tuple has only 2 elements, the
        // result should be: `[number, boolean]` and similarly for 3 elements.
        // Only when the tuple has 4 elements then the type of the first and
        // second item should be loosened because we don't know how many items
        // are in the input.
        | [string | number | boolean, string | boolean]
        | [string | number | boolean, string | boolean, string]
        | [string | number | boolean, string | boolean, string, string]
      >();
    });

    it('on tuples with rest head', () => {
      const array: [...Array<string>, boolean, number] = [
        'yey',
        'hello',
        'world',
        true,
        3,
      ];
      const result = sample(array, 4);
      expectTypeOf(result).toEqualTypeOf<
        | [boolean, number]
        | [string, boolean, number]
        | [string, string, boolean, number]
      >();
    });

    it('on readonly tuples with rest head', () => {
      const array: readonly [...Array<string>, boolean, number] = [
        'yey',
        'hello',
        'world',
        true,
        3,
      ];
      const result = sample(array, 4);
      expectTypeOf(result).toEqualTypeOf<
        | [boolean, number]
        | [string, boolean, number]
        | [string, string, boolean, number]
      >();
    });
  });

  describe('sampleSize === n', () => {
    it('empty array', () => {
      const array: [] = [];
      const result = sample(array, 0);
      expectTypeOf(result).toEqualTypeOf<[]>();
      expect(result).toStrictEqual([]);
    });

    it('empty readonly array', () => {
      const array: readonly [] = [];
      const result = sample(array, 0);
      expectTypeOf(result).toEqualTypeOf<typeof array>();
      expect(result).toStrictEqual([]);
    });

    it('on arrays', () => {
      const array: Array<number> = [1, 2, 3, 4, 5];
      const result = sample(array, 5);
      expectTypeOf(result).toEqualTypeOf<
        | []
        | [number]
        | [number, number]
        | [number, number, number]
        | [number, number, number, number]
        | [number, number, number, number, number]
      >();
    });

    it('on readonly arrays', () => {
      const array: ReadonlyArray<number> = [1, 2, 3, 4, 5];
      const result = sample(array, 5);
      expectTypeOf(result).toEqualTypeOf<
        | []
        | [number]
        | [number, number]
        | [number, number, number]
        | [number, number, number, number]
        | [number, number, number, number, number]
      >();
    });

    it('on tuples', () => {
      const array: [1, 2, 3, 4, 5] = [1, 2, 3, 4, 5];
      const result = sample(array, 5);
      expectTypeOf(result).toEqualTypeOf<typeof array>();
    });

    it('on readonly tuples', () => {
      const array = [1, 2, 3, 4, 5] as const;
      const result = sample(array, 5);
      expectTypeOf(result).toEqualTypeOf<typeof array>();
    });

    it('on tuples with rest tail', () => {
      const array: [number, boolean, ...Array<string>] = [
        1,
        true,
        'hello',
        'world',
        'yey',
      ];
      const result = sample(array, 5);
      expectTypeOf(result).toEqualTypeOf<
        // TODO: This type is OK (it doesn't type things incorrectly) but it's
        // not as narrow as it could be. If the tuple has only 2 elements, the
        // result should be: `[number, boolean]` and similarly for 3 and 4
        // elements. Only when the return tuple has 5 elements then the type of
        // the first and second item should be loosened because we don't know
        // how many items are in the input.
        | [string | number | boolean, string | boolean]
        | [string | number | boolean, string | boolean, string]
        | [string | number | boolean, string | boolean, string, string]
        | [string | number | boolean, string | boolean, string, string, string]
      >();
    });

    it('on readonly tuples with rest tail', () => {
      const array: readonly [number, boolean, ...Array<string>] = [
        1,
        true,
        'hello',
        'world',
        'yey',
      ];
      const result = sample(array, 5);
      expectTypeOf(result).toEqualTypeOf<
        // TODO: This type is OK (it doesn't type things incorrectly) but it's
        // not as narrow as it could be. If the tuple has only 2 elements, the
        // result should be: `[number, boolean]` and similarly for 3 and 4
        // elements. Only when the return tuple has 5 elements then the type of
        // the first and second item should be loosened because we don't know
        // how many items are in the input.
        | [string | number | boolean, string | boolean]
        | [string | number | boolean, string | boolean, string]
        | [string | number | boolean, string | boolean, string, string]
        | [string | number | boolean, string | boolean, string, string, string]
      >();
    });

    it('on tuples with rest head', () => {
      const array: [...Array<string>, boolean, number] = [
        'yey',
        'hello',
        'world',
        true,
        3,
      ];
      const result = sample(array, 5);
      expectTypeOf(result).toEqualTypeOf<
        | [boolean, number]
        | [string, boolean, number]
        | [string, string, boolean, number]
        | [string, string, string, boolean, number]
      >();
    });

    it('on readonly tuples with rest head', () => {
      const array: readonly [...Array<string>, boolean, number] = [
        'yey',
        'hello',
        'world',
        true,
        3,
      ];
      const result = sample(array, 5);
      expectTypeOf(result).toEqualTypeOf<
        | [boolean, number]
        | [string, boolean, number]
        | [string, string, boolean, number]
        | [string, string, string, boolean, number]
      >();
    });
  });

  describe('sampleSize > n', () => {
    it('empty array', () => {
      const array: [] = [];
      const result = sample(array, 10);
      expectTypeOf(result).toEqualTypeOf<[]>();
      expect(result).toStrictEqual([]);
    });

    it('empty readonly array', () => {
      const array: readonly [] = [];
      const result = sample(array, 10);
      expectTypeOf(result).toEqualTypeOf<typeof array>();
      expect(result).toStrictEqual([]);
    });

    it('on arrays', () => {
      const array: Array<number> = [1, 2, 3, 4, 5];
      const result = sample(array, 10);
      expectTypeOf(result).toEqualTypeOf<
        | []
        | [number]
        | [number, number]
        | [number, number, number]
        | [number, number, number, number]
        | [number, number, number, number, number]
        | [number, number, number, number, number, number]
        | [number, number, number, number, number, number, number]
        | [number, number, number, number, number, number, number, number]
        | [
            number,
            number,
            number,
            number,
            number,
            number,
            number,
            number,
            number,
          ]
        | [
            number,
            number,
            number,
            number,
            number,
            number,
            number,
            number,
            number,
            number,
          ]
      >();
    });

    it('on readonly arrays', () => {
      const array: ReadonlyArray<number> = [1, 2, 3, 4, 5];
      const result = sample(array, 10);
      expectTypeOf(result).toEqualTypeOf<
        | []
        | [number]
        | [number, number]
        | [number, number, number]
        | [number, number, number, number]
        | [number, number, number, number, number]
        | [number, number, number, number, number, number]
        | [number, number, number, number, number, number, number]
        | [number, number, number, number, number, number, number, number]
        | [
            number,
            number,
            number,
            number,
            number,
            number,
            number,
            number,
            number,
          ]
        | [
            number,
            number,
            number,
            number,
            number,
            number,
            number,
            number,
            number,
            number,
          ]
      >();
    });

    it('on tuples', () => {
      const array: [1, 2, 3, 4, 5] = [1, 2, 3, 4, 5];
      const result = sample(array, 10);
      expectTypeOf(result).toEqualTypeOf<typeof array>();
    });

    it('on readonly tuples', () => {
      const array = [1, 2, 3, 4, 5] as const;
      const result = sample(array, 10);
      expectTypeOf(result).toEqualTypeOf<typeof array>();
    });

    it('on tuples with rest tail', () => {
      const array: [number, boolean, ...Array<string>] = [
        1,
        true,
        'hello',
        'world',
        'yey',
      ];
      const result = sample(array, 10);
      expectTypeOf(result).toEqualTypeOf<
        // TODO: This type is OK (it doesn't type things incorrectly) but it's
        // not as narrow as it could be. If the tuple has only 2 elements, the
        // result should be: `[number, boolean]` and similarly for 3-9 elements.
        // Only when the return tuple has 10 elements then the type of the first
        // and second item should be loosened because we don't know how many
        // items are in the input.
        | [string | number | boolean, string | boolean]
        | [string | number | boolean, string | boolean, string]
        | [string | number | boolean, string | boolean, string, string]
        | [string | number | boolean, string | boolean, string, string, string]
        | [
            string | number | boolean,
            string | boolean,
            string,
            string,
            string,
            string,
          ]
        | [
            string | number | boolean,
            string | boolean,
            string,
            string,
            string,
            string,
            string,
          ]
        | [
            string | number | boolean,
            string | boolean,
            string,
            string,
            string,
            string,
            string,
            string,
          ]
        | [
            string | number | boolean,
            string | boolean,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
          ]
        | [
            string | number | boolean,
            string | boolean,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
          ]
      >();
    });

    it('on readonly tuples with rest tail', () => {
      const array: readonly [number, boolean, ...Array<string>] = [
        1,
        true,
        'hello',
        'world',
        'yey',
      ];
      const result = sample(array, 10);
      expectTypeOf(result).toEqualTypeOf<
        // TODO: This type is OK (it doesn't type things incorrectly) but it's
        // not as narrow as it could be. If the tuple has only 2 elements, the
        // result should be: `[number, boolean]` and similarly for 3-9 elements.
        // Only when the return tuple has 10 elements then the type of the first
        // and second item should be loosened because we don't know how many
        // items are in the input.
        | [string | number | boolean, string | boolean]
        | [string | number | boolean, string | boolean, string]
        | [string | number | boolean, string | boolean, string, string]
        | [string | number | boolean, string | boolean, string, string, string]
        | [
            string | number | boolean,
            string | boolean,
            string,
            string,
            string,
            string,
          ]
        | [
            string | number | boolean,
            string | boolean,
            string,
            string,
            string,
            string,
            string,
          ]
        | [
            string | number | boolean,
            string | boolean,
            string,
            string,
            string,
            string,
            string,
            string,
          ]
        | [
            string | number | boolean,
            string | boolean,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
          ]
        | [
            string | number | boolean,
            string | boolean,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
          ]
      >();
    });

    it('on tuples with rest head', () => {
      const array: [...Array<string>, boolean, number] = [
        'yey',
        'hello',
        'world',
        true,
        3,
      ];
      const result = sample(array, 10);
      expectTypeOf(result).toEqualTypeOf<
        | [boolean, number]
        | [string, boolean, number]
        | [string, string, boolean, number]
        | [string, string, string, boolean, number]
        | [string, string, string, string, boolean, number]
        | [string, string, string, string, string, boolean, number]
        | [string, string, string, string, string, string, boolean, number]
        | [
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            boolean,
            number,
          ]
        | [
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            boolean,
            number,
          ]
      >();
    });

    it('on readonly tuples with rest head', () => {
      const array: readonly [...Array<string>, boolean, number] = [
        'yey',
        'hello',
        'world',
        true,
        3,
      ];
      const result = sample(array, 10);
      expectTypeOf(result).toEqualTypeOf<
        | [boolean, number]
        | [string, boolean, number]
        | [string, string, boolean, number]
        | [string, string, string, boolean, number]
        | [string, string, string, string, boolean, number]
        | [string, string, string, string, string, boolean, number]
        | [string, string, string, string, string, string, boolean, number]
        | [
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            boolean,
            number,
          ]
        | [
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            boolean,
            number,
          ]
      >();
    });
  });

  describe('non-const sampleSize', () => {
    it('empty array', () => {
      const array: [] = [];
      const result = sample(array, 5 as number);
      expectTypeOf(result).toEqualTypeOf<[]>();
      expect(result).toStrictEqual([]);
    });

    it('empty readonly array', () => {
      const array: readonly [] = [];
      const result = sample(array, 5 as number);
      expectTypeOf(result).toEqualTypeOf<typeof array>();
      expect(result).toStrictEqual([]);
    });

    it('on arrays', () => {
      const array: Array<number> = [1, 2, 3, 4, 5];
      const result = sample(array, 5 as number);
      expectTypeOf(result).toEqualTypeOf<Array<number>>();
    });

    it('on readonly arrays', () => {
      const array: ReadonlyArray<number> = [1, 2, 3, 4, 5];
      const result = sample(array, 5 as number);
      expectTypeOf(result).toEqualTypeOf<Array<number>>();
    });

    it('on tuples', () => {
      const array: [1, 2, 3, 4, 5] = [1, 2, 3, 4, 5];
      const result = sample(array, 5 as number);
      expectTypeOf(result).toEqualTypeOf<
        | []
        | [1]
        | [2]
        | [3]
        | [4]
        | [5]
        | [1, 2]
        | [1, 3]
        | [1, 4]
        | [1, 5]
        | [2, 3]
        | [2, 4]
        | [2, 5]
        | [3, 4]
        | [3, 5]
        | [4, 5]
        | [1, 2, 3]
        | [1, 2, 4]
        | [1, 2, 5]
        | [1, 3, 4]
        | [1, 3, 5]
        | [1, 4, 5]
        | [2, 3, 4]
        | [2, 3, 5]
        | [2, 4, 5]
        | [3, 4, 5]
        | [1, 2, 3, 4]
        | [1, 2, 3, 5]
        | [1, 2, 4, 5]
        | [1, 3, 4, 5]
        | [2, 3, 4, 5]
        | [1, 2, 3, 4, 5]
      >();
    });

    it('on readonly tuples', () => {
      const array = [1, 2, 3, 4, 5] as const;
      const result = sample(array, 5 as number);
      expectTypeOf(result).toEqualTypeOf<
        | []
        | [1]
        | [2]
        | [3]
        | [4]
        | [5]
        | [1, 2]
        | [1, 3]
        | [1, 4]
        | [1, 5]
        | [2, 3]
        | [2, 4]
        | [2, 5]
        | [3, 4]
        | [3, 5]
        | [4, 5]
        | [1, 2, 3]
        | [1, 2, 4]
        | [1, 2, 5]
        | [1, 3, 4]
        | [1, 3, 5]
        | [1, 4, 5]
        | [2, 3, 4]
        | [2, 3, 5]
        | [2, 4, 5]
        | [3, 4, 5]
        | [1, 2, 3, 4]
        | [1, 2, 3, 5]
        | [1, 2, 4, 5]
        | [1, 3, 4, 5]
        | [2, 3, 4, 5]
        | [1, 2, 3, 4, 5]
      >();
    });

    it('on tuples with rest tail', () => {
      const array: [number, boolean, ...Array<string>] = [
        1,
        true,
        'hello',
        'world',
        'yey',
      ];
      const result = sample(array, 5 as number);
      expectTypeOf(result).toEqualTypeOf<
        | Array<string>
        | [boolean, ...Array<string>]
        | [number, boolean, ...Array<string>]
        | [number, ...Array<string>]
      >();
    });

    it('on readonly tuples with rest tail', () => {
      const array: readonly [number, boolean, ...Array<string>] = [
        1,
        true,
        'hello',
        'world',
        'yey',
      ];
      const result = sample(array, 5 as number);
      expectTypeOf(result).toEqualTypeOf<
        | Array<string>
        | [number, boolean, ...Array<string>]
        | [boolean, ...Array<string>]
        | [number, ...Array<string>]
      >();
    });

    it('on tuples with rest head', () => {
      const array: [...Array<string>, boolean, number] = [
        'yey',
        'hello',
        'world',
        true,
        3,
      ];
      const result = sample(array, 5 as number);
      expectTypeOf(result).toEqualTypeOf<
        // TODO: the typing isn't ideal here. I'm not even sure what the type
        // here should be...
        Array<number | boolean | string>
      >();
    });

    it('on readonly tuples with rest head', () => {
      const array: readonly [...Array<string>, boolean, number] = [
        'yey',
        'hello',
        'world',
        true,
        3,
      ];
      const result = sample(array, 5 as number);
      expectTypeOf(result).toEqualTypeOf<
        // TODO: the typing isn't ideal here. I'm not even sure what the type
        // here should be...
        Array<string | number | boolean>
      >();
    });
  });
});

const generateRandomArray = (): NonEmptyArray<number> =>
  // We use a set to remove duplicates, as it allows us to simplify our tests
  // @ts-expect-error [ts2322]: we know this array isn't empty!
  Array.from(new Set(Array.from({ length: 100 }).map(Math.random)));

const allIndices = (array: Array<unknown>): Array<number> =>
  array.map((_, index) => index);
