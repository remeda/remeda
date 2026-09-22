import { describe, expectTypeOf, test } from "vitest";
import { pipe } from "./pipe";
import { zipWith } from "./zipWith";

test("data first typings", () => {
  const actual = zipWith(
    ["1", "2", "3"],
    ["a", "b", "c"],
    (a, b) => `${a}${b}`,
  );

  expectTypeOf(actual).toEqualTypeOf<string[]>();
});

test("data second typings", () => {
  const actual = zipWith((a: string, b: string) => `${a}${b}`)(
    ["1", "2", "3"],
    ["a", "b", "c"],
  );

  expectTypeOf(actual).toEqualTypeOf<string[]>();
});

test("data second with initial arg typings", () => {
  const actual = pipe(
    ["1", "2", "3"],
    zipWith(["a", "b", "c"], (a, b) => `${a}${b}`),
  );

  expectTypeOf(actual).toEqualTypeOf<string[]>();
});

describe("callback data param", () => {
  test("complete in data-first", () => {
    zipWith(
      [1, 2, 3] as const,
      ["a", "b"] as const,
      (_first, _second, _index, data) => {
        expectTypeOf(data).toEqualTypeOf<
          readonly [readonly [1, 2, 3], readonly ["a", "b"]]
        >();

        return 0;
      },
    );
  });

  test("first datum is lazily reconstructed in data-last", () => {
    pipe(
      [1, 2, 3] as const,
      zipWith(["a", "b"] as const, (_first, _second, _index, data) => {
        expectTypeOf(data).toEqualTypeOf<
          readonly [readonly [1, 2?, 3?], readonly ["a", "b"]]
        >();

        return 0;
      }),
    );
  });
});
