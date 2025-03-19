import { describe, it, expect } from "vitest";
import { toBasicIterable } from "./toBasicIterable";

describe("toBasicIterable", () => {
  it("should iterate over all elements", () => {
    const array = [1, 2, 3];
    const iterable = toBasicIterable(array);
    const result = [...iterable];

    expect(result).toStrictEqual(array);
  });

  it("should throw error if item limit is exceeded", () => {
    const array = [1, 2, 3];
    const iterable = toBasicIterable(array, 2);
    const iterator = iterable[Symbol.iterator]();

    expect(iterator.next().value).toBe(1);
    expect(iterator.next().value).toBe(2);
    expect(() => iterator.next()).toThrow("Item limit exceeded");
  });

  it("should throw error on multiple traversal if not allowed", () => {
    const array = [1, 2, 3];
    const iterable = toBasicIterable(array);
    const iterator = iterable[Symbol.iterator]();
    iterator.next();

    expect(() => iterable[Symbol.iterator]()).toThrow(
      "Multiple traversal not allowed",
    );
  });

  it("should allow multiple traversal if enabled", () => {
    const array = [1, 2, 3];
    const iterable = toBasicIterable(array, undefined, true);
    const result1 = [...iterable];
    const result2 = [...iterable];

    expect(result1).toStrictEqual(array);
    expect(result2).toStrictEqual(array);
  });

  it("should memoize iterable if multiple traversal is enabled", () => {
    const array = [1, 2, 3];
    const iterable = toBasicIterable(array, undefined, true);
    const iterator1 = iterable[Symbol.iterator]();
    const iterator2 = iterable[Symbol.iterator]();

    expect(iterator1.next().value).toBe(1);
    expect(iterator2.next().value).toBe(1);
  });
});
