import type { DataFirst } from "./dataLastImplementation";
import {
  lazyDataLastImplementation0,
  lazyDataLastImplementation1,
  lazyDataLastImplementation2,
  type LazyEvaluatorFactory,
  type LazyUnaryFunction,
} from "./lazyDataLastImplementation";
import type { IterableContainer } from "./types/IterableContainer";

/**
 * `purry1` for a data-first implementation that also has a lazy
 * implementation, which the data-last function carries for `pipe`.
 *
 * @param argumentsLength - The utility's `arguments.length`.
 * @example
 *    export function unique(data?: unknown): unknown {
 *      return purryWithLazy1(
 *        uniqueImplementation,
 *        lazyImplementation,
 *        arguments.length,
 *        data,
 *      );
 *    }
 * @see purry1
 */
export const purryWithLazy1 = <
  T extends IterableContainer,
  // Always empty, but it keeps a generic implementation's data type inferred
  // from its constraint, as in `purry1`.
  P extends readonly [],
  R,
>(
  dataFirst: DataFirst<T, P, R>,
  lazy: LazyEvaluatorFactory<T, P>,
  argumentsLength: number,
  data: unknown,
): R | LazyUnaryFunction<T, P, R> =>
  argumentsLength >= 1
    ? dataFirst(
        // @ts-expect-error [ts2345] -- `arguments.length` picks the call style at runtime, which TypeScript can't narrow the parameters from; the overloads guarantee their types.
        data,
      )
    : lazyDataLastImplementation0(dataFirst, lazy);

/**
 * `purry2` for a data-first implementation that also has a lazy
 * implementation, which the data-last function carries for `pipe`.
 *
 * @param argumentsLength - The utility's `arguments.length`.
 * @example
 *    export function take(arrayOrN: unknown, n?: unknown): unknown {
 *      return purryWithLazy2(
 *        takeImplementation,
 *        lazyImplementation,
 *        arguments.length,
 *        arrayOrN,
 *        n,
 *      );
 *    }
 * @see purry2
 */
export const purryWithLazy2 = <
  T extends IterableContainer,
  P extends readonly [unknown],
  R,
>(
  dataFirst: DataFirst<T, P, R>,
  lazy: LazyEvaluatorFactory<T, P>,
  argumentsLength: number,
  dataOrArgument: unknown,
  argument: unknown,
): R | LazyUnaryFunction<T, P, R> =>
  argumentsLength >= 2
    ? dataFirst(
        // @ts-expect-error [ts2345] -- `arguments.length` picks the call style at runtime, which TypeScript can't narrow the parameters from; the overloads guarantee their types.
        dataOrArgument,
        argument,
      )
    : lazyDataLastImplementation1(dataFirst, lazy, dataOrArgument);

/**
 * `purry3` for a data-first implementation that also has a lazy
 * implementation, which the data-last function carries for `pipe`.
 *
 * @param argumentsLength - The utility's `arguments.length`.
 * @example
 *    export function intersectionWith(
 *      dataOrOther: unknown,
 *      otherOrIsEqual?: unknown,
 *      isEqual?: unknown,
 *    ): unknown {
 *      return purryWithLazy3(
 *        intersectionWithImplementation,
 *        lazyImplementation,
 *        arguments.length,
 *        dataOrOther,
 *        otherOrIsEqual,
 *        isEqual,
 *      );
 *    }
 * @see purry3
 */
export const purryWithLazy3 = <
  T extends IterableContainer,
  P extends readonly [unknown, unknown],
  R,
>(
  dataFirst: DataFirst<T, P, R>,
  lazy: LazyEvaluatorFactory<T, P>,
  argumentsLength: number,
  dataOrFirst: unknown,
  firstOrSecond: unknown,
  second: unknown,
): R | LazyUnaryFunction<T, P, R> =>
  argumentsLength >= 3
    ? dataFirst(
        // @ts-expect-error [ts2345] -- `arguments.length` picks the call style at runtime, which TypeScript can't narrow the parameters from; the overloads guarantee their types.
        dataOrFirst,
        firstOrSecond,
        second,
      )
    : lazyDataLastImplementation2(dataFirst, lazy, dataOrFirst, firstOrSecond);
