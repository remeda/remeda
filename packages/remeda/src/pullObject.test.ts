import { describe, expect, test, vi } from "vitest";
import { add } from "./add";
import { constant } from "./constant";
import { identity } from "./identity";
import { pipe } from "./pipe";
import { prop } from "./prop";
import { pullObject } from "./pullObject";

describe("dataFirst", () => {
  test("empty array", () => {
    expect(pullObject([], constant("key"), constant("value"))).toStrictEqual(
      {},
    );
  });

  test("number items", () => {
    expect(pullObject([1, 2], (item) => `item_${item}`, add(2))).toStrictEqual({
      item_1: 3,
      item_2: 4,
    });
  });

  test("string items", () => {
    expect(
      pullObject(
        ["a", "b"],
        (item) => `item_${item}`,
        (item) => item.toUpperCase(),
      ),
    ).toStrictEqual({ item_a: "A", item_b: "B" });
  });

  test("object items", () => {
    expect(
      pullObject(
        [
          { key: "a", value: 1 },
          { key: "b", value: 2 },
        ],
        prop("key"),
        prop("value"),
      ),
    ).toStrictEqual({ a: 1, b: 2 });
  });

  test("number keys", () => {
    expect(
      pullObject(["a", "aa"], (item) => item.length, identity()),
    ).toStrictEqual({
      1: "a",
      2: "aa",
    });
  });

  test("undefined values", () => {
    expect(pullObject(["a"], identity(), constant(undefined))).toStrictEqual({
      a: undefined,
    });
  });

  test("last value wins", () => {
    expect(
      pullObject(
        [
          { id: "a", val: "hello" },
          { id: "a", val: "world" },
        ],
        prop("id"),
        prop("val"),
      ),
    ).toStrictEqual({ a: "world" });
  });

  test("guaranteed to run on each item", () => {
    const data = ["a", "a", "a", "a", "a", "a"];

    const keyFn = vi.fn<(x: string) => string>();
    const valueFn = vi.fn<(x: string) => string>();

    pullObject(data, keyFn, valueFn);

    expect(keyFn).toHaveBeenCalledTimes(data.length);
    expect(valueFn).toHaveBeenCalledTimes(data.length);
  });

  test("single item", () => {
    expect(pullObject(["a"], identity(), constant(1))).toStrictEqual({ a: 1 });
  });

  test("prototype is Object.prototype", () => {
    expect(
      Object.getPrototypeOf(pullObject(["a"], identity(), constant(1))),
    ).toBe(Object.prototype);
  });

  test("`__proto__` key replaces the prototype with an object value", () => {
    const value = { a: 1 };

    expect(
      Object.getPrototypeOf(
        pullObject(["__proto__"], identity(), constant(value)),
      ),
    ).toBe(value);
  });

  test("`__proto__` key isn't an own property", () => {
    expect(
      Reflect.ownKeys(
        pullObject(["__proto__"], identity(), constant({ a: 1 })),
      ),
    ).toStrictEqual([]);
  });

  test("`__proto__` key with a primitive value is ignored", () => {
    expect(pullObject(["__proto__"], identity(), constant(1))).toStrictEqual(
      {},
    );
  });

  test("a repeated key keeps its first position", () => {
    expect(
      Object.entries(
        pullObject(["b", "a", "b"], identity(), (_, index) => index),
      ),
    ).toStrictEqual([
      ["b", 2],
      ["a", 1],
    ]);
  });

  test("number keys share the property of their string form", () => {
    expect(
      pullObject([1, "1"], identity(), (item) => typeof item),
    ).toStrictEqual({ 1: "string" });
  });

  test("key order", () => {
    const mySymbol = Symbol("mySymbol");

    expect(
      Reflect.ownKeys(
        pullObject(
          ["b", "10", mySymbol, "a", "2", "b"],
          identity(),
          constant(1),
        ),
      ),
    ).toStrictEqual(["2", "10", "b", "a", mySymbol]);
  });

  test("holes are extracted as undefined", () => {
    expect(
      // eslint-disable-next-line no-sparse-arrays -- The hole is the input under test.
      pullObject([1, , 3], (item) => item ?? "hole", identity()),
    ).toStrictEqual({ 1: 1, 3: 3, hole: undefined });
  });

  test("calls the extractors in turn for each item", () => {
    const calls: string[] = [];

    pullObject(
      ["a", "b"],
      (item) => {
        calls.push(`key ${item}`);
        return item;
      },
      (item) => {
        calls.push(`value ${item}`);
        return item;
      },
    );

    expect(calls).toStrictEqual(["key a", "value a", "key b", "value b"]);
  });

  test("calls the key extractor once per item, in order, with the whole input", () => {
    const data = ["a", "b", "c"];
    const keyExtractor =
      vi.fn<(item: string, index: number, data: readonly string[]) => string>(
        identity(),
      );

    pullObject(data, keyExtractor, constant(1));

    expect(keyExtractor.mock.calls).toStrictEqual([
      ["a", 0, data],
      ["b", 1, data],
      ["c", 2, data],
    ]);
  });

  test("calls the value extractor once per item, in order, with the whole input", () => {
    const data = ["a", "b", "c"];
    const valueExtractor = vi.fn<
      (item: string, index: number, data: readonly string[]) => number
    >(constant(1));

    pullObject(data, identity(), valueExtractor);

    expect(valueExtractor.mock.calls).toStrictEqual([
      ["a", 0, data],
      ["b", 1, data],
      ["c", 2, data],
    ]);
  });
});

describe("dataLast", () => {
  test("empty array", () => {
    expect(
      pipe([], pullObject(constant("key"), constant("value"))),
    ).toStrictEqual({});
  });

  test("number items", () => {
    expect(
      pipe(
        [1, 2],
        pullObject((item) => `item_${item}`, add(2)),
      ),
    ).toStrictEqual({ item_1: 3, item_2: 4 });
  });

  test("string items", () => {
    expect(
      pipe(
        ["a", "b"],
        pullObject(
          (item) => `item_${item}`,
          (item) => item.toUpperCase(),
        ),
      ),
    ).toStrictEqual({ item_a: "A", item_b: "B" });
  });

  test("object items", () => {
    expect(
      pipe(
        [
          { key: "a", value: 1 },
          { key: "b", value: 2 },
        ],
        pullObject(prop("key"), prop("value")),
      ),
    ).toStrictEqual({ a: 1, b: 2 });
  });

  test("number keys", () => {
    expect(
      pipe(
        ["a", "aa"],
        pullObject((item) => item.length, identity()),
      ),
    ).toStrictEqual({ 1: "a", 2: "aa" });
  });

  test("undefined values", () => {
    expect(
      pipe(["a"], pullObject(identity(), constant(undefined))),
    ).toStrictEqual({
      a: undefined,
    });
  });

  test("last value wins", () => {
    expect(
      pipe(
        [
          { id: "a", val: "hello" },
          { id: "a", val: "world" },
        ],
        pullObject(prop("id"), prop("val")),
      ),
    ).toStrictEqual({ a: "world" });
  });

  test("guaranteed to run on each item", () => {
    const data = ["a", "a", "a", "a", "a", "a"];

    const keyFn = vi.fn<(x: string) => string>();
    const valueFn = vi.fn<(x: string) => string>();

    pipe(data, pullObject(keyFn, valueFn));

    expect(keyFn).toHaveBeenCalledTimes(data.length);
    expect(valueFn).toHaveBeenCalledTimes(data.length);
  });

  test("prototype is Object.prototype", () => {
    expect(
      Object.getPrototypeOf(pipe(["a"], pullObject(identity(), constant(1)))),
    ).toBe(Object.prototype);
  });
});
