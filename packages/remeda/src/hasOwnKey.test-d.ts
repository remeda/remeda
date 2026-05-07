import { describe, expectTypeOf, test } from "vitest";
import { hasOwnKey } from "./hasOwnKey";
import { pipe } from "./pipe";

describe("data-first", () => {
  test("returns boolean", () => {
    expectTypeOf(hasOwnKey({ a: 1 }, "a")).toEqualTypeOf<boolean>();
  });

  test("acts as a type predicate for an optional property", () => {
    const data = {} as { a?: string };

    if (hasOwnKey(data, "a")) {
      expectTypeOf(data).toEqualTypeOf<{ a?: string } & Record<"a", unknown>>();
    } else {
      expectTypeOf(data).toEqualTypeOf<{ a?: string }>();
    }
  });

  test("narrows missing keys with unknown", () => {
    const data = {} as { a: number };

    if (hasOwnKey(data, "b")) {
      expectTypeOf(data).toEqualTypeOf<{ a: number } & Record<"b", unknown>>();
    }
  });

  test("narrows Record types", () => {
    const data = {} as Record<string, number>;

    if (hasOwnKey(data, "foo")) {
      expectTypeOf(data).toEqualTypeOf<
        Record<string, number> & Record<"foo", unknown>
      >();
    }
  });

  test("preserves readonly modifier", () => {
    const data = {} as { readonly a?: string };

    if (hasOwnKey(data, "a")) {
      expectTypeOf(data).toEqualTypeOf<
        { readonly a?: string } & Record<"a", unknown>
      >();
    }
  });

  test("narrows symbol keys", () => {
    const symbol = Symbol("test");
    const data = {} as { [symbol]?: number };

    if (hasOwnKey(data, symbol)) {
      expectTypeOf(data).toEqualTypeOf<
        { [symbol]?: number } & Record<typeof symbol, unknown>
      >();
    }
  });

  test("narrows numeric keys", () => {
    const data = {} as { 0?: string };

    if (hasOwnKey(data, 0)) {
      expectTypeOf(data).toEqualTypeOf<{ 0?: string } & Record<0, unknown>>();
    }
  });

  test("narrows union types naturally without special handling", () => {
    const data = {} as { a: number } | { b: string };

    if (hasOwnKey(data, "a")) {
      expectTypeOf(data).toEqualTypeOf<
        { a: number } | ({ b: string } & Record<"a", unknown>)
      >();
    }
  });

  test("rejects non-object data", () => {
    // @ts-expect-error [ts2345] - primitives are not allowed
    hasOwnKey("not an object", "a");

    // @ts-expect-error [ts2345] - null is not assignable to object
    hasOwnKey(null, "a");
  });

  test("rejects non-PropertyKey keys", () => {
    // @ts-expect-error [ts2345] - boolean is not a PropertyKey
    hasOwnKey({ a: 1 }, true);
  });
});

describe("data-last", () => {
  test("returns boolean", () => {
    expectTypeOf(pipe({ a: 1 }, hasOwnKey("a"))).toEqualTypeOf<boolean>();
  });

  test("acts as a type predicate for an optional property", () => {
    const data = {} as { a?: string };

    if (hasOwnKey("a")(data)) {
      expectTypeOf(data).toEqualTypeOf<{ a?: string } & Record<"a", unknown>>();
    } else {
      expectTypeOf(data).toEqualTypeOf<{ a?: string }>();
    }
  });

  test("narrows missing keys with unknown", () => {
    const data = {} as { a: number };

    if (hasOwnKey("b")(data)) {
      expectTypeOf(data).toEqualTypeOf<{ a: number } & Record<"b", unknown>>();
    }
  });

  test("narrows Record types", () => {
    const data = {} as Record<string, number>;

    if (hasOwnKey("foo")(data)) {
      expectTypeOf(data).toEqualTypeOf<
        Record<string, number> & Record<"foo", unknown>
      >();
    }
  });

  test("preserves readonly modifier", () => {
    const data = {} as { readonly a?: string };

    if (hasOwnKey("a")(data)) {
      expectTypeOf(data).toEqualTypeOf<
        { readonly a?: string } & Record<"a", unknown>
      >();
    }
  });

  test("narrows union types naturally without special handling", () => {
    const data = {} as { a: number } | { b: string };

    if (hasOwnKey("a")(data)) {
      expectTypeOf(data).toEqualTypeOf<
        { a: number } | ({ b: string } & Record<"a", unknown>)
      >();
    }
  });

  test("rejects non-PropertyKey keys", () => {
    // @ts-expect-error [ts2345] - boolean is not a PropertyKey
    hasOwnKey(true);
  });
});
