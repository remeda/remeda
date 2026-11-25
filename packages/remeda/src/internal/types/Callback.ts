import type { EnumerableStringKeyOf } from "./EnumerableStringKeyOf";
import type { EnumerableStringKeyedValueOf } from "./EnumerableStringKeyedValueOf";
import type { IterableContainer } from "./IterableContainer";
import type { NonEmptyPrefix } from "./NonEmptyPrefix";

/**
 * The callback the native array methods take.
 */
export type ArrayCallback<
  T extends IterableContainer = IterableContainer,
  R = unknown,
> = (value: T[number], index: number, data: T) => R;

/**
 * `ArrayCallback` as a type predicate; TypeScript has no
 * `ArrayCallback<T, is S>` syntax.
 */
export type ArrayTypePredicate<T extends IterableContainer, S> = (
  value: T[number],
  index: number,
  data: T,
) => value is S;

/**
 * `ArrayCallback` for the data-last overloads of lazy utilities: `pipe` might
 * hand them only a prefix of the input.
 *
 * @see NonEmptyPrefix
 */
export type LazyCallback<T extends IterableContainer, R = unknown> = (
  value: T[number],
  index: number,
  data: LazyData<T>,
) => R;

/**
 * `LazyCallback` as a type predicate.
 */
export type LazyTypePredicate<T extends IterableContainer, S> = (
  value: T[number],
  index: number,
  data: LazyData<T>,
) => value is S;

// `data` must not be an inference site for `T`: when the piped input is generic
// (e.g. `readonly T[]`) and the callback declares `data`, TypeScript can infer
// `T` from it instead of from the input, failing the call. The indexed access is
// deferred while `T` is still being inferred, so nothing is inferred through it,
// and it resolves to `NonEmptyPrefix<T>` once `T` is fixed. Indexing around
// `NonEmptyPrefix<T>`, rather than passing a deferred `T` into it, halves the
// extra type-checking work. `NoInfer` doesn't fit: the native one leaves a
// `NoInfer<...>` wrapper in `data`'s type for union inputs, and the polyfill our
// build ships (for TypeScript before 5.4) either doesn't block this inference
// or breaks `data`'s type.
// TODO [>2]: Once the minimum supported TypeScript version is 5.4 or later, move `Readonly` inside the indexed access (`{ 0: Readonly<NonEmptyPrefix<T>> }[T extends unknown ? 0 : never]`): it's cheaper still, but doesn't block the inference before 5.4.
type LazyData<T extends IterableContainer> = Readonly<
  { 0: NonEmptyPrefix<T> }[T extends unknown ? 0 : never]
>;

/**
 * The callback for each enumerable string-keyed entry of an object, the ones
 * `Object.entries` lists.
 */
export type ObjectCallback<T extends object = object, R = unknown> = (
  value: EnumerableStringKeyedValueOf<T>,
  key: EnumerableStringKeyOf<T>,
  data: T,
) => R;

/**
 * `ObjectCallback` as a type predicate.
 */
export type ObjectTypePredicate<
  T extends object,
  S extends EnumerableStringKeyedValueOf<T>,
> = (
  value: EnumerableStringKeyedValueOf<T>,
  key: EnumerableStringKeyOf<T>,
  data: T,
) => value is S;
