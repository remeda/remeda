import { describe, test } from "vitest";
import { withLazyImplementation } from "./lazyDataLastImplementation";
import type { LazyEvaluator } from "./types/LazyEvaluator";

declare const dataLast: (data: readonly number[]) => number[];

declare function callback(value: number): number;

declare function isEqual(a: number, b: number): boolean;

declare function lazyOfCallback(
  callbackfn: (value: number) => number,
): LazyEvaluator<number>;

declare function lazyOfTuple(
  lazyArgument: readonly [
    other: readonly number[],
    isEqual: (a: number, b: number) => boolean,
  ],
): LazyEvaluator<number>;

declare function lazyOfTwoParameters(
  other: readonly number[],
  isEqual: (a: number, b: number) => boolean,
): LazyEvaluator<number>;

describe("lazy argument", () => {
  test("a single argument as is", () => {
    withLazyImplementation(dataLast, lazyOfCallback, callback);
  });

  test("two arguments as a tuple", () => {
    withLazyImplementation(dataLast, lazyOfTuple, [[1], isEqual]);
  });

  test("rejects a single argument in a tuple", () => {
    withLazyImplementation(
      dataLast,
      lazyOfCallback,
      // @ts-expect-error [ts2345] -- A lazy implementation receives a single argument as is, not in a tuple.
      [callback],
    );
  });

  test("rejects one argument where the implementation takes a tuple", () => {
    withLazyImplementation(
      dataLast,
      lazyOfTuple,
      // @ts-expect-error [ts2322] -- The lazy implementation reads `[other, isEqual]`, not `other` alone.
      [1],
    );
  });

  test("rejects a lazy implementation spreading two arguments", () => {
    withLazyImplementation(
      dataLast,
      // @ts-expect-error [ts2345] -- A lazy implementation receives two arguments as one tuple, not spread.
      lazyOfTwoParameters,
      [[1], isEqual],
    );
  });
});
