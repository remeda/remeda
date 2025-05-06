import type { IterableContainer } from "./IterableContainer";
import type { TupleParts } from "./TupleParts";

export type ConditionalArray<T extends IterableContainer, Condition> = [
  ...ConditionalTuple<TupleParts<T>["required"], Condition>,
  ...Partial<ConditionalTuple<TupleParts<T>["optional"], Condition>>,
  ...(TupleParts<T>["item"] & Condition extends never
    ? []
    : Array<TupleParts<T>["item"] & Condition>),
  ...ConditionalTuple<TupleParts<T>["suffix"], Condition>,
];

type ConditionalTuple<
  T,
  Condition,
  Output extends IterableContainer = [],
> = T extends readonly [infer Head, ...infer Rest]
  ? ConditionalTuple<
      Rest,
      Condition,
      Head extends Condition ? [...Output, Head] : Output
    >
  : Output;
