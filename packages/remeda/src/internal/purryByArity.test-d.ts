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

declare function isEqualImplementation(data: unknown, other: unknown): boolean;

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
  });

  test("rejects optional parameters", () => {
    purry2(
      // @ts-expect-error [ts2345] -- A data-last call can't tell an omitted optional argument from the data, so implementations declare none.
      subtractOptionalImplementation,
      2 /* argumentsLength */,
      1,
      2,
    );
    purry1(
      // @ts-expect-error [ts2345] -- `purry1`'s data-last function is the implementation itself, so a point-free caller's extra arguments would fill the optional parameter.
      subtractOptionalImplementation,
      1 /* argumentsLength */,
      1,
    );
  });
});

describe("known issues!", () => {
  test("an implementation with fewer parameters than the helper", () => {
    // Expected: both calls are rejected, like `purry1(subtractImplementation)`
    // is (see "matches the data-first parameters").
    //
    // Actual: they compile whenever the parameters after the data accept
    // `unknown`, because a function with fewer parameters is assignable to one
    // with more, and `P` falls back to `unknown` for every parameter it can't
    // infer. A call to the utility with the implementation's arity then
    // returns its data-last function instead of running it.
    purry2(negateImplementation, 1 /* argumentsLength */, 1, undefined);
    purry3(isEqualImplementation, 2 /* argumentsLength */, 1, 2, undefined);
  });
});
