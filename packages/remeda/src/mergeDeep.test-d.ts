import { expectTypeOf, test } from "vitest";
import { $typed } from "../test/$typed";
import { mergeDeep } from "./mergeDeep";

test("trivially merges disjoint objects", () => {
  const result = mergeDeep({ foo: "bar" }, { bar: "baz" });

  expectTypeOf(result).toEqualTypeOf<{ foo: string; bar: string }>();
});

test("merges fully overlapping types", () => {
  const result = mergeDeep({ foo: "bar" }, { foo: "baz" });

  expectTypeOf(result).toEqualTypeOf<{ foo: string }>();
});

test("merges semi-overlapping types", () => {
  const result = mergeDeep({ foo: "bar", x: 1 }, { foo: "baz", y: 2 });

  expectTypeOf(result).toEqualTypeOf<{ foo: string; x: number; y: number }>();
});

test("deeply merges", () => {
  const result = mergeDeep({ foo: { bar: "bar" } }, { foo: { qux: "qux" } });

  expectTypeOf(result).toEqualTypeOf<{ foo: { bar: string; qux: string } }>();
});

test("overrides types", () => {
  const a = { foo: { bar: "baz" } };
  const b = { foo: "qux" };

  const resultAB = mergeDeep(a, b);

  expectTypeOf(resultAB).toEqualTypeOf<{ foo: string }>();

  const resultBA = mergeDeep(b, a);

  expectTypeOf(resultBA).toEqualTypeOf<{ foo: { bar: string } }>();
});

test("doesn't spread arrays", () => {
  const result = mergeDeep(
    { foo: ["bar"] } as const,
    { foo: ["baz"] } as const,
  );

  expectTypeOf(result).toEqualTypeOf<{ readonly foo: readonly ["baz"] }>();
});

test("doesn't recurse into arrays", () => {
  const result = mergeDeep(
    { foo: [{ bar: "baz", x: 123 }] },
    { foo: [{ bar: "hello, world", y: 456 }] },
  );

  expectTypeOf(result).toEqualTypeOf<{
    foo: { bar: string; y: number }[];
  }>();
});

test("works with interfaces", () => {
  interface Foo {
    a: string;
    b: number;
  }

  interface Bar {
    a: string;
    c: boolean;
  }

  const result = mergeDeep($typed<Foo>(), $typed<Bar>());

  expectTypeOf(result).toEqualTypeOf<{ a: string; b: number; c: boolean }>();
});
