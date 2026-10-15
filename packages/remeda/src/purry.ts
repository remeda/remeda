import {
  dataLastImplementation,
  type DataFirst,
  type UnaryFunction,
} from "./internal/dataLastImplementation";

/**
 * Wraps a `dataFirst` implementation and dynamically curries it at runtime
 * based on the number of arguments it was called with.
 *
 * When `args` has at least `dataFirst.length` items (`Function.length` counts
 * the parameters before the first defaulted or rest one), `dataFirst` is
 * called with all of them, extra ones included. Otherwise `purry` returns a
 * function that takes the data and calls `dataFirst(data, ...args)`.
 *
 * The return type is not dynamically routed via the same runtime logic, and
 * therefore is a union of both data-first and data-last return types. The
 * return type also ignores any generic type parameters of `dataFirst`, and in
 * most cases would end up widening the return type to `unknown`. See the
 * examples below for a structured template for coupling the return types to
 * specific overloaded signatures. Almost all Remeda utilities are built using
 * `purry` via this template.
 *
 * @param dataFirst - The function to purry.
 * @param args - The arguments.
 * @signature
 *   purry(dataFirst, args);
 * @example
 *    // data-first
 *    function findIndex<T>(
 *      data: readonly T[],
 *      predicate: (item: T) => boolean,
 *    ): number;
 *
 *    // data-last
 *    function findIndex<T>(
 *      predicate: (item: T) => boolean,
 *    ): (data: readonly T[]) => number;
 *
 *    function findIndex(...args: unknown[]) {
 *      return purry(findIndexImplementation, args);
 *    }
 *
 *    function findIndexImplementation(data, predicate): number {
 *      for (let i = 0; i < array.length; i++) {
 *        if (predicate(array[i])) {
 *          return i;
 *        }
 *      }
 *      return -1;
 *    }
 * @category Function
 */
export const purry = <T, P extends readonly unknown[], R>(
  dataFirst: DataFirst<T, P, R>,
  args: readonly unknown[],
): R | UnaryFunction<T, R> =>
  args.length >= dataFirst.length
    ? dataFirst(
        // @ts-expect-error [ts2556] -- the whole point of currying is that `args` are polymorphic and can either fit the data-first pattern, like here, or the data-last pattern as below. The length check that is used to pick between them can't narrow it!
        ...args,
      )
    : dataLastImplementation(
        dataFirst,
        // @ts-expect-error [ts2345] -- the whole point of currying is that `args` are polymorphic and can either fit the data-first pattern, as above, or the data-last pattern, like here. The length check that is used to pick between them can't narrow it!
        args,
      );
