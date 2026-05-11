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

test("accepts a primitive string key", () => {
  const data = {} as Record<string, number>;
  const key = "foo" as string;

  if (hasProp(data, key)) {
    expectTypeOf(data).toEqualTypeOf<Record<string, number>>();
  } else {
    // The predicate type equals the input type, so TS proves the else
    // branch is unreachable and narrows to `never`.
    expectTypeOf(data).toEqualTypeOf<never>();
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
