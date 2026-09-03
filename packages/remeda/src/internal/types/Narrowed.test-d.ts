import type { Tagged } from "type-fest";
import { describe, expectTypeOf, test } from "vitest";
import { $typed } from "../../../test/$typed";
import type { CatClass, LeggedClass, NamedClass } from "../../../test/classes";
import type { Cat, Legged, Named } from "../../../test/interfaces";
import type { Narrowed } from "./Narrowed";

declare function narrowed<const T0, const T1>(t0: T0, t1: T1): Narrowed<T0, T1>;

test("identical types", () => {
  expectTypeOf(
    narrowed($typed<string>(), $typed<string>()),
  ).toEqualTypeOf<string>();
});

describe("one type extends the other", () => {
  test("first is narrower", () => {
    expectTypeOf(narrowed("a", $typed<string>())).toEqualTypeOf<"a">();
  });

  test("second is narrower", () => {
    expectTypeOf(narrowed($typed<string>(), "a")).toEqualTypeOf<"a">();
  });

  test("interface narrower than a type literal", () => {
    expectTypeOf(
      narrowed($typed<Cat>(), $typed<{ readonly legs: number }>()),
    ).toEqualTypeOf<Cat>();
  });
});

describe("incomparable types", () => {
  test("primitives", () => {
    expectTypeOf(
      narrowed($typed<string>(), $typed<number>()),
    ).toEqualTypeOf<never>();
  });

  test("disjoint literals", () => {
    expectTypeOf(narrowed("a", "b")).toEqualTypeOf<never>();
  });

  test("primitive and object", () => {
    expectTypeOf(
      narrowed($typed<string>(), $typed<Cat>()),
    ).toEqualTypeOf<never>();
  });

  test("functions", () => {
    expectTypeOf(
      narrowed($typed<() => string>(), $typed<() => number>()),
    ).toEqualTypeOf<never>();
  });

  test("branded strings", () => {
    expectTypeOf(
      narrowed($typed<Tagged<string, "a">>(), $typed<Tagged<string, "b">>()),
    ).toEqualTypeOf<Tagged<string, "a"> & Tagged<string, "b">>();
  });

  test("branded string and an object sharing a prop", () => {
    expectTypeOf(
      narrowed($typed<Tagged<string, "a">>(), $typed<{ readonly length: 3 }>()),
    ).toEqualTypeOf<never>();
  });

  test("branded numbers", () => {
    expectTypeOf(
      narrowed($typed<Tagged<number, "a">>(), $typed<Tagged<number, "b">>()),
    ).toEqualTypeOf<Tagged<number, "a"> & Tagged<number, "b">>();
  });

  test("branded number and an object", () => {
    expectTypeOf(
      narrowed($typed<Tagged<number, "a">>(), $typed<Cat>()),
    ).toEqualTypeOf<never>();
  });

  test("branded boolean and an object", () => {
    expectTypeOf(
      narrowed($typed<Tagged<boolean, "a">>(), $typed<Cat>()),
    ).toEqualTypeOf<never>();
  });

  test("branded bigint and an object", () => {
    expectTypeOf(
      narrowed($typed<Tagged<bigint, "a">>(), $typed<Cat>()),
    ).toEqualTypeOf<never>();
  });

  test("branded symbol and an object", () => {
    expectTypeOf(
      narrowed($typed<Tagged<symbol, "a">>(), $typed<Cat>()),
    ).toEqualTypeOf<never>();
  });
});

describe("template literals", () => {
  test("literal extends the template", () => {
    expectTypeOf(
      narrowed("abc", $typed<`a${string}`>()),
    ).toEqualTypeOf<"abc">();
  });

  test("literal disjoint from the template", () => {
    expectTypeOf(
      narrowed("foo", $typed<`bar${string}`>()),
    ).toEqualTypeOf<never>();
  });

  test("overlapping templates", () => {
    expectTypeOf(
      narrowed($typed<`a${string}`>(), $typed<`${string}b`>()),
    ).toEqualTypeOf<`a${string}` & `${string}b`>();
  });

  test("disjoint templates", () => {
    expectTypeOf(
      narrowed($typed<`foo_${number}`>(), $typed<`hello${string}`>()),
    ).toEqualTypeOf<`foo_${number}` & `hello${string}`>();
  });
});

describe("unions", () => {
  test("union on the first type", () => {
    expectTypeOf(narrowed($typed<"a" | "b">(), "a")).toEqualTypeOf<"a">();
  });

  test("union on the second type", () => {
    expectTypeOf(narrowed("a", $typed<"a" | "b">())).toEqualTypeOf<"a">();
  });

  test("overlapping unions", () => {
    expectTypeOf(
      narrowed($typed<"a" | "b">(), $typed<"b" | "c">()),
    ).toEqualTypeOf<"b">();
  });

  test("disjoint unions", () => {
    expectTypeOf(
      narrowed($typed<"a" | "b">(), $typed<"c" | "d">()),
    ).toEqualTypeOf<never>();
  });

  test("union wider than the other type", () => {
    expectTypeOf(narrowed($typed<string>(), $typed<"a" | "b">())).toEqualTypeOf<
      "a" | "b"
    >();
  });

  test("boolean distributes as a union of its literals", () => {
    expectTypeOf(narrowed($typed<boolean>(), true)).toEqualTypeOf<true>();
  });

  test("union of objects on the first type", () => {
    expectTypeOf(
      narrowed(
        $typed<{ readonly a: string } | { readonly b: number }>(),
        $typed<{ readonly a: string }>(),
      ),
    ).toEqualTypeOf<
      { readonly a: string } | ({ readonly b: number } & { readonly a: string })
    >();
  });

  test("union of objects on the second type", () => {
    expectTypeOf(
      narrowed(
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
      narrowed($typed<any>(), $typed<string>()),
    ).toEqualTypeOf<string>();
  });

  test("any as the second type", () => {
    expectTypeOf(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Testing how the type reacts to `any` is the point of this test.
      narrowed($typed<string>(), $typed<any>()),
    ).toEqualTypeOf<string>();
  });

  test("any as both types", () => {
    expectTypeOf(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Testing how the type reacts to `any` is the point of this test.
      narrowed($typed<any>(), $typed<any>()),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Testing how the type reacts to `any` is the point of this test.
    ).toEqualTypeOf<any>();
  });

  test("unknown as the first type", () => {
    expectTypeOf(
      narrowed($typed<unknown>(), $typed<string>()),
    ).toEqualTypeOf<string>();
  });

  test("unknown as the second type", () => {
    expectTypeOf(
      narrowed($typed<string>(), $typed<unknown>()),
    ).toEqualTypeOf<string>();
  });

  test("never as the first type", () => {
    expectTypeOf(narrowed($typed(), $typed<string>())).toEqualTypeOf<never>();
  });

  test("never as the second type", () => {
    expectTypeOf(narrowed($typed<string>(), $typed())).toEqualTypeOf<never>();
  });
});

describe("objects", () => {
  test("one object extends the other", () => {
    expectTypeOf(
      narrowed(
        $typed<{ readonly a: string; readonly b: number }>(),
        $typed<{ readonly a: string }>(),
      ),
    ).toEqualTypeOf<{ readonly a: string; readonly b: number }>();
  });

  test("incomparable objects with common props", () => {
    expectTypeOf(
      narrowed(
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
      narrowed(
        $typed<{ readonly a: string }>(),
        $typed<{ readonly b: number }>(),
      ),
    ).toEqualTypeOf<{ readonly a: string } & { readonly b: number }>();
  });

  test("incomparable objects with a conflicting common prop", () => {
    expectTypeOf(
      narrowed(
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

  // Sharing a key doesn't prove the intersection is inhabited; when the shared
  // key's literal types conflict TypeScript reduces it for us.
  test("conflicting literal common prop", () => {
    expectTypeOf(
      narrowed(
        $typed<{ readonly a: "cat" }>(),
        $typed<{ readonly a: "dog" }>(),
      ),
    ).toEqualTypeOf<never>();
  });

  test("index-signature type and an interface", () => {
    expectTypeOf(
      narrowed($typed<Record<string, unknown>>(), $typed<Cat>()),
    ).toEqualTypeOf<Record<string, unknown> & Cat>();
  });

  test("incomparable interfaces without common props", () => {
    expectTypeOf(narrowed($typed<Cat>(), $typed<Named>())).toEqualTypeOf<
      Cat & Named
    >();
  });

  test("incomparable interfaces with common props", () => {
    expectTypeOf(narrowed($typed<Cat>(), $typed<Legged>())).toEqualTypeOf<
      Cat & Legged
    >();
  });

  test("incomparable classes without common props", () => {
    expectTypeOf(
      narrowed($typed<CatClass>(), $typed<NamedClass>()),
    ).toEqualTypeOf<CatClass & NamedClass>();
  });

  test("incomparable classes with common props", () => {
    expectTypeOf(
      narrowed($typed<CatClass>(), $typed<LeggedClass>()),
    ).toEqualTypeOf<CatClass & LeggedClass>();
  });
});

describe("arrays", () => {
  test("one array extends the other", () => {
    expectTypeOf(
      narrowed($typed<string[]>(), $typed<(string | number)[]>()),
    ).toEqualTypeOf<string[]>();
  });

  test("incomparable arrays", () => {
    expectTypeOf(
      narrowed($typed<string[]>(), $typed<number[]>()),
    ).toEqualTypeOf<never>();
  });

  // Arrays share props with object types (e.g. `length`) but the intersection
  // fallback intentionally skips them.
  test("array and an incomparable object sharing a prop", () => {
    expectTypeOf(
      narrowed($typed<string[]>(), $typed<{ readonly length: 3 }>()),
    ).toEqualTypeOf<never>();
  });

  test("tuples of different lengths", () => {
    expectTypeOf(
      narrowed($typed<[string, number]>(), $typed<[string]>()),
    ).toEqualTypeOf<never>();
  });

  test("mutable array extends the readonly array", () => {
    expectTypeOf(
      narrowed($typed<string[]>(), $typed<readonly string[]>()),
    ).toEqualTypeOf<string[]>();
  });

  test("mutable tuple extends the readonly tuple", () => {
    expectTypeOf(
      narrowed($typed<[string]>(), $typed<readonly [string]>()),
    ).toEqualTypeOf<[string]>();
  });
});

describe("argument order doesn't matter", () => {
  test("incomparable objects with common props", () => {
    expectTypeOf(
      narrowed(
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
      narrowed($typed<{ readonly length: 3 }>(), $typed<string[]>()),
    ).toEqualTypeOf<never>();
  });

  test("branded string and an object sharing a prop", () => {
    expectTypeOf(
      narrowed($typed<{ readonly length: 3 }>(), $typed<Tagged<string, "a">>()),
    ).toEqualTypeOf<never>();
  });

  test("branded number and an object", () => {
    expectTypeOf(
      narrowed($typed<Cat>(), $typed<Tagged<number, "a">>()),
    ).toEqualTypeOf<never>();
  });

  test("index-signature type and an interface", () => {
    expectTypeOf(
      narrowed($typed<Cat>(), $typed<Record<string, unknown>>()),
    ).toEqualTypeOf<Cat & Record<string, unknown>>();
  });
});
