import { describe, expectTypeOf, test } from "vitest";
import { purry } from "./purry";

describe("known issues!", () => {
  test("as a callback, typed as the data-last overload", () => {
    const result = [1, 2, 3].map(purriedSubtract);

    // @ts-expect-error [ts2344] -- TypeScript types a callback by its last overload, the data-last one, while purry dispatches on the arguments the caller actually passes.
    expectTypeOf(result).toEqualTypeOf<number[]>();

    // Actual
    expectTypeOf(result).toEqualTypeOf<((minuend: number) => number)[]>();
  });
});

function purriedSubtract(minuend: number, subtrahend: number): number;
function purriedSubtract(subtrahend: number): (minuend: number) => number;

function purriedSubtract(...args: readonly unknown[]): unknown {
  return purry(subtractImplementation, args);
}

const subtractImplementation = (minuend: number, subtrahend: number): number =>
  minuend - subtrahend;
