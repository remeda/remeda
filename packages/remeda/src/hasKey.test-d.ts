import { describe, expectTypeOf, test } from "vitest";
import { hasKey } from "./hasKey";
import { pipe } from "./pipe";

describe("data-first", () => {
  test("returns boolean", () => {
    expectTypeOf(hasKey({ a: 1 }, "a")).toEqualTypeOf<boolean>();
  });

  test("acts as a type predicate for an optional property", () => {
    const data = {} as { a?: string };

    if (hasKey(data, "a")) {
      expectTypeOf(data).toEqualTypeOf<{ a?: string } & Record<"a", unknown>>();
    } else {
      expectTypeOf(data).toEqualTypeOf<{ a?: string }>();
    }
  });

  test("narrows missing keys with unknown", () => {
    const data = {} as { a: number };

    if (hasKey(data, "b")) {
      expectTypeOf(data).toEqualTypeOf<{ a: number } & Record<"b", unknown>>();
    }
  });

  test("narrows Record types", () => {
    const data = {} as Record<string, number>;

    if (hasKey(data, "foo")) {
      expectTypeOf(data).toEqualTypeOf<
        Record<string, number> & Record<"foo", unknown>
      >();
    }
  });

  test("preserves readonly modifier", () => {
    const data = {} as { readonly a?: string };

    if (hasKey(data, "a")) {
      expectTypeOf(data).toEqualTypeOf<
        { readonly a?: string } & Record<"a", unknown>
      >();
    }
  });

  test("narrows symbol keys", () => {
    const symbol = Symbol("test");
    const data = {} as { [symbol]?: number };

    if (hasKey(data, symbol)) {
      expectTypeOf(data).toEqualTypeOf<
        { [symbol]?: number } & Record<typeof symbol, unknown>
      >();
    }
  });

  test("narrows numeric keys", () => {
    const data = {} as { 0?: string };

    if (hasKey(data, 0)) {
      expectTypeOf(data).toEqualTypeOf<{ 0?: string } & Record<0, unknown>>();
    }
  });

  test("narrows union types naturally without special handling", () => {
    const data = {} as { a: number } | { b: string };

    if (hasKey(data, "a")) {
      // TypeScript distributes the predicate over the union: the `{ a: number }`
      // branch already satisfies the intersection so it's kept as-is, while the
      // `{ b: string }` branch is preserved with the `Record<"a", unknown>`
      // intersection still attached.
      expectTypeOf(data).toEqualTypeOf<
        { a: number } | ({ b: string } & Record<"a", unknown>)
      >();
    }
  });

  test("rejects non-object data", () => {
    // @ts-expect-error [ts2345] - primitives are not allowed
    hasKey("not an object", "a");

    // @ts-expect-error [ts2345] - null is not assignable to object
    hasKey(null, "a");
  });

  test("rejects non-PropertyKey keys", () => {
    // @ts-expect-error [ts2345] - boolean is not a PropertyKey
    hasKey({ a: 1 }, true);
  });
});

describe("data-last", () => {
  test("returns boolean", () => {
    expectTypeOf(pipe({ a: 1 }, hasKey("a"))).toEqualTypeOf<boolean>();
  });

  test("acts as a type predicate for an optional property", () => {
    const data = {} as { a?: string };

    if (hasKey("a")(data)) {
      expectTypeOf(data).toEqualTypeOf<{ a?: string } & Record<"a", unknown>>();
    } else {
      expectTypeOf(data).toEqualTypeOf<{ a?: string }>();
    }
  });

  test("narrows missing keys with unknown", () => {
    const data = {} as { a: number };

    if (hasKey("b")(data)) {
      expectTypeOf(data).toEqualTypeOf<{ a: number } & Record<"b", unknown>>();
    }
  });

  test("narrows Record types", () => {
    const data = {} as Record<string, number>;

    if (hasKey("foo")(data)) {
      expectTypeOf(data).toEqualTypeOf<
        Record<string, number> & Record<"foo", unknown>
      >();
    }
  });

  test("preserves readonly modifier", () => {
    const data = {} as { readonly a?: string };

    if (hasKey("a")(data)) {
      expectTypeOf(data).toEqualTypeOf<
        { readonly a?: string } & Record<"a", unknown>
      >();
    }
  });

  test("narrows union types naturally without special handling", () => {
    const data = {} as { a: number } | { b: string };

    if (hasKey("a")(data)) {
      expectTypeOf(data).toEqualTypeOf<
        { a: number } | ({ b: string } & Record<"a", unknown>)
      >();
    }
  });

  test("rejects non-PropertyKey keys", () => {
    // @ts-expect-error [ts2345] - boolean is not a PropertyKey
    hasKey(true);
  });
});
