import { describe, expect, test, vi } from "vitest";
import { constant } from "./constant";
import { identity } from "./identity";
import { indexBy } from "./indexBy";
import { pipe } from "./pipe";
import { prop } from "./prop";

test("dataFirst", () => {
  expect(
    indexBy(
      [
        { dir: "left", code: 97 },
        { dir: "right", code: 100 },
      ],
      prop("code"),
    ),
  ).toStrictEqual({
    97: { dir: "left", code: 97 },
    100: { dir: "right", code: 100 },
  });
});

test("dataLast", () => {
  expect(
    pipe(
      [
        { dir: "left", code: 97 },
        { dir: "right", code: 100 },
      ],
      indexBy(prop("code")),
    ),
  ).toStrictEqual({
    97: { dir: "left", code: 97 },
    100: { dir: "right", code: 100 },
  });
});

test("empty array", () => {
  expect(indexBy([], constant("a"))).toStrictEqual({});
});

test("single item", () => {
  expect(indexBy(["a"], identity())).toStrictEqual({ a: "a" });
});

test("prototype is Object.prototype", () => {
  expect(Object.getPrototypeOf(indexBy(["a"], identity()))).toBe(
    Object.prototype,
  );
});

test("the last item with a key wins", () => {
  expect(
    indexBy(
      [
        { id: "a", value: 1 },
        { id: "a", value: 2 },
      ],
      prop("id"),
    ),
  ).toStrictEqual({ a: { id: "a", value: 2 } });
});

test("key order", () => {
  const mySymbol = Symbol("mySymbol");

  expect(
    Reflect.ownKeys(indexBy(["b", "10", mySymbol, "a", "2", "b"], identity())),
  ).toStrictEqual(["2", "10", "b", "a", mySymbol]);
});

test("number keys share the property of their string form", () => {
  expect(indexBy([1, "1"], identity())).toStrictEqual({ 1: "1" });
});

describe("`__proto__` key", () => {
  test("keeps the prototype", () => {
    expect(
      Object.getPrototypeOf(indexBy([{ id: "__proto__" }], prop("id"))),
    ).toBe(Object.prototype);
  });

  test("with an object item is an own property", () => {
    expect(
      Reflect.ownKeys(indexBy([{ id: "__proto__" }], prop("id"))),
    ).toStrictEqual(["__proto__"]);
  });

  test("with a null item keeps the prototype", () => {
    expect(Object.getPrototypeOf(indexBy([null], constant("__proto__")))).toBe(
      Object.prototype,
    );
  });

  test("with a primitive item is an own property", () => {
    expect(Object.entries(indexBy(["a"], constant("__proto__")))).toStrictEqual(
      [["__proto__", "a"]],
    );
  });
});

test("holes are indexed as undefined", () => {
  expect(indexBy([1, , 3], (item) => item ?? "hole")).toStrictEqual({
    1: 1,
    3: 3,
    hole: undefined,
  });
});

test("calls the mapper once per item, in order, with the whole input", () => {
  const data = ["a", "b", "c"];
  const mapper =
    vi.fn<(item: string, index: number, data: readonly string[]) => string>(
      identity(),
    );

  indexBy(data, mapper);

  expect(mapper.mock.calls).toStrictEqual([
    ["a", 0, data],
    ["b", 1, data],
    ["c", 2, data],
  ]);
});

test("empty array in a pipe", () => {
  expect(pipe([], indexBy(constant("a")))).toStrictEqual({});
});

test("prototype is Object.prototype in a pipe", () => {
  expect(Object.getPrototypeOf(pipe(["a"], indexBy(identity())))).toBe(
    Object.prototype,
  );
});
