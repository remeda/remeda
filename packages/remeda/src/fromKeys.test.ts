import { describe, expect, test, vi } from "vitest";
import { add } from "./add";
import { constant } from "./constant";
import { fromKeys } from "./fromKeys";
import { pipe } from "./pipe";

test("works on trivially empty arrays", () => {
  expect(fromKeys([] as string[], (item) => `${item}_`)).toStrictEqual({});
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

test("prototype is Object.prototype", () => {
  expect(Object.getPrototypeOf(fromKeys(["a"], constant(1)))).toBe(
    Object.prototype,
  );
});

test("`__proto__` key keeps the prototype", () => {
  expect(
    Object.getPrototypeOf(fromKeys(["__proto__"], constant({ a: 1 }))),
  ).toBe(Object.prototype);
});

test("`__proto__` key with an object value is an own property", () => {
  expect(
    Reflect.ownKeys(fromKeys(["__proto__"], constant({ a: 1 }))),
  ).toStrictEqual(["__proto__"]);
});

test("`__proto__` key with a primitive value is an own property", () => {
  expect(Object.entries(fromKeys(["__proto__"], constant(1)))).toStrictEqual([
    ["__proto__", 1],
  ]);
});

test("number keys share the property of their string form", () => {
  expect(fromKeys([1, "1"], (item) => typeof item)).toStrictEqual({
    1: "string",
  });
});

test("key order", () => {
  const symbol = Symbol("a");

  expect(
    Reflect.ownKeys(fromKeys(["b", "10", symbol, "a", "2", "b"], constant(1))),
  ).toStrictEqual(["2", "10", "b", "a", symbol]);
});

test("holes are keyed as undefined", () => {
  // A sparse literal would type its hole as `undefined`, which isn't a key.
  const keys = ["a"];
  keys[2] = "c";

  expect(fromKeys(keys, (_, index) => index)).toStrictEqual({
    a: 0,
    undefined: 1,
    c: 2,
  });
});

test("calls the mapper once per key, in order, with the whole input", () => {
  const data = ["a", "b", "c"];
  const mapper = vi.fn<
    (item: string, index: number, data: readonly string[]) => number
  >(constant(1));

  fromKeys(data, mapper);

  expect(mapper.mock.calls).toStrictEqual([
    ["a", 0, data],
    ["b", 1, data],
    ["c", 2, data],
  ]);
});

describe("dataLast", () => {
  test("works on trivially empty arrays", () => {
    expect(
      pipe(
        [] as string[],
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

  test("prototype is Object.prototype", () => {
    expect(Object.getPrototypeOf(pipe(["a"], fromKeys(constant(1))))).toBe(
      Object.prototype,
    );
  });
});
