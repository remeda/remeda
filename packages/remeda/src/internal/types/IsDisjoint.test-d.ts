import { describe, expectTypeOf, test } from "vitest";
import { $typed } from "../../../test/$typed";
import type { IsDisjoint } from "./IsDisjoint";

declare function isDisjoint<A, B>(a: A, b: B): IsDisjoint<A, B>;

describe("literals", () => {
  test("simple literals", () => {
    expectTypeOf(isDisjoint("a" as const, "b" as const)).toEqualTypeOf<true>();
  });

  test("literal unions", () => {
    expectTypeOf(
      isDisjoint($typed<"a" | "b">(), $typed<"b" | "c">()),
    ).toEqualTypeOf<false>();
  });

  test("against primitive", () => {
    expectTypeOf(
      isDisjoint($typed<string>(), "b" as const),
    ).toEqualTypeOf<false>();
  });
});

describe("unbound template literals", () => {
  test("disjoint", () => {
    expectTypeOf(
      isDisjoint($typed<`a${string}`>(), $typed<`b${string}`>()),
    ).toEqualTypeOf<true>();
  });

  test("contained", () => {
    expectTypeOf(
      isDisjoint($typed<`a${string}`>(), $typed<`aa${string}`>()),
    ).toEqualTypeOf<false>();
  });
});

describe("known issues!", () => {
  test("templates that overlap without either containing the other", () => {
    // Containment in either direction proves overlap, but it can't prove its
    // absence: two templates can each constrain a region the other leaves free,
    // so neither contains the other even though values satisfy both. Here
    // `"az"` satisfies both templates, so the result should be `false`.
    const isResult = isDisjoint($typed<`a${string}`>(), $typed<`${string}z`>());

    expectTypeOf(isResult).toEqualTypeOf<true>();
    expectTypeOf(isResult).not.toEqualTypeOf<false>();
  });
});
