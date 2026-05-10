import { describe, expectTypeOf, test } from "vitest";
import { filter } from "./filter";
import { hasKey } from "./hasKey";
import { pipe } from "./pipe";

describe("data-first", () => {
  test("returns boolean", () => {
    expectTypeOf(hasKey({ a: 1 }, "a")).toEqualTypeOf<boolean>();
  });

  test("removes optionality from a known optional property", () => {
    const data = {} as { a?: string; b: number };

    if (hasKey(data, "a")) {
      expectTypeOf(data).toEqualTypeOf<
        { a?: string; b: number } & Required<
          Pick<{ a?: string; b: number }, "a">
        >
      >();
    } else {
      expectTypeOf(data).toEqualTypeOf<{ a?: string; b: number }>();
    }
  });

  test("narrows a Record by intersecting with the explicit key", () => {
    const data = {} as Record<string, number>;

    if (hasKey(data, "foo")) {
      expectTypeOf(data).toEqualTypeOf<
        Record<string, number> & Required<Pick<Record<string, number>, "foo">>
      >();
    }
  });

  test("preserves readonly modifier", () => {
    const data = {} as { readonly a?: string };

    if (hasKey(data, "a")) {
      expectTypeOf(data).toEqualTypeOf<
        { readonly a?: string } & Required<Pick<{ readonly a?: string }, "a">>
      >();
    }
  });

  test("narrows symbol keys", () => {
    const symbol = Symbol("test");
    const data = {} as { [symbol]?: number };

    if (hasKey(data, symbol)) {
      expectTypeOf(data).toEqualTypeOf<
        { [symbol]?: number } & Required<
          Pick<{ [symbol]?: number }, typeof symbol>
        >
      >();
    }
  });

  test("narrows numeric keys", () => {
    const data = {} as { 0?: string };

    if (hasKey(data, 0)) {
      expectTypeOf(data).toEqualTypeOf<
        { 0?: string } & Required<Pick<{ 0?: string }, 0>>
      >();
    }
  });

  test("drops union members that don't have the key", () => {
    const data = {} as { a: number } | { b: string };

    if (hasKey(data, "a")) {
      // Distribution leaves only the {a: number} branch; SetRequired is a
      // no-op there because `a` is already required.
      expectTypeOf(data).toEqualTypeOf<{ a: number }>();
    }
  });

  test("removes optionality across union members that share the key", () => {
    const data = {} as { a?: number; tag: "x" } | { a?: string; tag: "y" };

    if (hasKey(data, "a")) {
      expectTypeOf(data).toEqualTypeOf<
        | ({ a?: number; tag: "x" } & Required<
            Pick<{ a?: number; tag: "x" }, "a">
          >)
        | ({ a?: string; tag: "y" } & Required<
            Pick<{ a?: string; tag: "y" }, "a">
          >)
      >();
    }
  });

  test("rejects keys that can't exist on the data", () => {
    const data = {} as { name: string };

    // @ts-expect-error [ts2345] - "naem" is a typo
    hasKey(data, "naem");
  });

  test("accepts arbitrary string keys when input is a broad Record", () => {
    const data = {} as Record<string, unknown>;

    // ok - any string is a possible key on a Record<string, ...>
    hasKey(data, "literally-anything");
  });

  test("rejects non-object data", () => {
    // @ts-expect-error [ts2345] - primitives are not allowed
    hasKey("not an object", "a");

    // @ts-expect-error [ts2345] - null is not assignable to object
    hasKey(null, "a");
  });
});

describe("data-last", () => {
  test("returns boolean in pipe", () => {
    expectTypeOf(pipe({ a: 1 }, hasKey("a"))).toEqualTypeOf<boolean>();
  });

  test("narrows union members under filter", () => {
    const data = [] as { a?: number; b?: number }[];

    expectTypeOf(filter(data, hasKey("a"))).toEqualTypeOf<
      ({ a?: number; b?: number } & Required<
        Pick<{ a?: number; b?: number }, "a">
      >)[]
    >();
  });

  test("rejects keys that can't exist on the piped data", () => {
    const data = {} as { name: string };

    // @ts-expect-error [ts2345] - "naem" is a typo
    pipe(data, hasKey("naem"));
  });

  test("accepts arbitrary string keys when piped data is a broad Record", () => {
    const data = {} as Record<string, unknown>;

    // ok
    pipe(data, hasKey("literally-anything"));
  });
});
