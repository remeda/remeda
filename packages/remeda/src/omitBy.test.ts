import { describe, expect, test, vi } from "vitest";
import { constant } from "./constant";
import { omitBy } from "./omitBy";
import { pipe } from "./pipe";

test("dataFirst", () => {
  expect(
    omitBy({ a: 1, b: 2, A: 3, B: 4 }, (_, key) => key.toUpperCase() === key),
  ).toStrictEqual({ a: 1, b: 2 });
});

test("dataLast", () => {
  expect(
    pipe(
      { a: 1, b: 2, A: 3, B: 4 },
      omitBy((_, key) => key.toUpperCase() === key),
    ),
  ).toStrictEqual({ a: 1, b: 2 });
});

test("number keys are passed to the predicate as strings", () => {
  const predicate = vi.fn<(value: string, key: string) => boolean>();
  const data = { 123: "hello" };
  omitBy(data, predicate);

  expect(predicate).toHaveBeenCalledExactlyOnceWith("hello", "123", data);
});

test("symbols are passed through", () => {
  const mySymbol = Symbol("mySymbol");

  expect(omitBy({ [mySymbol]: 1 }, constant(true))).toStrictEqual({
    [mySymbol]: 1,
  });
});

test("non-enumerable symbols are dropped", () => {
  const mySymbol = Symbol("mySymbol");
  const data = Object.defineProperty({ a: 1 }, mySymbol, {
    value: 1,
    enumerable: false,
  });

  expect(
    Object.getOwnPropertySymbols(omitBy(data, constant(false))),
  ).toStrictEqual([]);
});

describe("`__proto__` key", () => {
  test("is an own property", () => {
    expect(
      Object.entries(
        omitBy({ ["__proto__"]: { hello: "world" } }, constant(false)),
      ),
    ).toStrictEqual([["__proto__", { hello: "world" }]]);
  });

  test("keeps the prototype", () => {
    expect(
      Object.getPrototypeOf(
        omitBy({ ["__proto__"]: { a: 1 } }, constant(false)),
      ),
    ).toBe(Object.prototype);
  });

  test("is omitted when the predicate matches", () => {
    expect(
      Object.entries(
        omitBy({ ["__proto__"]: { hello: "world" } }, constant(true)),
      ),
    ).toStrictEqual([]);
  });
});

test("symbols are not passed to the predicate", () => {
  const predicate = vi.fn<(x: string) => boolean>();
  const data = { [Symbol("mySymbol")]: 1, a: "hello" };
  omitBy(data, predicate);

  expect(predicate).toHaveBeenCalledExactlyOnceWith("hello", "a", data);
});
