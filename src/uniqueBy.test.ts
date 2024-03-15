import { createLazyInvocationCounter } from "../test/lazy_invocation_counter";
import { identity } from "./identity";
// import { uniq } from './uniq';
import { pipe } from "./pipe";
import { take } from "./take";
import { uniqueBy } from "./uniqueBy";

describe("uniqueBy", () => {
  const people = [
    { name: "John", age: 42 },
    { name: "Jörn", age: 30 },
    { name: "Sarah", age: 33 },
    { name: "Kim", age: 22 },
    { name: "Sarah", age: 38 },
    { name: "John", age: 33 },
    { name: "Emily", age: 42 },
  ] as const;

  it("handles uniq by identity", () => {
    expect(uniqueBy([1, 2, 2, 5, 1, 6, 7], identity)).toEqual([1, 2, 5, 6, 7]);
  });

  it("returns people with uniq names", () => {
    expect(uniqueBy(people, (p) => p.name)).toEqual([
      { name: "John", age: 42 },
      { name: "Jörn", age: 30 },
      { name: "Sarah", age: 33 },
      { name: "Kim", age: 22 },
      { name: "Emily", age: 42 },
    ]);
  });

  it("returns people with uniq ages", () => {
    expect(uniqueBy(people, (p) => p.age)).toEqual([
      { name: "John", age: 42 },
      { name: "Jörn", age: 30 },
      { name: "Sarah", age: 33 },
      { name: "Kim", age: 22 },
      { name: "Sarah", age: 38 },
    ]);
  });

  it("returns people with uniq first letter of name", () => {
    expect(uniqueBy(people, (p) => p.name.slice(0, 1))).toEqual([
      { name: "John", age: 42 },
      { name: "Sarah", age: 33 },
      { name: "Kim", age: 22 },
      { name: "Emily", age: 42 },
    ]);
  });

  describe("pipe", () => {
    it("gets executed until target length is reached", () => {
      const counter = createLazyInvocationCounter();
      const result = pipe(
        [1, 2, 2, 5, 1, 6, 7],
        counter.fn(),
        uniqueBy(identity),
        take(3),
      );

      expect(counter.count).toHaveBeenCalledTimes(4);
      expect(result).toEqual([1, 2, 5]);
    });

    it("get executed 3 times when take before uniqueBy", () => {
      const counter = createLazyInvocationCounter();
      const result = pipe(
        [1, 2, 2, 5, 1, 6, 7],
        counter.fn(),
        take(3),
        uniqueBy(identity),
      );

      expect(counter.count).toHaveBeenCalledTimes(3);
      expect(result).toEqual([1, 2]);
    });
  });
});
