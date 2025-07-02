import { expectTypeOf, test } from "vitest";
import { pipe } from "./pipe";
import { zipWith } from "./zipWith";

test("data first typings", () => {
  const actual = zipWith(
    ["1", "2", "3"],
    ["a", "b", "c"],
    (a, b) => `${a}${b}`,
  );

  expectTypeOf(actual).toEqualTypeOf<Array<string>>();
});

test("data second typings", () => {
  const actual = zipWith((a: string, b: string) => `${a}${b}`)(
    ["1", "2", "3"],
    ["a", "b", "c"],
  );

  expectTypeOf(actual).toEqualTypeOf<Array<string>>();
});

test("data second with initial arg typings", () => {
  const actual = pipe(
    ["1", "2", "3"],
    zipWith(["a", "b", "c"], (a, b) => `${a}${b}`),
  );

  expectTypeOf(actual).toEqualTypeOf<Array<string>>();
});
