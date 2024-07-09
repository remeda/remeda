import { mergeDeep } from "./mergeDeep";

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
