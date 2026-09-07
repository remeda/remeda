import type { IterableContainer } from "./IterableContainer";
import type { NonEmptyPrefix } from "./NonEmptyPrefix";

/**
 * Helper type for lazy data-last callbacks.
 *
 * @see NonEmptyPrefix
 */
export type LazyCallback<T extends IterableContainer, R> = (
  value: T[number],
  index: number,
  data: Readonly<NonEmptyPrefix<T>>,
) => R;

/**
 * Helper type for lazy data-last type predicates (because TypeScript doesn't
 * support the syntax `LazyCallback<T, is S>`).
 *
 * @see NonEmptyPrefix
 */
export type LazyTypePredicate<T extends IterableContainer, S> = (
  value: T[number],
  index: number,
  data: Readonly<NonEmptyPrefix<T>>,
) => value is S;
