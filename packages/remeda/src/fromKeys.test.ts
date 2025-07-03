import { describe, expect, test } from "vitest";
import { add } from "./add";
import { fromKeys } from "./fromKeys";
import { pipe } from "./pipe";

test("works on trivially empty arrays", () => {
  expect(fromKeys([] as Array<string>, (item) => `${item}_`)).toStrictEqual({});
});

test("works on regular arrays", () => {
  expect(fromKeys(["a"], (item) => `${item}_`)).toStrictEqual({ a: "a_" });
});

test("works with duplicates", () => {
  expect(fromKeys(["a", "a"], (item) => `${item}_`)).toStrictEqual({ a: "a_" });
});

test("uses the last value", () => {
  let counter = 0;

  expect(
    fromKeys(["a", "a"], () => {
      counter += 1;
      return counter;
    }),
  ).toStrictEqual({ a: 2 });
});

test("works with number keys", () => {
  expect(fromKeys([123], add(1))).toStrictEqual({ 123: 124 });
});

test("works with symbols", () => {
  const symbol = Symbol("a");

  expect(fromKeys([symbol], () => 1)).toStrictEqual({ [symbol]: 1 });
});

test("works with a mix of key types", () => {
  const symbol = Symbol("a");

  expect(fromKeys(["a", 123, symbol], (item) => typeof item)).toStrictEqual({
    a: "string",
    123: "number",
    [symbol]: "symbol",
  });
});

describe("dataLast", () => {
  test("works on trivially empty arrays", () => {
    expect(
      pipe(
        [] as Array<string>,
        fromKeys((item) => `${item}_`),
      ),
    ).toStrictEqual({});
  });

  test("works on regular arrays", () => {
    expect(
      pipe(
        ["a"],
        fromKeys((item) => `${item}_`),
      ),
    ).toStrictEqual({ a: "a_" });
  });

  test("works with duplicates", () => {
    expect(
      pipe(
        ["a", "a"],
        fromKeys((item) => `${item}_`),
      ),
    ).toStrictEqual({ a: "a_" });
  });

  test("uses the last value", () => {
    let counter = 0;

    expect(
      pipe(
        ["a", "a"],
        fromKeys(() => {
          counter += 1;
          return counter;
        }),
      ),
    ).toStrictEqual({ a: 2 });
  });

  test("works with number keys", () => {
    expect(pipe([123], fromKeys(add(1)))).toStrictEqual({ 123: 124 });
  });

  test("works with symbols", () => {
    const symbol = Symbol("a");

    expect(
      pipe(
        [symbol],
        fromKeys(() => 1),
      ),
    ).toStrictEqual({ [symbol]: 1 });
  });

  test("works with a mix of key types", () => {
    const symbol = Symbol("a");

    expect(
      pipe(
        ["a", 123, symbol],
        fromKeys((item) => typeof item),
      ),
    ).toStrictEqual({
      a: "string",
      123: "number",
      [symbol]: "symbol",
    });
  });
});
