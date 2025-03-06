import type { IterableElement } from "type-fest";
import type { IterableContainer } from "./IterableContainer";

export type ArrayMethodCallback<T extends Iterable<unknown>, R = unknown> = (
  item: IterableElement<T>,
  index: number,
  data: ArrayMethodCallbackDataArg<T>,
) => R;

export type ArrayMethodCallbackDataArg<T extends Iterable<unknown>> = [
  T,
] extends [IterableContainer]
  ? T
  : ReadonlyArray<IterableElement<T>>;
