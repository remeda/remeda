import { createLazyInvocationCounter } from "../test/lazy_invocation_counter";
import { findIndex } from "./findIndex";
import { pipe } from "./pipe";

describe("data first", () => {
  test("findIndex", () => {
    expect(findIndex([10, 20, 30] as const, (x) => x === 20)).toBe(1);
  });

  test("findIndex -1", () => {
    expect(findIndex([2, 3, 4] as const, (x) => x === (20 as number))).toBe(-1);
  });
});

describe("data last", () => {
  test("findIndex", () => {
    const counter = createLazyInvocationCounter();
    const actual = pipe(
      [10, 20, 30] as const,
      counter.fn(),
      findIndex((x) => x === 20),
    );
    expect(counter.count).toHaveBeenCalledTimes(2);
    expect(actual).toEqual(1);
  });
});
