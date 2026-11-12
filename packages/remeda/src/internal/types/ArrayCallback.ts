import type { IterableContainer } from "./IterableContainer";

/**
 * @see LazyCallback The data-last overloads of lazy utilities use it instead,
 * because `pipe` might hand them only a prefix of the input.
 */
export type ArrayCallback<
  T extends IterableContainer = IterableContainer,
  R = unknown,
> = (value: T[number], index: number, data: T) => R;

/**
 * Helper type for type predicates (because TypeScript doesn't support a
 * syntax like `ArrayCallback<T, is S>`).
 */
export type ArrayTypePredicate<
  T extends IterableContainer = IterableContainer,
  R = unknown,
> = (value: T[number], index: number, data: T) => value is R;
