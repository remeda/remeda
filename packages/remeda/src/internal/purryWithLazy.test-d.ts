import { describe, expectTypeOf, test } from "vitest";
import type { LazyUnaryFunction } from "./lazyDataLastImplementation";
import { purryWithLazy } from "./purryWithLazy";
import type { LazyEvaluator } from "./types/LazyEvaluator";

test("return type", () => {
  expectTypeOf(
    purryWithLazy(takeImplementation, 2, lazyImplementation, []),
  ).toEqualTypeOf<
    number[] | LazyUnaryFunction<readonly number[], [count: number], number[]>
  >();
});

describe("arity", () => {
  test("matches the data-first parameters", () => {
    purryWithLazy(
      takeImplementation,
      // @ts-expect-error [ts2345] -- `takeImplementation` takes 2 parameters, so 1 isn't its arity.
      1,
      lazyImplementation,
      [],
    );
    purryWithLazy(
      takeImplementation,
      // @ts-expect-error [ts2345] -- `takeImplementation` takes 2 parameters, so 3 isn't its arity.
      3,
      lazyImplementation,
      [],
    );
  });

  test("counts optional parameters", () => {
    purryWithLazy(
      takeOptionalImplementation,
      2,
      lazyOptionalImplementation,
      [],
    );
    purryWithLazy(
      takeOptionalImplementation,
      // @ts-expect-error [ts2345] -- The optional `count` still counts, so 1 isn't the arity.
      1,
      lazyOptionalImplementation,
      [],
    );
  });
});

const takeImplementation = (data: readonly number[], count: number): number[] =>
  data.slice(0, count);

const lazyImplementation = (_count: number): LazyEvaluator<number> =>
  passThrough;

const takeOptionalImplementation = (
  data: readonly number[],
  count?: number,
): number[] => data.slice(0, count);

const lazyOptionalImplementation = (_count?: number): LazyEvaluator<number> =>
  passThrough;

const passThrough: LazyEvaluator<number> = (value) => value;
