import { mergeDeep } from "./mergeDeep";

const NOOP = () => {
  /* do nothing */
};

describe("runtime (dataFirst)", () => {
  test("should merge objects", () => {
    const a = { foo: "baz", x: 1 };
    const b = { foo: "bar", y: 2 };
    expect(mergeDeep(a, b)).toEqual({ foo: "bar", x: 1, y: 2 });
  });

  test("should merge nested objects", () => {
    const a = { foo: { bar: "baz" } };
    const b = { foo: { qux: "quux" } };
    expect(mergeDeep(a, b)).toEqual({ foo: { bar: "baz", qux: "quux" } });
  });

  test("should not merge object and array", () => {
    const a = { foo: ["qux"] };
    const b = { foo: { bar: "baz" } };
    expect(mergeDeep(a, b)).toEqual({ foo: { bar: "baz" } });
  });

  test("should not merge array and object", () => {
    const a = { foo: { bar: "baz" } };
    const b = { foo: ["qux"] };
    expect(mergeDeep(a, b)).toEqual({ foo: ["qux"] });
  });

  it("should not merge arrays", () => {
    const a = { foo: ["bar"] };
    const b = { foo: ["baz"] };
    expect(mergeDeep(a, b)).toEqual({ foo: ["baz"] });
  });

  it("should merge different types", () => {
    const a = { foo: "bar" };
    const b = { foo: 123 };
    expect(mergeDeep(a, b)).toEqual({ foo: 123 });
  });

  it("should work with weird object types, null", () => {
    const a = { foo: null };
    const b = { foo: 123 };
    expect(mergeDeep(a, b)).toEqual({ foo: 123 });
    expect(mergeDeep(b, a)).toEqual({ foo: null });
  });

  it("should work with weird object types, functions", () => {
    const a = { foo: NOOP };
    const b = { foo: 123 };
    expect(mergeDeep(a, b)).toEqual({ foo: 123 });
    expect(mergeDeep(b, a)).toEqual({ foo: NOOP });
  });

  it("should work with weird object types, date", () => {
    const a = { foo: new Date(1337) };
    const b = { foo: 123 };
    expect(mergeDeep(a, b)).toEqual({ foo: 123 });
    expect(mergeDeep(b, a)).toEqual({ foo: new Date(1337) });
  });

  it("doesn't spread arrays", () => {
    const a = { foo: ["bar"] };
    const b = { foo: ["baz"] };
    expect(mergeDeep(a, b)).toEqual({ foo: ["baz"] });
  });

  it("doesn't recurse into arrays", () => {
    const a = { foo: [{ bar: "baz" }] };
    const b = { foo: [{ bar: "hello, world" }] };
    expect(mergeDeep(a, b)).toEqual({ foo: [{ bar: "hello, world" }] });
  });
});

describe("runtime (dataLast)", () => {
  test("should merge objects", () => {
    const a = { foo: "baz", x: 1 };
    const b = { foo: "bar", y: 2 };
    expect(mergeDeep(b)(a)).toEqual({ foo: "bar", x: 1, y: 2 });
  });
});

describe("typing", () => {
  it("trivially merges disjoint objects", () => {
    const a = { foo: "bar" };
    const b = { bar: "baz" };
    const result = mergeDeep(a, b);
    expectTypeOf(result).toEqualTypeOf<{ foo: string; bar: string }>();
  });

  it("merges fully overlapping types", () => {
    const a = { foo: "bar" };
    const b = { foo: "baz" };
    const result = mergeDeep(a, b);
    expectTypeOf(result).toEqualTypeOf<{ foo: string }>();
  });

  it("merges semi-overlapping types", () => {
    const a = { foo: "bar", x: 1 };
    const b = { foo: "baz", y: 2 };
    const result = mergeDeep(a, b);
    expectTypeOf(result).toEqualTypeOf<{ foo: string; x: number; y: number }>();
  });

  it("deeply merges", () => {
    const a = { foo: { bar: "baz" } };
    const b = { foo: { qux: "quux" } };
    const result = mergeDeep(a, b);
    expectTypeOf(result).toEqualTypeOf<{ foo: { bar: string; qux: string } }>();
  });

  it("overrides types", () => {
    const a = { foo: { bar: "baz" } };
    const b = { foo: "qux" };
    expectTypeOf(mergeDeep(a, b)).toEqualTypeOf<typeof b>();
    expectTypeOf(mergeDeep(b, a)).toEqualTypeOf<typeof a>();
  });

  it("doesn't spread arrays", () => {
    const a = { foo: ["bar"] as const };
    const b = { foo: ["baz"] as const };
    const result = mergeDeep(a, b);
    expectTypeOf(result).toEqualTypeOf<{ foo: readonly ["baz"] }>();
  });

  it("doesn't recurse into arrays", () => {
    const a = { foo: [{ bar: "baz" }] };
    const b = { foo: [{ bar: "hello, world" }] };
    expectTypeOf(mergeDeep(a, b)).toEqualTypeOf<typeof b>();
  });
});
