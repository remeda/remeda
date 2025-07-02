import { describe, expect, test } from "vitest";
import { createLazyInvocationCounter } from "../test/lazyInvocationCounter";
import { identity } from "./identity";
import { pipe } from "./pipe";
import { take } from "./take";
import { uniqueBy } from "./uniqueBy";

const PEOPLE = [
  { name: "John", age: 42 },
  { name: "Jörn", age: 30 },
  { name: "Sarah", age: 33 },
  { name: "Kim", age: 22 },
  { name: "Sarah", age: 38 },
  { name: "John", age: 33 },
  { name: "Emily", age: 42 },
] as const;

test("handles uniq by identity", () => {
  expect(uniqueBy([1, 2, 2, 5, 1, 6, 7], identity())).toStrictEqual([
    1, 2, 5, 6, 7,
  ]);
});

test("returns people with uniq names", () => {
  expect(uniqueBy(PEOPLE, (p) => p.name)).toStrictEqual([
    { name: "John", age: 42 },
    { name: "Jörn", age: 30 },
    { name: "Sarah", age: 33 },
    { name: "Kim", age: 22 },
    { name: "Emily", age: 42 },
  ]);
});

test("returns people with uniq ages", () => {
  expect(uniqueBy(PEOPLE, (p) => p.age)).toStrictEqual([
    { name: "John", age: 42 },
    { name: "Jörn", age: 30 },
    { name: "Sarah", age: 33 },
    { name: "Kim", age: 22 },
    { name: "Sarah", age: 38 },
  ]);
});

test("returns people with uniq first letter of name", () => {
  expect(uniqueBy(PEOPLE, (p) => p.name.slice(0, 1))).toStrictEqual([
    { name: "John", age: 42 },
    { name: "Sarah", age: 33 },
    { name: "Kim", age: 22 },
    { name: "Emily", age: 42 },
  ]);
});

// eslint-disable-next-line vitest/valid-title -- This seems to be a bug in the rule, @see https://github.com/vitest-dev/eslint-plugin-vitest/issues/692
describe(pipe, () => {
  test("gets executed until target length is reached", () => {
    const counter = createLazyInvocationCounter();
    const result = pipe(
      [1, 2, 2, 5, 1, 6, 7],
      counter.fn(),
      uniqueBy(identity()),
      take(3),
    );

    expect(counter.count).toHaveBeenCalledTimes(4);
    expect(result).toStrictEqual([1, 2, 5]);
  });

  test("get executed 3 times when take before uniqueBy", () => {
    const counter = createLazyInvocationCounter();
    const result = pipe(
      [1, 2, 2, 5, 1, 6, 7],
      counter.fn(),
      take(3),
      uniqueBy(identity()),
    );

    expect(counter.count).toHaveBeenCalledTimes(3);
    expect(result).toStrictEqual([1, 2]);
  });
});
