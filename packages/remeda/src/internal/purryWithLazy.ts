import type { DataFirst } from "./dataLastImplementation";
import {
  lazyDataLastImplementation,
  type LazyDefinition,
  type LazyUnaryFunction,
} from "./lazyDataLastImplementation";
import type { IterableContainer } from "./types/IterableContainer";

/**
 * An internal-only re-implementation of `purry` that allows passing a lazy
 * function to the `lazyDataLastImplementation`.
 *
 * This is done as a copy instead of having `purry` call it to keep the
 * execution stack and the bundle lean for the vast majority of functions that
 * don't have lazy semantics.
 */
export const purryWithLazy = <
  T extends IterableContainer,
  P extends readonly unknown[],
  R,
>(
  dataFirst: DataFirst<T, P, R>,
  args: readonly unknown[],
  lazy: LazyDefinition<T, P>["lazy"],
): R | LazyUnaryFunction<T, P, R> =>
  args.length >= dataFirst.length
    ? dataFirst(
        // @ts-expect-error [ts2556] -- the whole point of currying is that `args` are polymorphic and can either fit the data-first pattern, like here, or the data-last pattern as below. The length check that is used to pick between them can't narrow it!
        ...args,
      )
    : lazyDataLastImplementation(
        dataFirst,
        // @ts-expect-error [ts2345] -- the whole point of currying is that `args` are polymorphic and can either fit the data-first pattern, as above, or the data-last pattern, like here. The length check that is used to pick between them can't narrow it!
        args,
        lazy,
      );
