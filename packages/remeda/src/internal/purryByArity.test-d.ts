import { describe, expectTypeOf, test } from "vitest";
import { purry1, purry2, purry3 } from "./purryByArity";

declare function subtractImplementation(
  minuend: number,
  subtrahend: number,
): number;

declare function subtractOptionalImplementation(
  minuend: number,
  subtrahend?: number,
): number;

declare function negateImplementation(data: number): number;

test("return type", () => {
  expectTypeOf(
    purry2(subtractImplementation, 2 /* argumentsLength */, 1, 2),
  ).toEqualTypeOf<number | ((data: number) => number)>();
});

describe("arity", () => {
  test("matches the data-first parameters", () => {
    purry1(
      // @ts-expect-error [ts2345] -- `subtractImplementation` takes 2 parameters, so `purry1` doesn't fit it.
      subtractImplementation,
      1 /* argumentsLength */,
      1,
    );
    purry3(
      // @ts-expect-error [ts2345] -- `subtractImplementation` takes 2 parameters, so `purry3` doesn't fit it.
      subtractImplementation,
      3 /* argumentsLength */,
      1,
      2,
      3,
    );
  });

  test("rejects optional parameters", () => {
    purry2(
      // @ts-expect-error [ts2345] -- A data-last call can't tell an omitted optional argument from the data, so implementations declare none.
      subtractOptionalImplementation,
      2 /* argumentsLength */,
      1,
      2,
    );
  });
});

describe("known issues!", () => {
  test("an implementation with fewer parameters than the helper", () => {
    // Expected: the call is rejected, like `purry1(subtractImplementation)`
    // is (see "matches the data-first parameters").
    //
    // Actual: it compiles, because a function with fewer parameters is
    // assignable to one with more. A one-argument call to the utility then
    // returns its data-last function instead of running it.
    purry2(negateImplementation, 1 /* argumentsLength */, 1, undefined);
  });

  test("an optional parameter beyond the helper", () => {
    // Expected: the call is rejected, like `purry2` is for the same
    // implementation (see "rejects optional parameters").
    //
    // Actual: it compiles, because a function is assignable to one that
    // lacks its optional parameters. The utility then drops that argument.
    purry1(subtractOptionalImplementation, 2 /* argumentsLength */, 1);
  });
});
