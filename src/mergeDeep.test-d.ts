import { mergeDeep } from "./mergeDeep";

it("trivially merges disjoint objects", () => {
  const result = mergeDeep(
    { foo: "bar" } as { foo: string },
    { bar: "baz" } as { bar: string },
  );

  expectTypeOf(result).toEqualTypeOf<{ foo: string; bar: string }>();
});

it("merges fully overlapping types", () => {
  const result = mergeDeep(
    { foo: "bar" } as { foo: string },
    { foo: "baz" } as { foo: string },
  );

  expectTypeOf(result).toEqualTypeOf<{ foo: string }>();
});

it("merges semi-overlapping types", () => {
  const result = mergeDeep(
    { foo: "bar", x: 1 } as { foo: string; x: number },
    { foo: "baz", y: 2 } as { foo: string; y: number },
  );

  expectTypeOf(result).toEqualTypeOf<{ foo: string; x: number; y: number }>();
});

it("deeply merges", () => {
  const result = mergeDeep(
    { foo: { bar: "bar" } } as { foo: { bar: string } },
    { foo: { qux: "qux" } } as { foo: { qux: string } },
  );

  expectTypeOf(result).toEqualTypeOf<{ foo: { bar: string; qux: string } }>();
});

it("overrides types", () => {
  const a = { foo: { bar: "baz" } } as { foo: { bar: string } };
  const b = { foo: "qux" } as { foo: string };

  const resultAB = mergeDeep(a, b);

  expectTypeOf(resultAB).toEqualTypeOf<{ foo: string }>();

  const resultBA = mergeDeep(b, a);

  expectTypeOf(resultBA).toEqualTypeOf<{ foo: { bar: string } }>();
});

it("doesn't spread arrays", () => {
  const result = mergeDeep(
    { foo: ["bar"] } as const,
    { foo: ["baz"] } as const,
  );

  expectTypeOf(result).toEqualTypeOf<{ readonly foo: readonly ["baz"] }>();
});

it("doesn't recurse into arrays", () => {
  const result = mergeDeep(
    { foo: [{ bar: "baz", x: 123 }] } as {
      foo: Array<{ bar: string; x: number }>;
    },
    { foo: [{ bar: "hello, world", y: 456 }] } as {
      foo: Array<{ bar: string; y: number }>;
    },
  );

  expectTypeOf(result).toEqualTypeOf<{
    foo: Array<{ bar: string; y: number }>;
  }>();
});

it("works with interfaces", () => {
  interface Foo {
    a: string;
    b: number;
  }

  interface Bar {
    a: string;
    c: boolean;
  }

  const result = mergeDeep(
    { a: "foo", b: 123 } as Foo,
    { a: "bar", c: true } as Bar,
  );

  expectTypeOf(result).toEqualTypeOf<{ a: string; b: number; c: boolean }>();
});
