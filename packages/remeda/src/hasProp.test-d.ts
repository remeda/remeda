import { describe, expectTypeOf, test } from "vitest";
import { filter } from "./filter";
import { hasProp } from "./hasProp";
import { pipe } from "./pipe";

test("narrowing is a no-op when the key is already required", () => {
  const data = {} as { a: string };

  if (hasProp(data, "a")) {
    expectTypeOf(data).toEqualTypeOf<{ a: string }>();
  } else {
    expectTypeOf(data).toEqualTypeOf<never>();
  }
});

test("accepts a union of literal keys", () => {
  const data = {} as { a?: string; b?: number };
  const key = "a" as "a" | "b";

  if (hasProp(data, key)) {
    expectTypeOf(data).toEqualTypeOf<
      { a: string; b?: number } | { a?: string; b: number }
    >();
  } else {
    expectTypeOf(data).toEqualTypeOf<{ a?: string; b?: number }>();
  }
});

test("falls back to boolean for unbounded primitive string keys", () => {
  const data = {} as Record<string, number>;
  const key = "foo" as string;

  // The non-narrowing overload kicks in, so neither branch collapses to
  // `never` — the predicate behaves like a plain boolean check.
  if (hasProp(data, key)) {
    expectTypeOf(data).toEqualTypeOf<Record<string, number>>();
  } else {
    expectTypeOf(data).toEqualTypeOf<Record<string, number>>();
  }
});

test("falls back to boolean for unbounded template-literal keys", () => {
  const data = {} as Record<string, number>;
  const key = "prefix_x" as `prefix_${string}`;

  if (hasProp(data, key)) {
    expectTypeOf(data).toEqualTypeOf<Record<string, number>>();
  } else {
    expectTypeOf(data).toEqualTypeOf<Record<string, number>>();
  }
});

test("falls back to boolean for array inputs", () => {
  const data = [] as number[];

  // Arrays route to the non-narrowing overload — neither branch collapses
  // to `never`. Use `hasAtLeast` to narrow array indices and `isArray` to
  // discriminate array vs. object unions.
  if (hasProp(data, 1)) {
    expectTypeOf(data).toEqualTypeOf<number[]>();
  } else {
    expectTypeOf(data).toEqualTypeOf<number[]>();
  }
});

test("narrows interfaces", () => {
  interface AB {
    a: number;
    b?: string;
  }
  const data = {} as AB;

  if (hasProp(data, "b")) {
    expectTypeOf(data).toEqualTypeOf<{ a: number; b: string }>();
  } else {
    expectTypeOf(data).toEqualTypeOf<AB>();
  }
});

test("preserves an explicit `undefined` in the value type", () => {
  const data = {} as { a?: string | undefined };

  if (hasProp(data, "a")) {
    expectTypeOf(data).toEqualTypeOf<{ a: string | undefined }>();
  } else {
    expectTypeOf(data).toEqualTypeOf<{ a?: string | undefined }>();
  }
});

test("removes optionality from a known optional property", () => {
  const data = {} as { a?: string; b: number };

  if (hasProp(data, "a")) {
    expectTypeOf(data).toEqualTypeOf<{ a: string; b: number }>();
  } else {
    expectTypeOf(data).toEqualTypeOf<{ a?: string; b: number }>();
  }
});

test("narrows a Record by surfacing the explicit key", () => {
  const data = {} as Record<string, number>;

  if (hasProp(data, "foo")) {
    expectTypeOf(data).toEqualTypeOf<{
      [x: string]: number;
      foo: number;
    }>();
  } else {
    expectTypeOf(data).toEqualTypeOf<Record<string, number>>();
  }
});

test("preserves readonly modifier", () => {
  const data = {} as { readonly a?: string };

  if (hasProp(data, "a")) {
    expectTypeOf(data).toEqualTypeOf<{ readonly a: string }>();
  } else {
    expectTypeOf(data).toEqualTypeOf<{ readonly a?: string }>();
  }
});

test("narrows symbol keys", () => {
  const symbol = Symbol("test");
  const data = {} as { [symbol]?: number };

  if (hasProp(data, symbol)) {
    expectTypeOf(data).toEqualTypeOf<{ [symbol]: number }>();
  } else {
    expectTypeOf(data).toEqualTypeOf<{ [symbol]?: number }>();
  }
});

test("narrows number keys", () => {
  const data = {} as { 0?: string };

  if (hasProp(data, 0)) {
    expectTypeOf(data).toEqualTypeOf<{ 0: string }>();
  } else {
    expectTypeOf(data).toEqualTypeOf<{ 0?: string }>();
  }
});

test("drops union members that don't have the key", () => {
  const data = {} as { a: number } | { b: string };

  if (hasProp(data, "a")) {
    expectTypeOf(data).toEqualTypeOf<{ a: number }>();
  } else {
    expectTypeOf(data).toEqualTypeOf<{ b: string }>();
  }
});

test("removes optionality across union members that share the key", () => {
  const data = {} as { a?: number; tag: "x" } | { a?: string; tag: "y" };

  if (hasProp(data, "a")) {
    expectTypeOf(data).toEqualTypeOf<
      { a: number; tag: "x" } | { a: string; tag: "y" }
    >();
  } else {
    expectTypeOf(data).toEqualTypeOf<
      { a?: number; tag: "x" } | { a?: string; tag: "y" }
    >();
  }
});

test("rejects keys that can't exist on the data", () => {
  hasProp(
    {} as { name: string },
    // @ts-expect-error [ts2345] - "naem" is a typo
    "naem",
  );
});

describe("known limitations", () => {
  // The narrowing overload still fires for built-in types whose `keyof`
  // includes prototype methods (Map, Set, Date, RegExp, custom classes).
  // At the type level the method appears as an own property; at runtime
  // `Object.hasOwn` returns `false`. TypeScript can't distinguish own from
  // inherited properties (microsoft/TypeScript#58877 — closed as "not
  // planned"). Arrays are special-cased away via the `T extends readonly
  // unknown[]` filter; the cases below are accepted as known limitations.

  test("map: prototype methods narrow the else branch to never", () => {
    const data = new Map<string, number>();

    if (hasProp(data, "get")) {
      expectTypeOf(data).toEqualTypeOf<Map<string, number>>();
    } else {
      expectTypeOf(data).toEqualTypeOf<never>();
    }
  });

  test("set: prototype methods narrow the else branch to never", () => {
    const data = new Set<number>();

    if (hasProp(data, "has")) {
      expectTypeOf(data).toEqualTypeOf<Set<number>>();
    } else {
      expectTypeOf(data).toEqualTypeOf<never>();
    }
  });
});

describe("data-last", () => {
  test("narrows union members under filter", () => {
    const data = [] as { a?: number; b?: number }[];

    expectTypeOf(filter(data, hasProp("a"))).toEqualTypeOf<
      { a: number; b?: number }[]
    >();
  });

  test("rejects keys that can't exist on the piped data", () => {
    // @ts-expect-error [ts2345] - "naem" is a typo
    pipe({} as { name: string }, hasProp("naem"));
  });

  test("narrows the array element when filtering a broad Record", () => {
    const data = [] as Record<string, unknown>[];

    expectTypeOf(filter(data, hasProp("foo"))).toEqualTypeOf<
      { [x: string]: unknown; foo: unknown }[]
    >();
  });
});
