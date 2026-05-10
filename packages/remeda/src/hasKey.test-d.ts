import { describe, expectTypeOf, test } from "vitest";
import { filter } from "./filter";
import { hasKey } from "./hasKey";
import { pipe } from "./pipe";

test("removes optionality from a known optional property", () => {
  const data = {} as { a?: string; b: number };

  if (hasKey(data, "a")) {
    expectTypeOf(data).toEqualTypeOf<
      { a?: string; b: number } & { b: number; a: string }
    >();
  } else {
    expectTypeOf(data).toEqualTypeOf<{ a?: string; b: number }>();
  }
});

test("does not narrow Record types beyond their index signature", () => {
  const data = {} as Record<string, number>;

  if (hasKey(data, "foo")) {
    expectTypeOf(data).toEqualTypeOf<Record<string, number>>();
  }
});

test("preserves readonly modifier", () => {
  const data = {} as { readonly a?: string };

  if (hasKey(data, "a")) {
    expectTypeOf(data).toEqualTypeOf<
      { readonly a?: string } & { readonly a: string }
    >();
  }
});

test("narrows symbol keys", () => {
  const symbol = Symbol("test");
  const data = {} as { [symbol]?: number };

  if (hasKey(data, symbol)) {
    expectTypeOf(data).toEqualTypeOf<
      { [symbol]?: number } & { [symbol]: number }
    >();
  }
});

test("drops union members that don't have the key", () => {
  const data = {} as { a: number } | { b: string };

  if (hasKey(data, "a")) {
    expectTypeOf(data).toEqualTypeOf<{ a: number }>();
  } else {
    expectTypeOf(data).toEqualTypeOf<{ b: string }>();
  }
});

test("removes optionality across union members that share the key", () => {
  const data = {} as { a?: number; tag: "x" } | { a?: string; tag: "y" };

  if (hasKey(data, "a")) {
    expectTypeOf(data).toEqualTypeOf<
      | ({ a?: number; tag: "x" } & { tag: "x"; a: number })
      | ({ a?: string; tag: "y" } & { tag: "y"; a: string })
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

describe("data-last", () => {
  test("narrows union members under filter", () => {
    const data = [] as { a?: number; b?: number }[];

    expectTypeOf(filter(data, hasKey("a"))).toEqualTypeOf<
      ({ a?: number; b?: number } & { b?: number; a: number })[]
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
