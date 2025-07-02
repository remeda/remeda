import { expect, test, vi } from "vitest";
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
  const mock = vi.fn<(x: string) => boolean>();
  const data = { [Symbol("mySymbol")]: 1, a: "hello" };
  pickBy(data, mock);

  expect(mock).toHaveBeenCalledTimes(1);
  expect(mock).toHaveBeenCalledWith("hello", "a", data);
});
