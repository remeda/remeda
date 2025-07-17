import { describe, expectTypeOf, test } from "vitest";
import { map } from "./map";
import { pipe } from "./pipe";
import { prop } from "./prop";
import { sortBy } from "./sortBy";

describe("data-last", () => {
  test("inferred directly", () => {
    expectTypeOf(sortBy([{ a: 1 }] as const, prop("a"))).toEqualTypeOf<
      [{ readonly a: 1 }]
    >();
  });

  test("inferred indirectly", () => {
    expectTypeOf(pipe([{ a: 1 }] as const, sortBy(prop("a")))).toEqualTypeOf<
      [{ readonly a: 1 }]
    >();
  });

  describe("as a factory function", () => {
    test("direct usage", () => {
      const propA = prop("a");

      expectTypeOf(propA({ a: 1 } as const)).toEqualTypeOf<1>();
    });

    test("indirect usage as a callback", () => {
      const propA = prop("a");

      expectTypeOf(map([{ a: 1 }, { a: 2 }] as const, propA)).toEqualTypeOf<
        [1 | 2, 1 | 2]
      >();
    });

    test("detects typos", () => {
      const propB = prop("b");

      // @ts-expect-error [ts2353] -- b is not a key of typeof item
      propB({ a: 1 });
    });
  });
});

describe("tuples", () => {
  test("fixed tuple", () => {
    expectTypeOf(prop([1, 2, 3] as const, 0)).toEqualTypeOf<1>();
  });

  test("simple array", () => {
    expectTypeOf(prop([] as Array<"cat">, 3)).toEqualTypeOf<
      "cat" | undefined
    >();
  });

  test("prefix array", () => {
    expectTypeOf(prop([1] as [number, ...Array<string>], 10)).toEqualTypeOf<
      string | undefined
    >();
  });
});

describe("unions", () => {
  test("shared prop name", () => {
    expectTypeOf(prop({} as { a: 1 } | { a: 2 }, "a")).toEqualTypeOf<1 | 2>();
  });

  test("disjoint prop name", () => {
    expectTypeOf(prop({} as { a: 1 } | { b: 2 }, "a")).toEqualTypeOf<
      1 | undefined
    >();
  });

  test("union of keys", () => {
    expectTypeOf(
      prop({ a: "hello", b: "world" } as const, "a" as "a" | "b"),
    ).toEqualTypeOf<"hello" | "world">();
  });

  test("union with shared and disjoin keys", () => {
    expectTypeOf(
      prop(
        {} as { a: "hello"; b: "world" } | { a: "hello"; c: "foo" },
        "a" as "a" | "b",
      ),
    ).toEqualTypeOf<"hello" | "world" | undefined>();
  });

  test("detects typos in union of objects", () => {
    // @ts-expect-error [ts2345] -- 'c' is not a key of the union type
    prop({} as { a: 1 } | { b: 2 }, "c");
  });

  test("detects typos in unions of keys", () => {
    // @ts-expect-error [ts2345] -- 'c' is not a key of the union type
    prop({ a: "hello", b: "world" } as const, "a" as "a" | "c");
  });

  test("union of arrays", () => {
    expectTypeOf(prop([] as Array<string> | Array<number>, 10)).toEqualTypeOf<
      string | number | undefined
    >();
  });

  test("arrays of unions", () => {
    expectTypeOf(prop([] as Array<"cat" | "dog">, 100)).toEqualTypeOf<
      "cat" | "dog" | undefined
    >();
  });

  test("union of tuples", () => {
    expectTypeOf(
      prop([1, "foo"] as [number, string] | [string, boolean], 1),
    ).toEqualTypeOf<string | boolean>();
  });

  test("union of array and object", () => {
    const data = { a: 1 } as { a: 1 } | ReadonlyArray<"cat">;

    expectTypeOf(prop(data, "a")).toEqualTypeOf<1 | undefined>();
    expectTypeOf(prop(data, 100)).toEqualTypeOf<"cat" | undefined>();
    expectTypeOf(prop(data, "a" as "a" | number)).toEqualTypeOf<
      1 | "cat" | undefined
    >();
  });
});
