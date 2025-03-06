/* eslint-disable vitest/prefer-strict-equal */
import { isObjectWithProps } from "./isObjectWithProps";
import { memoizeIterator } from "./memoizeIterator";
import { describe, test, expect } from "vitest";

function areIteratorResultsEqual(
  a: Readonly<IteratorResult<unknown>>,
  b: Readonly<IteratorResult<unknown>>,
): boolean | undefined {
  if (isObjectWithProps(a, "value") && isObjectWithProps(b, "value")) {
    if ((a.done === true) === (b.done === true)) {
      if (a.done === true) {
        return true;
      }
      return a.value === b.value;
    }
    return false;
  }
  return undefined;
}

expect.addEqualityTesters([areIteratorResultsEqual]);

describe("memoizeIterator", () => {
  test("should iterate over the values correctly", () => {
    const array = [1, 2, 3, 4, 5];
    const iterator = array[Symbol.iterator]();
    const memoized = memoizeIterator(iterator);

    const result = [...memoized];

    expect(result).toStrictEqual(array);
  });

  test("should cache the values", () => {
    const array = [1, 2, 3, 4, 5];
    const iterator = array[Symbol.iterator]();
    const memoized = memoizeIterator(iterator);

    const iter1 = memoized[Symbol.iterator]();
    const iter2 = memoized[Symbol.iterator]();

    expect(iter1.next()).toEqual({ value: 1, done: false });
    expect(iter1.next()).toEqual({ value: 2, done: false });

    expect(iter2.next()).toEqual({ value: 1, done: false });
    expect(iter2.next()).toEqual({ value: 2, done: false });

    expect(iter1.next()).toEqual({ value: 3, done: false });
    expect(iter2.next()).toEqual({ value: 3, done: false });
  });

  test("should handle empty iterator", () => {
    const array: Array<number> = [];
    const iterator = array[Symbol.iterator]();
    const memoized = memoizeIterator(iterator);

    const result = [...memoized];

    expect(result).toStrictEqual([]);
  });

  test("should handle single value iterator", () => {
    const array = [42];
    const iterator = array[Symbol.iterator]();
    const memoized = memoizeIterator(iterator);

    const result = [...memoized];

    expect(result).toStrictEqual(array);
  });

  test("should handle iterator with different types", () => {
    const array = [1, "two", 3, "four"];
    const iterator = array[Symbol.iterator]();
    const memoized = memoizeIterator(iterator);

    const result = [...memoized];

    expect(result).toStrictEqual(array);
  });
});
