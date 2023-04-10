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
      expect(() => sample([1, 2, 3], -1)).toThrow();
    });

    it('throws on non-integer sample size', () => {
      expect(() => sample([1, 2, 3], 0.5)).toThrow();
    });
  });
});

const generateRandomArray = (): Array<number> =>
  // We use a set to remove duplicates, as it allows us to simplify our tests
  Array.from(new Set(Array.from({ length: 100 }).map(Math.random)));

const allIndices = (array: Array<unknown>): Array<number> =>
  array.map((_, index) => index);
