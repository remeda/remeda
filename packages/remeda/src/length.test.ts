import { describe, expect, test } from "vitest";
import { length } from "./length";
import { pipe } from "./pipe";

describe("data first", () => {
  test("array", () => {
    expect(length([0, 1, 2, 3, 4])).toBe(5);
  });

  test("iterable", () => {
    expect(
      length({
        *[Symbol.iterator]() {
          yield 0;
          yield 1;
          yield 2;
          yield 3;
        },
      }),
    ).toBe(4);
  });

  test("empty array", () => {
    expect(length([])).toBe(0);
  });

  test("counts holes", () => {
    // eslint-disable-next-line no-sparse-arrays -- The hole is the case under test.
    expect(length([1, , 3])).toBe(3);
  });

  test("an ArrayLike that isn't iterable", () => {
    expect(length({ 0: "a", 1: "b", length: 2 })).toBe(2);
  });

  test("reads an ArrayLike's length rather than counting its items", () => {
    expect(length({ 0: "a", length: 3 })).toBe(3);
  });

  test("reads an iterable's length rather than iterating it", () => {
    expect(
      length({
        length: 5,
        *[Symbol.iterator]() {
          yield 1;
        },
      }),
    ).toBe(5);
  });

  test("throws on a string", () => {
    expect(() => length("abc")).toThrow(
      new TypeError("Cannot use 'in' operator to search for 'length' in abc"),
    );
  });
});

describe("curried", () => {
  test("array", () => {
    expect(pipe([0, 1, 2, 3, 4], length())).toBe(5);
  });

  test("iterable", () => {
    expect(
      pipe(
        {
          *[Symbol.iterator]() {
            yield 0;
            yield 1;
            yield 2;
            yield 3;
          },
        },
        length(),
      ),
    ).toBe(4);
  });

  test("empty array", () => {
    expect(pipe([], length())).toBe(0);
  });

  test("an ArrayLike that isn't iterable", () => {
    expect(pipe({ 0: "a", 1: "b", length: 2 }, length())).toBe(2);
  });

  test("reads an iterable's length like data-first", () => {
    expect(
      pipe(
        {
          length: 5,
          *[Symbol.iterator]() {
            yield 1;
          },
        },
        length(),
      ),
    ).toBe(5);
  });

  test("throws like data-first on a string", () => {
    expect(() => pipe("abc", length())).toThrow(
      new TypeError("Cannot use 'in' operator to search for 'length' in abc"),
    );
  });
});
