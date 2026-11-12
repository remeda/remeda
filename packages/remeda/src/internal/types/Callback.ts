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
  data: Readonly<NonEmptyPrefix<T>>,
) => R;

/**
 * `LazyCallback` as a type predicate.
 */
export type LazyTypePredicate<T extends IterableContainer, S> = (
  value: T[number],
  index: number,
  data: Readonly<NonEmptyPrefix<T>>,
) => value is S;

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
