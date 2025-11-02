import { expect, test } from "vitest";
import { pick } from "./pick";
import { pipe } from "./pipe";

test("dataFirst", () => {
  expect(pick({ a: 1, b: 2, c: 3, d: 4 }, ["a", "d"])).toStrictEqual({
    a: 1,
    d: 4,
  });
});

test("dataLast", () => {
  expect(pipe({ a: 1, b: 2, c: 3, d: 4 }, pick(["a", "d"]))).toStrictEqual({
    a: 1,
    d: 4,
  });
});

test("it can pick symbol keys", () => {
  const mySymbol = Symbol("mySymbol");

  expect(pick({ [mySymbol]: 3, a: 4 }, [mySymbol])).toStrictEqual({
    [mySymbol]: 3,
  });
});

test("picking from non-existent keys (in a union)", () => {
  expect(pick({ a: 1 } as { a: number } | { b: string }, ["b"])).toStrictEqual(
    {},
  );
});
