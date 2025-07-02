import { expectTypeOf, test } from "vitest";
import { identity } from "./identity";
import { times } from "./times";

test("works with 0", () => {
  const result = times(0, identity());

  expectTypeOf(result).toEqualTypeOf<[]>();
});

test("works with non-literals", () => {
  const result = times(10 as number, identity());

  expectTypeOf(result).toEqualTypeOf<Array<number>>();
});

test("works with positive integer literals", () => {
  const result = times(10, identity());

  expectTypeOf(result).toEqualTypeOf<
    [
      number,
      number,
      number,
      number,
      number,
      number,
      number,
      number,
      number,
      number,
    ]
  >();
});

test("works with negative integers", () => {
  const result = times(-10, identity());

  expectTypeOf(result).toEqualTypeOf<[]>();
});

test("works with non-integer positive literals", () => {
  const result = times(10.5, identity());

  expectTypeOf(result).toEqualTypeOf<
    [
      number,
      number,
      number,
      number,
      number,
      number,
      number,
      number,
      number,
      number,
    ]
  >();
});

test("works with non-integer negative literals", () => {
  const result = times(-10.5, identity());

  expectTypeOf(result).toEqualTypeOf<[]>();
});

test("works with literal unions", () => {
  const result = times(1 as 1 | 3, identity());

  expectTypeOf(result).toEqualTypeOf<[number, number, number] | [number]>();
});

test("could be 'disabled' with large literals", () => {
  const result = times(10_000, identity());

  // The result is a tuple of our max length supported for a literal, with an
  // array tail for the rest of the items...
  expectTypeOf(result).toExtend<Array<number>>();
  expectTypeOf(result[0]).toEqualTypeOf<number>();
  expectTypeOf(result[45]).toEqualTypeOf<number>();
  expectTypeOf(result[56]).toEqualTypeOf<number | undefined>();
});
