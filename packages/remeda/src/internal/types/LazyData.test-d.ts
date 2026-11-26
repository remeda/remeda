import { describe, expectTypeOf, test } from "vitest";
import type { IterableContainer } from "./IterableContainer";
import type { LazyData } from "./LazyData";
import type { NonEmptyArray } from "./NonEmptyArray";

declare function lazyData<T extends IterableContainer>(data: T): LazyData<T>;

describe("tuple shapes", () => {
  test("empty tuple", () => {
    expectTypeOf(lazyData([])).toEqualTypeOf<never>();
  });

  test("fixed tuple", () => {
    expectTypeOf(
      lazyData(["a", "b", "c", "d", "e"] as ["a", "b", "c", "d", "e"]),
    ).toEqualTypeOf<readonly ["a", "b"?, "c"?, "d"?, "e"?]>();
  });

  test("optional tuple", () => {
    expectTypeOf(lazyData([] as ["a"?, "b"?, "c"?, "d"?, "e"?])).toEqualTypeOf<
      readonly ["a", "b"?, "c"?, "d"?, "e"?]
    >();
  });

  test("mixed tuple", () => {
    expectTypeOf(
      lazyData(["a", "b"] as ["a", "b", "c"?, "d"?, "e"?]),
    ).toEqualTypeOf<readonly ["a", "b"?, "c"?, "d"?, "e"?]>();
  });

  test("array", () => {
    expectTypeOf(lazyData([] as "a"[])).toEqualTypeOf<
      readonly ["a", ..."a"[]]
    >();
  });

  test("fixed-prefix array", () => {
    expectTypeOf(lazyData(["a", "b"] as ["a", "b", ..."c"[]])).toEqualTypeOf<
      readonly ["a", "b"?, ..."c"[]]
    >();
  });

  test("optional-prefix array", () => {
    expectTypeOf(lazyData([] as ["a"?, "b"?, ..."c"[]])).toEqualTypeOf<
      readonly ["a", "b"?, ..."c"[]]
    >();
  });

  test("mixed-prefix array", () => {
    expectTypeOf(
      lazyData(["a", "b"] as ["a", "b", "c"?, "d"?, ..."e"[]]),
    ).toEqualTypeOf<readonly ["a", "b"?, "c"?, "d"?, ..."e"[]]>();
  });

  test("fixed-suffix array", () => {
    expectTypeOf(lazyData(["b", "c"] as [..."a"[], "b", "c"])).toEqualTypeOf<
      | readonly ["a", ..."a"[]]
      | readonly ["a", ..."a"[], "b"]
      | readonly ["a", ..."a"[], "b", "c"]
      | readonly ["b", "c"?]
    >();
  });

  test("fixed-elements array", () => {
    expectTypeOf(
      lazyData(["a", "b", "d", "e"] as ["a", "b", ..."c"[], "d", "e"]),
    ).toEqualTypeOf<
      | readonly ["a", "b"?, ..."c"[]]
      | readonly ["a", "b", ..."c"[], "d"]
      | readonly ["a", "b", ..."c"[], "d", "e"]
    >();
  });
});

describe("structurally non-empty", () => {
  test("fixed-suffix array", () => {
    expectTypeOf(lazyData(["b", "c"] as [..."a"[], "b", "c"])).toExtend<
      Readonly<NonEmptyArray<unknown>>
    >();
  });

  test("fixed-elements array", () => {
    expectTypeOf(
      lazyData(["a", "b", "d", "e"] as ["a", "b", ..."c"[], "d", "e"]),
    ).toExtend<Readonly<NonEmptyArray<unknown>>>();
  });
});

test("union of tuples with different shapes", () => {
  expectTypeOf(
    lazyData(["a", "b"] as ["a", "b"] | ["c", ..."d"[]]),
  ).toEqualTypeOf<readonly ["a", "b"?] | readonly ["c", ..."d"[]]>();
});

describe("known issues!", () => {
  test("tuple prefixes aren't assignable to arrays", () => {
    const result = lazyData(["a", "b", "c"]);

    expectTypeOf(result).toEqualTypeOf<readonly [string, string?, string?]>();

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
    expectTypeOf(result).not.toExtend<readonly string[]>();
  });
});
