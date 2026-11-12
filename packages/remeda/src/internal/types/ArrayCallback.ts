import type { IterableContainer } from "./IterableContainer";

/**
 * @see LazyCallback The data-last overloads of lazy utilities use it instead,
 * because `pipe` might hand them only a prefix of the input.
 */
export type ArrayCallback<
  T extends IterableContainer = IterableContainer,
  R = unknown,
> = (value: T[number], index: number, data: T) => R;
