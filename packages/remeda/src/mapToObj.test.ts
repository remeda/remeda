import { describe, expect, test, vi } from "vitest";
import { mapToObj } from "./mapToObj";
import { pipe } from "./pipe";

describe("data_first", () => {
  test("mapToObj", () => {
    const result = mapToObj([1, 2, 3], (x) => [String(x), x * 2]);

    expect(result).toStrictEqual({ 1: 2, 2: 4, 3: 6 });
  });

  test("indexed", () => {
    const result = mapToObj([0, 0, 0], (_, i) => [i, i]);

    expect(result).toStrictEqual({ 0: 0, 1: 1, 2: 2 });
  });

  test("empty array", () => {
    expect(mapToObj([] as string[], (item) => [item, item])).toStrictEqual({});
  });

  test("single item", () => {
    expect(mapToObj(["a"], (item) => [item, 1])).toStrictEqual({ a: 1 });
  });

  test("prototype is Object.prototype", () => {
    expect(Object.getPrototypeOf(mapToObj(["a"], (item) => [item, 1]))).toBe(
      Object.prototype,
    );
  });

  test("`__proto__` key replaces the prototype with an object value", () => {
    const value = { a: 1 };

    expect(
      Object.getPrototypeOf(mapToObj(["__proto__"], (item) => [item, value])),
    ).toBe(value);
  });

  test("`__proto__` key isn't an own property", () => {
    expect(
      Reflect.ownKeys(mapToObj(["__proto__"], (item) => [item, { a: 1 }])),
    ).toStrictEqual([]);
  });

  test("`__proto__` key with a primitive value is ignored", () => {
    expect(mapToObj(["__proto__"], (item) => [item, 1])).toStrictEqual({});
  });

  test("a repeated key keeps its first position and the last value", () => {
    expect(
      Object.entries(
        mapToObj([1, 2, 3], (item) => [item === 2 ? "b" : "a", item]),
      ),
    ).toStrictEqual([
      ["a", 3],
      ["b", 2],
    ]);
  });

  test("number keys share the property of their string form", () => {
    expect(
      mapToObj([1, 2], (item) => [item === 1 ? 1 : "1", item]),
    ).toStrictEqual({ 1: 2 });
  });

  test("key order", () => {
    const mySymbol = Symbol("mySymbol");

    expect(
      Reflect.ownKeys(
        mapToObj(["b", "10", mySymbol, "a", "2", "b"], (item) => [item, 1]),
      ),
    ).toStrictEqual(["2", "10", "b", "a", mySymbol]);
  });

  test("holes are mapped as undefined", () => {
    expect(
      // eslint-disable-next-line no-sparse-arrays -- The hole is the input under test.
      mapToObj([1, , 3], (item, index) => [item ?? "hole", index]),
    ).toStrictEqual({ 1: 0, hole: 1, 3: 2 });
  });

  test("reads the entry through its iterator", () => {
    const accessed: PropertyKey[] = [];
    const tuple: [string, number] = ["a", 1];
    const entry = new Proxy(tuple, {
      get: (target, property, receiver): unknown => {
        accessed.push(property);
        return Reflect.get(target, property, receiver);
      },
    });

    mapToObj([0], () => entry);

    expect(accessed).toStrictEqual([
      Symbol.iterator,
      "length",
      "0",
      "length",
      "1",
    ]);
  });

  test("a result that isn't iterable throws", () => {
    // V8 names the destructured call in the message, which is `fn` in the
    // implementation.
    // @ts-expect-error [ts2322] -- The invalid result is the input under test.
    expect(() => mapToObj([1], () => 1)).toThrow(
      new TypeError("fn is not a function or its return value is not iterable"),
    );
  });

  test("calls the callback once per item, in order, with the whole input", () => {
    const data = ["a", "b", "c"];
    const callback = vi.fn<
      (
        value: string,
        index: number,
        data: readonly string[],
      ) => [string, number]
    >((value, index) => [value, index]);

    mapToObj(data, callback);

    expect(callback.mock.calls).toStrictEqual([
      ["a", 0, data],
      ["b", 1, data],
      ["c", 2, data],
    ]);
  });
});

describe("data_last", () => {
  test("mapToObj", () => {
    const result = pipe(
      [1, 2, 3],
      mapToObj((x) => [String(x), x * 2]),
    );

    expect(result).toStrictEqual({ 1: 2, 2: 4, 3: 6 });
  });

  test("indexed", () => {
    const result = pipe(
      [0, 0, 0],
      mapToObj((_, i) => [i, i]),
    );

    expect(result).toStrictEqual({ 0: 0, 1: 1, 2: 2 });
  });

  test("empty array", () => {
    expect(
      pipe(
        [] as string[],
        mapToObj((item) => [item, item]),
      ),
    ).toStrictEqual({});
  });

  test("prototype is Object.prototype", () => {
    expect(
      Object.getPrototypeOf(
        pipe(
          ["a"],
          mapToObj((item) => [item, 1]),
        ),
      ),
    ).toBe(Object.prototype);
  });

  test("a result that isn't iterable throws", () => {
    expect(() =>
      pipe(
        [1],
        // @ts-expect-error [ts2322] -- The invalid result is the input under test.
        mapToObj(() => 1),
      ),
    ).toThrow(
      new TypeError("fn is not a function or its return value is not iterable"),
    );
  });
});
