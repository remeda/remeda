import { describe, expect, test } from "vitest";
import { doNothing } from "./doNothing";
import { mergeDeep } from "./mergeDeep";

describe("runtime (dataFirst)", () => {
  test("should merge objects", () => {
    const a = { foo: "baz", x: 1 };
    const b = { foo: "bar", y: 2 };

    expect(mergeDeep(a, b)).toStrictEqual({ foo: "bar", x: 1, y: 2 });
  });

  test("should merge nested objects", () => {
    const a = { foo: { bar: "baz" } };
    const b = { foo: { qux: "quux" } };

    expect(mergeDeep(a, b)).toStrictEqual({ foo: { bar: "baz", qux: "quux" } });
  });

  test("should not merge object and array", () => {
    const a = { foo: ["qux"] };
    const b = { foo: { bar: "baz" } };

    expect(mergeDeep(a, b)).toStrictEqual({ foo: { bar: "baz" } });
  });

  test("should not merge array and object", () => {
    const a = { foo: { bar: "baz" } };
    const b = { foo: ["qux"] };

    expect(mergeDeep(a, b)).toStrictEqual({ foo: ["qux"] });
  });

  test("should not merge arrays", () => {
    const a = { foo: ["bar"] };
    const b = { foo: ["baz"] };

    expect(mergeDeep(a, b)).toStrictEqual({ foo: ["baz"] });
  });

  test("should merge different types", () => {
    const a = { foo: "bar" };
    const b = { foo: 123 };

    expect(mergeDeep(a, b)).toStrictEqual({ foo: 123 });
  });

  test("should work with weird object types, null", () => {
    const a = { foo: null };
    const b = { foo: 123 };

    expect(mergeDeep(a, b)).toStrictEqual({ foo: 123 });
    expect(mergeDeep(b, a)).toStrictEqual({ foo: null });
  });

  test("should work with weird object types, functions", () => {
    const a = { foo: doNothing() };
    const b = { foo: 123 };

    expect(mergeDeep(a, b)).toStrictEqual({ foo: 123 });
    expect(mergeDeep(b, a)).toStrictEqual({ foo: doNothing() });
  });

  test("should work with weird object types, date", () => {
    const a = { foo: new Date(1337) };
    const b = { foo: 123 };

    expect(mergeDeep(a, b)).toStrictEqual({ foo: 123 });
    expect(mergeDeep(b, a)).toStrictEqual({ foo: new Date(1337) });
  });

  test("doesn't spread arrays", () => {
    const a = { foo: ["bar"] };
    const b = { foo: ["baz"] };

    expect(mergeDeep(a, b)).toStrictEqual({ foo: ["baz"] });
  });

  test("doesn't recurse into arrays", () => {
    const a = { foo: [{ bar: "baz" }] };
    const b = { foo: [{ bar: "hello, world" }] };

    expect(mergeDeep(a, b)).toStrictEqual({ foo: [{ bar: "hello, world" }] });
  });
});

describe("runtime (dataLast)", () => {
  test("should merge objects", () => {
    const a = { foo: "baz", x: 1 };
    const b = { foo: "bar", y: 2 };

    expect(mergeDeep(b)(a)).toStrictEqual({ foo: "bar", x: 1, y: 2 });
  });
});
