import { createLazyInvocationCounter } from "../test/lazyInvocationCounter";
import { filter } from "./filter";
import { first } from "./first";
import { pipe } from "./pipe";

function defaultTo<T>(d: T) {
  return (v: T | null | undefined) => v ?? d;
}

test("should return first", () => {
  expect(first([1, 2, 3] as const)).toEqual(1);
});

test("empty array", () => {
  expect(first([])).toEqual(undefined);
});

describe("pipe", () => {
  test("as fn", () => {
    const counter = createLazyInvocationCounter();
    const result = pipe([1, 2, 3, 4, 5, 6] as const, counter.fn(), first());
    expect(counter.count).toHaveBeenCalledTimes(1);
    expect(result).toEqual(1);
  });

  test("with filter", () => {
    const counter = createLazyInvocationCounter();
    const result = pipe(
      [1, 2, 4, 8, 16] as const,
      counter.fn(),
      filter((x) => x > 3),
      first(),
      defaultTo(0),
      (x) => x + 1,
    );
    expect(counter.count).toHaveBeenCalledTimes(3);
    expect(result).toEqual(5);
  });

  test("empty array", () => {
    const counter = createLazyInvocationCounter();
    const result = pipe([] as const, counter.fn(), first());
    expect(counter.count).toHaveBeenCalledTimes(0);
    expect(result).toEqual(undefined);
  });

  test("2 x first()", () => {
    const counter = createLazyInvocationCounter();
    const result = pipe(
      [[1, 2, 3], [4, 5], [6]] as const,
      counter.fn(),
      first(),
      defaultTo<ReadonlyArray<number>>([]),
      first(),
    );
    expect(counter.count).toHaveBeenCalledTimes(1);
    expect(result).toEqual(1);
  });

  test("complex", () => {
    const counter1 = createLazyInvocationCounter();
    const counter2 = createLazyInvocationCounter();
    const result = pipe(
      [[1, 2, 3], [1], [4, 5, 6, 7], [1, 2, 3, 4]] as const,
      counter1.fn(),
      filter((arr) => arr.length === 4),
      first(),
      defaultTo<ReadonlyArray<number>>([]),
      counter2.fn(),
      filter((x) => x % 2 === 1),
      first(),
    );
    expect(counter1.count).toHaveBeenCalledTimes(3);
    expect(counter2.count).toHaveBeenCalledTimes(2);
    expect(result).toEqual(5);
  });
});
