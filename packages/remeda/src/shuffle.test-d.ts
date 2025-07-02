import { expectTypeOf, test } from "vitest";
import { pipe } from "./pipe";
import { shuffle } from "./shuffle";

test("regular array", () => {
  const result = shuffle([] as Array<string>);

  expectTypeOf(result).toEqualTypeOf<Array<string>>();
});

test("non-empty tail-rest array", () => {
  const result = shuffle([1] as [number, ...Array<number>]);

  expectTypeOf(result).toEqualTypeOf<[number, ...Array<number>]>();
});

test("non-empty head-rest array", () => {
  const result = shuffle([1] as [...Array<number>, number]);

  expectTypeOf(result).toEqualTypeOf<[...Array<number>, number]>();
});

test("fixed size tuple", () => {
  const result = shuffle([1, "a", true] as [number, string, boolean]);

  expectTypeOf(result).toEqualTypeOf<
    [
      boolean | number | string,
      boolean | number | string,
      boolean | number | string,
    ]
  >();
});

test("removes readonlyness from array", () => {
  const result = shuffle([] as ReadonlyArray<string>);

  expectTypeOf(result).toEqualTypeOf<Array<string>>();
});

test("infers type via a pipe", () => {
  const result = pipe(["a", 1, true] as [string, number, boolean], shuffle());

  expectTypeOf(result).toEqualTypeOf<
    [
      boolean | number | string,
      boolean | number | string,
      boolean | number | string,
    ]
  >();
});
