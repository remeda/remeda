import { describe, expectTypeOf, test } from "vitest";
import { purry } from "./purry";

describe("known issues!", () => {
  test("a function **reference** is typed by its last declared overload, regardless of the arguments it's called with", () => {
    // `map` calls its callback with 3 arguments (value, index, array), so purry
    // runs both functions data-first and they return numbers at runtime. The
    // index is a number, so the data-first signature fits the callback too.
    //
    // When a function is passed by reference, TypeScript only looks at its last
    // declared overload.
    const result = [1, 2, 3].map(dataLastDeclaredLast);

    expectTypeOf(result).not.toEqualTypeOf<number[]>();

    // Actual
    expectTypeOf(result).toEqualTypeOf<((minuend: number) => number)[]>();
    expectTypeOf([1, 2, 3].map(dataFirstDeclaredLast)).toEqualTypeOf<
      number[]
    >();
  });

  test("declaring the data-first overload last doesn't fix generic functions", () => {
    // TypeScript only carries type parameters through a function reference when
    // the function has a single signature. For an overloaded function it
    // replaces them with their constraints instead.
    const result = [[1], [2], [3]].map(genericDataFirstDeclaredLast);

    expectTypeOf(result).not.toEqualTypeOf<(number | undefined)[]>();

    // Actual
    expectTypeOf(result).toEqualTypeOf<unknown[]>();
  });
});

function dataLastDeclaredLast(minuend: number, subtrahend: number): number;
function dataLastDeclaredLast(subtrahend: number): (minuend: number) => number;

function dataLastDeclaredLast(...args: readonly unknown[]): unknown {
  return purry(subtractImplementation, args);
}

function dataFirstDeclaredLast(subtrahend: number): (minuend: number) => number;
function dataFirstDeclaredLast(minuend: number, subtrahend: number): number;

function dataFirstDeclaredLast(...args: readonly unknown[]): unknown {
  return purry(subtractImplementation, args);
}

const subtractImplementation = (minuend: number, subtrahend: number): number =>
  minuend - subtrahend;

function genericDataFirstDeclaredLast(): <T>(
  data: readonly T[],
) => T | undefined;
function genericDataFirstDeclaredLast<T>(data: readonly T[]): T | undefined;

function genericDataFirstDeclaredLast(...args: readonly unknown[]): unknown {
  return purry(firstImplementation, args);
}

const firstImplementation = <T>(data: readonly T[]): T | undefined => data[0];
