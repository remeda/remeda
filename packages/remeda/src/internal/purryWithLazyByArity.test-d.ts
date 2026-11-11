import { describe, expectTypeOf, test } from "vitest";
import type { LazyUnaryFunction } from "./lazyDataLastImplementation";
import {
  purryWithLazy1,
  purryWithLazy2,
  purryWithLazy3,
} from "./purryWithLazyByArity";
import type { IterableContainer } from "./types/IterableContainer";
import type { LazyEvaluator } from "./types/LazyEvaluator";

declare function takeImplementation(
  data: readonly number[],
  count: number,
): number[];

declare function lazyImplementation(_count: number): LazyEvaluator<number>;

declare const passThrough: LazyEvaluator<number>;

declare function genericTakeImplementation<T extends IterableContainer>(
  data: T,
  count: number,
): T[number][];

declare function genericLazyImplementation<T>(count: number): LazyEvaluator<T>;

declare function differenceWithImplementation<T, Other>(
  data: readonly T[],
  other: readonly Other[],
  isEqual: (a: T, b: Other) => boolean,
): T[];

declare function lazyImplementationOfOther<T>(
  other: readonly unknown[],
): LazyEvaluator<T>;

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

describe("generic implementation", () => {
  test("infers its parameters", () => {
    purryWithLazy2(
      genericTakeImplementation,
      genericLazyImplementation,
      2 /* argumentsLength */,
      [1],
      1,
    );
  });

  test("matches the lazy implementation to it", () => {
    purryWithLazy2(
      // @ts-expect-error [ts2345] -- `P` is inferred from the lazy implementation's `string` parameter, which the implementation's `count` rejects.
      genericTakeImplementation,
      (_count: string) => passThrough,
      2 /* argumentsLength */,
      [1],
      1,
    );
  });
});

describe("known issues!", () => {
  test("a lazy implementation that takes the tuple as its first argument", () => {
    // Expected: the call is rejected, since the lazy implementation receives
    // the tuple `[other, isEqual]` rather than `other`.
    //
    // Actual: it compiles, because the tuple is assignable to an array
    // parameter. In `pipe`, the lazy implementation then reads the tuple as
    // `other`.
    purryWithLazy3(
      differenceWithImplementation,
      lazyImplementationOfOther,
      3 /* argumentsLength */,
      [1],
      [1],
      () => true,
    );
  });
});
