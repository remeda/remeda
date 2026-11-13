import { describe, expectTypeOf, test } from "vitest";
import { purry } from "./purry";
import { sum } from "./sum";

declare function subtractImplementation(
  minuend: number,
  subtrahend: number,
): number;

declare function firstImplementation<T>(data: readonly T[]): T | undefined;

declare function dataLastDeclaredLast(
  minuend: number,
  subtrahend: number,
): number;
declare function dataLastDeclaredLast(
  subtrahend: number,
): (minuend: number) => number;

declare function dataFirstDeclaredLast(
  subtrahend: number,
): (minuend: number) => number;
declare function dataFirstDeclaredLast(
  minuend: number,
  subtrahend: number,
): number;

declare function genericDataFirstDeclaredLast(): <T>(
  data: readonly T[],
) => T | undefined;
declare function genericDataFirstDeclaredLast<T>(
  data: readonly T[],
): T | undefined;

test("return type", () => {
  expectTypeOf(purry(subtractImplementation, [])).toEqualTypeOf<
    number | ((data: number) => number)
  >();
});

describe("known issues!", () => {
  test("a function **reference** is typed by its last declared overload, regardless of the arguments it's called with", () => {
    // Both stand in for utilities built on `purry`. `map` calls its callback
    // with 3 arguments (value, index, array), so such utilities run data-first
    // and return numbers at runtime. The index is a number, so the data-first
    // signature fits the callback too.
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

  test("remeda's own utilities passed by reference are typed by their data-last overload", () => {
    // Every utility declares its data-last overload last, so the limitation
    // above applies to all of them: at runtime this returns `[3, 3]`.
    const result = [[1, 2], [3]].map(sum);

    expectTypeOf(result).not.toEqualTypeOf<number[]>();

    // Actual
    expectTypeOf(result).items.toBeFunction();
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
