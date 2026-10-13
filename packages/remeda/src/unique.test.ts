import { describe, expect, test } from "vitest";
import { createLazyInvocationCounter } from "../test/lazyInvocationCounter";
import { map } from "./map";
import { pipe } from "./pipe";
import { take } from "./take";
import { unique } from "./unique";

test("unique", () => {
  expect(unique([1, 2, 2, 5, 1, 6, 7] as const)).toStrictEqual([1, 2, 5, 6, 7]);
});

test("returns a shallow clone when nothing is removed", () => {
  const data = [1, 2, 3];
  const result = unique(data);

  expect(result).toStrictEqual(data);
  expect(result).not.toBe(data);
});

test("keeps `-0`", () => {
  const result = unique([-0, 0]);

  expect(result).toHaveLength(1);
  expect(result[0]).toBe(-0);
});

test("a data-last call reused as a callback starts fresh", () => {
  expect(
    map(
      [
        [1, 1, 2],
        [1, 1, 2],
      ],
      unique(),
    ),
  ).toStrictEqual([
    [1, 2],
    [1, 2],
  ]);
});

describe(pipe, () => {
  test("unique", () => {
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

  test("take before unique", () => {
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
