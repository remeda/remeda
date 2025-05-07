import type { CoercedArray } from "./CoercedArray";
import type { IterableContainer } from "./IterableContainer";
import type { TupleParts } from "./TupleParts";

export type ConditionalArray<
  T extends IterableContainer,
  Condition,
> = Condition extends unknown
  ? [
      ...ConditionalTuple<TupleParts<T>["required"], Condition>,
      ...Partial<ConditionalTuple<TupleParts<T>["optional"], Condition>>,
      ...CoercedArray<CommonCore<TupleParts<T>["item"], Condition>>,
      ...ConditionalTuple<TupleParts<T>["suffix"], Condition>,
    ]
  : never;

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

type CommonCore<A, B> = A extends B
  ? Extract<A, B>
  : B extends A
    ? Extract<B, A>
    : never;
