import {
  dataLastImplementation1,
  dataLastImplementation2,
  type DataFirst,
  type UnaryFunction,
} from "./dataLastImplementation";

/**
 * `purry` for a data-first implementation that takes only the data. The data
 * reaches `dataFirst` as a parameter, with no array built or spread, and
 * `arguments.length` picks the call style because `undefined` is valid data.
 * The data-last function is `dataFirst` itself, so `dataFirst` has to ignore
 * any arguments after the data (`map` passes the index and the array).
 *
 * @param argumentsLength - The utility's `arguments.length`.
 * @example
 *    export function reverse(data?: unknown): unknown {
 *      return purry1(reverseImplementation, arguments.length, data);
 *    }
 * @see purryWithLazy1
 */
export const purry1 = <
  T,
  // Always empty, but only a type parameter here lets TypeScript infer a
  // generic implementation's data type from its constraint
  // (`<T extends string>(data: T)` gives `string`); `(data: T) => R` infers
  // `unknown`, which such an implementation rejects.
  P extends readonly [],
  R,
>(
  dataFirst: DataFirst<T, P, R>,
  argumentsLength: number,
  data: unknown,
): R | UnaryFunction<T, R> =>
  argumentsLength >= 1
    ? dataFirst(
        // @ts-expect-error [ts2345] -- `arguments.length` picks the call style at runtime, which TypeScript can't narrow the parameters from; the overloads guarantee their types.
        data,
      )
    : // A closure around `dataFirst` would only add a call to every data-last
      // invocation.
      // @ts-expect-error [ts2322] -- `P` is always empty, which TypeScript can't use to drop the rest parameter from `dataFirst`'s type.
      dataFirst;

/**
 * `purry` for a data-first implementation that takes one argument after the
 * data. The arguments reach `dataFirst` as parameters, with no array built or
 * spread, and `arguments.length` picks the call style because `undefined` is
 * a valid argument.
 *
 * @param argumentsLength - The utility's `arguments.length`.
 * @example
 *    export function add(valueOrAddend: unknown, addend?: unknown): unknown {
 *      return purry2(addImplementation, arguments.length, valueOrAddend, addend);
 *    }
 * @see purryWithLazy2
 */
export const purry2 = <T, P extends readonly [unknown], R>(
  dataFirst: DataFirst<T, P, R>,
  argumentsLength: number,
  dataOrArgument: unknown,
  argument: unknown,
): R | UnaryFunction<T, R> =>
  argumentsLength >= 2
    ? dataFirst(
        // @ts-expect-error [ts2345] -- `arguments.length` picks the call style at runtime, which TypeScript can't narrow the parameters from; the overloads guarantee their types.
        dataOrArgument,
        argument,
      )
    : dataLastImplementation1(dataFirst, dataOrArgument);

/**
 * `purry` for a data-first implementation that takes two arguments after the
 * data. The arguments reach `dataFirst` as parameters, with no array built or
 * spread, and `arguments.length` picks the call style because `undefined` is
 * a valid argument.
 *
 * @param argumentsLength - The utility's `arguments.length`.
 * @example
 *    export function swapIndices(
 *      dataOrIndex1: unknown,
 *      index1OrIndex2?: unknown,
 *      index2?: unknown,
 *    ): unknown {
 *      return purry3(
 *        swapIndicesImplementation,
 *        arguments.length,
 *        dataOrIndex1,
 *        index1OrIndex2,
 *        index2,
 *      );
 *    }
 * @see purryWithLazy3
 */
export const purry3 = <T, P extends readonly [unknown, unknown], R>(
  dataFirst: DataFirst<T, P, R>,
  argumentsLength: number,
  dataOrFirst: unknown,
  firstOrSecond: unknown,
  second: unknown,
): R | UnaryFunction<T, R> =>
  argumentsLength >= 3
    ? dataFirst(
        // @ts-expect-error [ts2345] -- `arguments.length` picks the call style at runtime, which TypeScript can't narrow the parameters from; the overloads guarantee their types.
        dataOrFirst,
        firstOrSecond,
        second,
      )
    : dataLastImplementation2(dataFirst, dataOrFirst, firstOrSecond);
