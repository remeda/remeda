import { describe, expectTypeOf, test } from "vitest";
import type { IterableContainer } from "./IterableContainer";
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

test("union of tuples with different shapes", () => {
  expectTypeOf(
    nonEmptyPrefix(["a", "b"] as ["a", "b"] | ["c", ..."d"[]]),
  ).toEqualTypeOf<["a", "b"?] | ["c", ..."d"[]]>();
});
