import type { Tagged } from "type-fest";
import { describe, expectTypeOf, test } from "vitest";
import { $typed } from "../../../test/$typed";
import type { CommonSubtype } from "./CommonSubtype";

interface Cat {
  readonly type: "cat";
  readonly legs: number;
}

interface Named {
  readonly name: string;
  readonly age: number;
}

interface Legged {
  readonly legs: number;
  readonly tail: boolean;
}

class CatClass {
  declare public readonly type: "cat";
  declare public readonly legs: number;
}

class NamedClass {
  declare public readonly name: string;
  declare public readonly age: number;
}

class LeggedClass {
  declare public readonly legs: number;
  declare public readonly tail: boolean;
}

declare function commonSubtype<const T0, const T1>(
  t0: T0,
  t1: T1,
): CommonSubtype<T0, T1>;

test("identical types", () => {
  expectTypeOf(
    commonSubtype($typed<string>(), $typed<string>()),
  ).toEqualTypeOf<string>();
});

describe("one type extends the other", () => {
  test("first is narrower", () => {
    expectTypeOf(commonSubtype("a", $typed<string>())).toEqualTypeOf<"a">();
  });

  test("second is narrower", () => {
    expectTypeOf(commonSubtype($typed<string>(), "a")).toEqualTypeOf<"a">();
  });
});

describe("incomparable types", () => {
  test("primitives", () => {
    expectTypeOf(
      commonSubtype($typed<string>(), $typed<number>()),
    ).toEqualTypeOf<never>();
  });

  test("disjoint literals", () => {
    expectTypeOf(commonSubtype("a", "b")).toEqualTypeOf<never>();
  });

  test("primitive and object", () => {
    expectTypeOf(
      commonSubtype($typed<string>(), $typed<Cat>()),
    ).toEqualTypeOf<never>();
  });

  test("functions", () => {
    expectTypeOf(
      commonSubtype($typed<() => string>(), $typed<() => number>()),
    ).toEqualTypeOf<never>();
  });

  test("branded strings", () => {
    expectTypeOf(
      commonSubtype(
        $typed<Tagged<string, "a">>(),
        $typed<Tagged<string, "b">>(),
      ),
    ).toEqualTypeOf<Tagged<string, "a"> & Tagged<string, "b">>();
  });

  test("branded string and an object sharing a prop", () => {
    expectTypeOf(
      commonSubtype(
        $typed<Tagged<string, "a">>(),
        $typed<{ readonly length: 3 }>(),
      ),
    ).toEqualTypeOf<never>();
  });
});

describe("template literals", () => {
  test("literal extends the template", () => {
    expectTypeOf(
      commonSubtype("abc", $typed<`a${string}`>()),
    ).toEqualTypeOf<"abc">();
  });

  test("literal disjoint from the template", () => {
    expectTypeOf(
      commonSubtype("foo", $typed<`bar${string}`>()),
    ).toEqualTypeOf<never>();
  });

  test("overlapping templates", () => {
    expectTypeOf(
      commonSubtype($typed<`a${string}`>(), $typed<`${string}b`>()),
    ).toEqualTypeOf<`a${string}` & `${string}b`>();
  });

  test("disjoint templates", () => {
    expectTypeOf(
      commonSubtype($typed<`foo_${number}`>(), $typed<`hello${string}`>()),
    ).toEqualTypeOf<`foo_${number}` & `hello${string}`>();
  });
});

describe("unions", () => {
  test("union on the first type", () => {
    expectTypeOf(commonSubtype($typed<"a" | "b">(), "a")).toEqualTypeOf<"a">();
  });

  test("union on the second type", () => {
    expectTypeOf(commonSubtype("a", $typed<"a" | "b">())).toEqualTypeOf<"a">();
  });

  test("overlapping unions", () => {
    expectTypeOf(
      commonSubtype($typed<"a" | "b">(), $typed<"b" | "c">()),
    ).toEqualTypeOf<"b">();
  });

  test("disjoint unions", () => {
    expectTypeOf(
      commonSubtype($typed<"a" | "b">(), $typed<"c" | "d">()),
    ).toEqualTypeOf<never>();
  });

  test("union wider than the other type", () => {
    expectTypeOf(
      commonSubtype($typed<string>(), $typed<"a" | "b">()),
    ).toEqualTypeOf<"a" | "b">();
  });

  test("boolean distributes as a union of its literals", () => {
    expectTypeOf(commonSubtype($typed<boolean>(), true)).toEqualTypeOf<true>();
  });

  test("union of objects on the first type", () => {
    expectTypeOf(
      commonSubtype(
        $typed<{ readonly a: string } | { readonly b: number }>(),
        $typed<{ readonly a: string }>(),
      ),
    ).toEqualTypeOf<
      { readonly a: string } | ({ readonly b: number } & { readonly a: string })
    >();
  });

  test("union of objects on the second type", () => {
    expectTypeOf(
      commonSubtype(
        $typed<{ readonly a: string }>(),
        $typed<{ readonly a: string } | { readonly b: number }>(),
      ),
    ).toEqualTypeOf<{ readonly a: string }>();
  });
});

describe("top and bottom types", () => {
  test("any as the first type", () => {
    expectTypeOf(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Testing how the type reacts to `any` is the point of this test.
      commonSubtype($typed<any>(), $typed<string>()),
    ).toEqualTypeOf<string>();
  });

  test("any as the second type", () => {
    expectTypeOf(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Testing how the type reacts to `any` is the point of this test.
      commonSubtype($typed<string>(), $typed<any>()),
    ).toEqualTypeOf<string>();
  });

  test("any as both types", () => {
    expectTypeOf(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Testing how the type reacts to `any` is the point of this test.
      commonSubtype($typed<any>(), $typed<any>()),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Testing how the type reacts to `any` is the point of this test.
    ).toEqualTypeOf<any>();
  });

  test("unknown as the first type", () => {
    expectTypeOf(
      commonSubtype($typed<unknown>(), $typed<string>()),
    ).toEqualTypeOf<string>();
  });

  test("unknown as the second type", () => {
    expectTypeOf(
      commonSubtype($typed<string>(), $typed<unknown>()),
    ).toEqualTypeOf<string>();
  });

  test("never as the first type", () => {
    expectTypeOf(
      commonSubtype($typed(), $typed<string>()),
    ).toEqualTypeOf<never>();
  });

  test("never as the second type", () => {
    expectTypeOf(
      commonSubtype($typed<string>(), $typed()),
    ).toEqualTypeOf<never>();
  });
});

describe("objects", () => {
  test("one object extends the other", () => {
    expectTypeOf(
      commonSubtype(
        $typed<{ readonly a: string; readonly b: number }>(),
        $typed<{ readonly a: string }>(),
      ),
    ).toEqualTypeOf<{ readonly a: string; readonly b: number }>();
  });

  test("incomparable objects with common props", () => {
    expectTypeOf(
      commonSubtype(
        $typed<{ readonly a: string; readonly b: number }>(),
        $typed<{ readonly a: string; readonly c: boolean }>(),
      ),
    ).toEqualTypeOf<
      {
        readonly a: string;
        readonly b: number;
      } & {
        readonly a: string;
        readonly c: boolean;
      }
    >();
  });

  test("incomparable objects without common props", () => {
    expectTypeOf(
      commonSubtype(
        $typed<{ readonly a: string }>(),
        $typed<{ readonly b: number }>(),
      ),
    ).toEqualTypeOf<{ readonly a: string } & { readonly b: number }>();
  });

  test("incomparable objects with a conflicting common prop", () => {
    expectTypeOf(
      commonSubtype(
        $typed<{ readonly a: string; readonly b: number }>(),
        $typed<{ readonly a: number; readonly c: boolean }>(),
      ),
    ).toEqualTypeOf<
      {
        readonly a: string;
        readonly b: number;
      } & {
        readonly a: number;
        readonly c: boolean;
      }
    >();
  });

  test("index-signature type and an interface", () => {
    expectTypeOf(
      commonSubtype($typed<Record<string, unknown>>(), $typed<Cat>()),
    ).toEqualTypeOf<Record<string, unknown> & Cat>();
  });

  test("incomparable interfaces without common props", () => {
    expectTypeOf(commonSubtype($typed<Cat>(), $typed<Named>())).toEqualTypeOf<
      Cat & Named
    >();
  });

  test("incomparable interfaces with common props", () => {
    expectTypeOf(commonSubtype($typed<Cat>(), $typed<Legged>())).toEqualTypeOf<
      Cat & Legged
    >();
  });

  test("incomparable classes without common props", () => {
    expectTypeOf(
      commonSubtype($typed<CatClass>(), $typed<NamedClass>()),
    ).toEqualTypeOf<CatClass & NamedClass>();
  });

  test("incomparable classes with common props", () => {
    expectTypeOf(
      commonSubtype($typed<CatClass>(), $typed<LeggedClass>()),
    ).toEqualTypeOf<CatClass & LeggedClass>();
  });
});

describe("arrays", () => {
  test("one array extends the other", () => {
    expectTypeOf(
      commonSubtype($typed<string[]>(), $typed<(string | number)[]>()),
    ).toEqualTypeOf<string[]>();
  });

  test("incomparable arrays", () => {
    expectTypeOf(
      commonSubtype($typed<string[]>(), $typed<number[]>()),
    ).toEqualTypeOf<never>();
  });

  // Arrays share props with object types (e.g. `length`) but the intersection
  // fallback intentionally skips them.
  test("array and an incomparable object sharing a prop", () => {
    expectTypeOf(
      commonSubtype($typed<string[]>(), $typed<{ readonly length: 3 }>()),
    ).toEqualTypeOf<never>();
  });

  test("tuples of different lengths", () => {
    expectTypeOf(
      commonSubtype($typed<[string, number]>(), $typed<[string]>()),
    ).toEqualTypeOf<never>();
  });

  test("mutable array extends the readonly array", () => {
    expectTypeOf(
      commonSubtype($typed<string[]>(), $typed<readonly string[]>()),
    ).toEqualTypeOf<string[]>();
  });

  test("mutable tuple extends the readonly tuple", () => {
    expectTypeOf(
      commonSubtype($typed<[string]>(), $typed<readonly [string]>()),
    ).toEqualTypeOf<[string]>();
  });
});

describe("argument order doesn't matter", () => {
  test("incomparable objects with common props", () => {
    expectTypeOf(
      commonSubtype(
        $typed<{ readonly a: string; readonly c: boolean }>(),
        $typed<{ readonly a: string; readonly b: number }>(),
      ),
    ).toEqualTypeOf<
      {
        readonly a: string;
        readonly c: boolean;
      } & {
        readonly a: string;
        readonly b: number;
      }
    >();
  });

  test("array and an incomparable object sharing a prop", () => {
    expectTypeOf(
      commonSubtype($typed<{ readonly length: 3 }>(), $typed<string[]>()),
    ).toEqualTypeOf<never>();
  });

  test("branded string and an object sharing a prop", () => {
    expectTypeOf(
      commonSubtype(
        $typed<{ readonly length: 3 }>(),
        $typed<Tagged<string, "a">>(),
      ),
    ).toEqualTypeOf<never>();
  });

  test("index-signature type and an interface", () => {
    expectTypeOf(
      commonSubtype($typed<Cat>(), $typed<Record<string, unknown>>()),
    ).toEqualTypeOf<Cat & Record<string, unknown>>();
  });
});
