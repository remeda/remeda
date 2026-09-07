import { describe, expectTypeOf, test } from "vitest";
import type { IterableContainer } from "./IterableContainer";
import type { NonEmptyArray } from "./NonEmptyArray";
import type { NonEmptyPrefix } from "./NonEmptyPrefix";

declare function nonEmptyPrefix<T extends IterableContainer>(
  data: T,
): NonEmptyPrefix<T>;

describe("tuple shapes", () => {
  test("empty tuple", () => {
    expectTypeOf(nonEmptyPrefix([])).toEqualTypeOf<never>();
  });

  test("fixed tuple", () => {
    expectTypeOf(
      nonEmptyPrefix(["a", "b", "c", "d", "e"] as ["a", "b", "c", "d", "e"]),
    ).toEqualTypeOf<["a", "b"?, "c"?, "d"?, "e"?]>();
  });

  test("optional tuple", () => {
    expectTypeOf(
      nonEmptyPrefix([] as ["a"?, "b"?, "c"?, "d"?, "e"?]),
    ).toEqualTypeOf<["a", "b"?, "c"?, "d"?, "e"?]>();
  });

  test("mixed tuple", () => {
    expectTypeOf(
      nonEmptyPrefix(["a", "b"] as ["a", "b", "c"?, "d"?, "e"?]),
    ).toEqualTypeOf<["a", "b"?, "c"?, "d"?, "e"?]>();
  });

  test("array", () => {
    expectTypeOf(nonEmptyPrefix([] as "a"[])).toEqualTypeOf<["a", ..."a"[]]>();
  });

  test("fixed-prefix array", () => {
    expectTypeOf(
      nonEmptyPrefix(["a", "b"] as ["a", "b", ..."c"[]]),
    ).toEqualTypeOf<["a", "b"?, ..."c"[]]>();
  });

  test("optional-prefix array", () => {
    expectTypeOf(nonEmptyPrefix([] as ["a"?, "b"?, ..."c"[]])).toEqualTypeOf<
      ["a", "b"?, ..."c"[]]
    >();
  });

  test("mixed-prefix array", () => {
    expectTypeOf(
      nonEmptyPrefix(["a", "b"] as ["a", "b", "c"?, "d"?, ..."e"[]]),
    ).toEqualTypeOf<["a", "b"?, "c"?, "d"?, ..."e"[]]>();
  });

  test("fixed-suffix array", () => {
    expectTypeOf(
      nonEmptyPrefix(["b", "c"] as [..."a"[], "b", "c"]),
    ).toEqualTypeOf<
      | ["a", ..."a"[]]
      | ["a", ..."a"[], "b"]
      | ["a", ..."a"[], "b", "c"]
      | ["b", "c"?]
    >();
  });

  test("fixed-elements array", () => {
    expectTypeOf(
      nonEmptyPrefix(["a", "b", "d", "e"] as ["a", "b", ..."c"[], "d", "e"]),
    ).toEqualTypeOf<
      | ["a", "b"?, ..."c"[]]
      | ["a", "b", ..."c"[], "d"]
      | ["a", "b", ..."c"[], "d", "e"]
    >();
  });
});

describe("structurally non-empty", () => {
  test("fixed-suffix array", () => {
    expectTypeOf(nonEmptyPrefix(["b", "c"] as [..."a"[], "b", "c"])).toExtend<
      NonEmptyArray<unknown>
    >();
  });

  test("fixed-elements array", () => {
    expectTypeOf(
      nonEmptyPrefix(["a", "b", "d", "e"] as ["a", "b", ..."c"[], "d", "e"]),
    ).toExtend<NonEmptyArray<unknown>>();
  });
});

test("union of tuples with different shapes", () => {
  expectTypeOf(
    nonEmptyPrefix(["a", "b"] as ["a", "b"] | ["c", ..."d"[]]),
  ).toEqualTypeOf<["a", "b"?] | ["c", ..."d"[]]>();
});

describe("known issues!", () => {
  test("tuple prefixes aren't assignable to arrays", () => {
    const result = nonEmptyPrefix(["a", "b", "c"]);

    expectTypeOf(result).toEqualTypeOf<[string, string?, string?]>();

    // TypeScript adds `undefined` to reads of optional tuple elements even
    // under `exactOptionalPropertyTypes`, where `undefined` is rejected as a
    // value in those slots (@see
    // https://github.com/microsoft/TypeScript/pull/50831). So the prefix of a
    // tuple isn't assignable to an array of its items, although every value it
    // describes would be. Users hit this when the input to `pipe` is a tuple
    // and the callback passes `data` to something that expects an array (e.g.,
    // `sum(data)`). If this test fails, TypeScript changed this behavior and
    // the limitation should be removed from the docs.
    expectTypeOf(result).items.toEqualTypeOf<string | undefined>();
    expectTypeOf(result).items.not.toEqualTypeOf<string>();
    expectTypeOf(result).not.toExtend<readonly ("a" | "b" | "c")[]>();
  });
});
