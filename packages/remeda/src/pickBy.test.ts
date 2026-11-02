import { describe, expect, test, vi } from "vitest";
import { constant } from "./constant";
import { pickBy } from "./pickBy";
import { pipe } from "./pipe";

test("dataFirst", () => {
  expect(
    pickBy({ a: 1, b: 2, A: 3, B: 4 }, (_, key) => key.toUpperCase() === key),
  ).toStrictEqual({ A: 3, B: 4 });
});

test("dataLast", () => {
  expect(
    pipe(
      { a: 1, b: 2, A: 3, B: 4 },
      pickBy((_, key) => key.toUpperCase() === key),
    ),
  ).toStrictEqual({ A: 3, B: 4 });
});

test("symbols are filtered out", () => {
  const mySymbol = Symbol("mySymbol");

  expect(pickBy({ [mySymbol]: 1 }, constant(true))).toStrictEqual({});
});

test("symbols are not passed to the predicate", () => {
  const predicate = vi.fn<(x: string) => boolean>();
  const data = { [Symbol("mySymbol")]: 1, a: "hello" };
  pickBy(data, predicate);

  expect(predicate).toHaveBeenCalledExactlyOnceWith("hello", "a", data);
});

describe("`__proto__` key", () => {
  test("is an own property", () => {
    expect(
      Object.entries(
        pickBy({ ["__proto__"]: { hello: "world" } }, constant(true)),
      ),
    ).toStrictEqual([["__proto__", { hello: "world" }]]);
  });

  test("keeps the prototype", () => {
    expect(
      Object.getPrototypeOf(
        pickBy({ ["__proto__"]: { a: 1 } }, constant(true)),
      ),
    ).toBe(Object.prototype);
  });
});
