import { describe, expectTypeOf, test } from "vitest";
import type { LazyUnaryFunction } from "./lazyDataLastImplementation";
import { purryWithLazy1, purryWithLazy2 } from "./purryWithLazyByArity";
import type { LazyEvaluator } from "./types/LazyEvaluator";

declare function takeImplementation(
  data: readonly number[],
  count: number,
): number[];

declare function lazyImplementation(_count: number): LazyEvaluator<number>;

declare const passThrough: LazyEvaluator<number>;

test("return type", () => {
  expectTypeOf(
    purryWithLazy2(
      takeImplementation,
      lazyImplementation,
      2 /* argumentsLength */,
      [1],
      1,
    ),
  ).toEqualTypeOf<
    number[] | LazyUnaryFunction<readonly number[], [count: number], number[]>
  >();
});

describe("arity", () => {
  test("matches the data-first parameters", () => {
    purryWithLazy1(
      // @ts-expect-error [ts2345] -- `takeImplementation` takes 2 parameters, so `purryWithLazy1` doesn't fit it.
      takeImplementation,
      lazyImplementation,
      1 /* argumentsLength */,
      [1],
    );
  });

  test("the lazy implementation takes the one argument itself", () => {
    purryWithLazy2(
      takeImplementation,
      // @ts-expect-error [ts2345] -- A lazy implementation receives a single argument as is, not in a tuple.
      (_lazyArgument: readonly [count: number]) => passThrough,
      2 /* argumentsLength */,
      [1],
      1,
    );
  });
});
