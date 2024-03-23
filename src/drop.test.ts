import { createLazyInvocationCounter } from "../test/lazyInvocationCounter";
import { drop } from "./drop";
import { pipe } from "./pipe";
import { take } from "./take";

const array = [1, 2, 3, 4, 5] as const;
const expected = [3, 4, 5];

describe("data first", () => {
  test("should drop", () => {
    expect(drop(array, 2)).toEqual(expected);
  });

  test("should not drop", () => {
    expect(drop(array, 0)).toEqual(array);
    expect(drop(array, -0)).toEqual(array);
    expect(drop(array, -1)).toEqual(array);
    expect(drop(array, Number.NaN)).toEqual(array);
  });

  test("should return a new array even if there was no drop", () => {
    expect(drop(array, 0)).not.toBe(array);
  });
});

describe("data last", () => {
  test("drop", () => {
    const result = pipe(array, drop(2));
    expect(result).toEqual(expected);
  });
  test("drop with take", () => {
    const counter = createLazyInvocationCounter();
    const result = pipe(array, counter.fn(), drop(2), take(2));
    expect(counter.count).toHaveBeenCalledTimes(4);
    expect(result).toEqual([3, 4]);
  });
});
