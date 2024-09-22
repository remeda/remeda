import { createLazyInvocationCounter } from "../test/lazyInvocationCounter";
import { pipe } from "./pipe";
import { take } from "./take";
import { unique } from "./unique";

it("unique", () => {
  expect(unique([1, 2, 2, 5, 1, 6, 7] as const)).toStrictEqual([1, 2, 5, 6, 7]);
});

describe("pipe", () => {
  it("unique", () => {
    const counter = createLazyInvocationCounter();
    const result = pipe(
      [1, 2, 2, 5, 1, 6, 7] as const,
      counter.fn(),
      unique(),
      take(3),
    );

    expect(counter.count).toHaveBeenCalledTimes(4);
    expect(result).toStrictEqual([1, 2, 5]);
  });

  it("take before unique", () => {
    // bug from https://github.com/remeda/remeda/issues/14
    const counter = createLazyInvocationCounter();
    const result = pipe(
      [1, 2, 2, 5, 1, 6, 7] as const,
      counter.fn(),
      take(3),
      unique(),
    );

    expect(counter.count).toHaveBeenCalledTimes(3);
    expect(result).toStrictEqual([1, 2]);
  });
});
