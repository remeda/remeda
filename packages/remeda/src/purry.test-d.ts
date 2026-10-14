import { describe, expectTypeOf, test } from "vitest";
import { purry } from "./purry";

// @ts-expect-error [ts6133] -- The assertions are on the helpers themselves: one compiles, the other's mismatched overload fails (see its `@ts-expect-error`). These references only keep them from being unused.
// eslint-disable-next-line no-underscore-dangle -- See above.
const _DUMMY = {
  subtractWithMatchingOverloads,
  subtractWithMismatchedOverload,
};

test("return type", () => {
  expectTypeOf(purry(subtractImplementation, [])).toEqualTypeOf<
    number | ((data: number) => number)
  >();
});

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

  test("a generic `dataFirst` is typed by its constraints", () => {
    // Nothing in `args` binds the type parameters of `dataFirst`, and the union
    // `purry` returns can't carry them the way a returned function type could,
    // so TypeScript replaces them with their constraints. The resulting
    // `unknown` absorbs the whole union. An instantiation expression binds them.
    const result = purry(firstImplementation, []);

    expectTypeOf(result).not.toEqualTypeOf(
      purry(firstImplementation<number>, []),
    );

    // Actual
    expectTypeOf(result).toBeUnknown();
  });

  test("an overloaded `dataFirst` is typed by its last overload", () => {
    // TypeScript infers from the last overload of a function passed by
    // reference, which for `Object.fromEntries` is the one returning `any`. An
    // instantiation expression selects the typed overload.
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- The `any` is what this test pins.
    const result = purry(Object.fromEntries, []);

    expectTypeOf(result).not.toEqualTypeOf(
      purry(Object.fromEntries<unknown>, []),
    );

    // Actual
    expectTypeOf(result).toBeAny();
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

function subtractWithMatchingOverloads(
  minuend: number,
  subtrahend: number,
): number;
function subtractWithMatchingOverloads(
  subtrahend: number,
): (minuend: number) => number;

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- Intentional! we want to test `purry`s inferred return type.
function subtractWithMatchingOverloads(...args: readonly unknown[]) {
  return purry(subtractImplementation, args);
}

// @ts-expect-error [ts2394] -- Mismatched on purpose: the overload claims a `string`, but `subtractImplementation` returns a `number`.
function subtractWithMismatchedOverload(
  minuend: number,
  subtrahend: number,
): string;
function subtractWithMismatchedOverload(
  subtrahend: number,
): (minuend: number) => number;

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- Intentional! we want to test `purry`s inferred return type.
function subtractWithMismatchedOverload(...args: readonly unknown[]) {
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
