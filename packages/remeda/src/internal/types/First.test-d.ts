import { describe, expectTypeOf, test } from "vitest";
import type { First } from "./First";
import type { IterableContainer } from "./IterableContainer";

declare function first<T extends IterableContainer>(data: T): First<T>;

describe("tuple shapes", () => {
  test("empty tuple", () => {
    expectTypeOf(first([])).toEqualTypeOf<undefined>();
  });

  test("fixed tuple", () => {
    expectTypeOf(first(["a", "b", "c"] as const)).toEqualTypeOf<"a">();
  });

  test("optional tuple", () => {
    expectTypeOf(first([] as ["a"?, "b"?, "c"?])).toEqualTypeOf<
      "a" | "b" | "c" | undefined
    >();
  });

  test("mixed tuple", () => {
    expectTypeOf(
      first(["a", "b"] as ["a", "b", "c"?, "d"?]),
    ).toEqualTypeOf<"a">();
  });

  test("array", () => {
    expectTypeOf(first([] as "a"[])).toEqualTypeOf<"a" | undefined>();
  });

  test("fixed-prefix array", () => {
    expectTypeOf(first(["a"] as ["a", ..."b"[]])).toEqualTypeOf<"a">();
  });

  test("optional-prefix array", () => {
    expectTypeOf(first([] as ["a"?, ..."b"[]])).toEqualTypeOf<
      "a" | "b" | undefined
    >();
  });

  test("mixed-prefix array", () => {
    expectTypeOf(first(["a"] as ["a", "b"?, ..."c"[]])).toEqualTypeOf<"a">();
  });

  test("fixed-suffix array", () => {
    expectTypeOf(first(["b"] as [..."a"[], "b"])).toEqualTypeOf<"a" | "b">();
  });

  test("fixed-elements array", () => {
    expectTypeOf(
      first(["a", "c"] as ["a", ..."b"[], "c"]),
    ).toEqualTypeOf<"a">();
  });
});

test("union of arrays", () => {
  expectTypeOf(first([] as "a"[] | "b"[])).toEqualTypeOf<
    "a" | "b" | undefined
  >();
});
