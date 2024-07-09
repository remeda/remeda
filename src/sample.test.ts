import type { NonEmptyArray } from "./internal/types";
import { sample } from "./sample";
import { times } from "./times";
import { unique } from "./unique";

describe.each([[generateRandomArray()]])("mathy stuff", (array) => {
  it.each(allIndices(array))(
    "returns the right number of items",
    (sampleSize) => {
      const result = sample(array, sampleSize);
      expect(result).toHaveLength(sampleSize);
    },
  );

  it.each(allIndices(array))(
    "doesn't make items up (returns a subset of the input array)",
    (sampleSize) => {
      const result = sample(array, sampleSize);

      for (const item of result) {
        expect(array).toContain(item);
      }
    },
  );

  it("returns a random result", () => {
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

  it.each(allIndices(array))("doesn't return repetitions", (sampleSize) => {
    const result = sample(array, sampleSize);
    expect(result).toHaveLength(new Set(result).size);
  });

  it.each(allIndices(array))("doesn't reorder items", (sampleSize) => {
    const result = sample(array, sampleSize);

    let lastInputIndex = -1; // outside of the array
    for (const item of result) {
      // Scan the result array and make sure each item is after the previous one
      // in the input array.

      const currentInputIndex = array.indexOf(item);
      expect(currentInputIndex).toBeGreaterThan(lastInputIndex);
      lastInputIndex = currentInputIndex;
    }
  });
});

describe("identity", () => {
  it("for full (=== n) sample size", () => {
    const array = [1, 2, 3];
    const result = sample(array, 3);
    expect(result).toStrictEqual(array);
    expect(result).not.toBe(array);
  });

  it("for large (> n) sample sizes", () => {
    const array = [1, 2, 3];
    const result = sample(array, 10);
    expect(result).toStrictEqual(array);
    expect(result).not.toBe(array);
  });

  it("on empty arrays", () => {
    const array: Array<number> = [];
    const result = sample(array, 1);
    expect(result).toStrictEqual(array);
    expect(result).not.toBe(array);
  });

  it("on empty arrays and sample size 0", () => {
    const array: Array<number> = [];
    const result = sample(array, 0);
    expect(result).toStrictEqual(array);
    expect(result).not.toBe(array);
  });
});

describe("edge cases", () => {
  it("works on empty arrays", () => {
    const result = sample([], 1);
    expect(result).toStrictEqual([]);
  });

  it("Treats negative sample sizes as 0", () => {
    expect(sample([1, 2, 3], -1 as number)).toStrictEqual([]);
  });

  it("rounds non-integer sample sizes", () => {
    expect(sample([1, 2, 3], 0.5)).toHaveLength(1);
  });
});

describe("sampleSize === n", () => {
  it("empty array", () => {
    const array: [] = [];
    const result = sample(array, 0);
    expect(result).toStrictEqual([]);
  });

  it("empty readonly array", () => {
    const array: readonly [] = [];
    const result = sample(array, 0);
    expect(result).toStrictEqual([]);
  });
});

describe("sampleSize > n", () => {
  it("empty array", () => {
    const array: [] = [];
    const result = sample(array, 10);
    expect(result).toStrictEqual([]);
  });

  it("empty readonly array", () => {
    const array: readonly [] = [];
    const result = sample(array, 10);
    expect(result).toStrictEqual([]);
  });
});

describe("non-const sampleSize", () => {
  it("empty array", () => {
    const array: [] = [];
    const result = sample(array, 5 as number);
    expect(result).toStrictEqual([]);
  });

  it("empty readonly array", () => {
    const array: readonly [] = [];
    const result = sample(array, 5 as number);
    expect(result).toStrictEqual([]);
  });
});

function generateRandomArray(): NonEmptyArray<number> {
  // @ts-expect-error [ts2322]: we know this array isn't empty!
  return unique(times(100, Math.random));
}

const allIndices = (array: ReadonlyArray<unknown>): Array<number> =>
  array.map((_, index) => index);
