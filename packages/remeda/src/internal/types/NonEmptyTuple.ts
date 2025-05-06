import type { IfNever } from "type-fest";
import type { CoercedArray } from "./CoercedArray";
import type { IterableContainer } from "./IterableContainer";
import type { TupleParts } from "./TupleParts";

export type NonEmptyTuple<T extends IterableContainer> =
  TupleParts<T>["required"] extends readonly []
    ? TupleParts<T>["suffix"] extends readonly []
      ? NonEmptyOptionals<TupleParts<T>["optional"], TupleParts<T>["item"]>
      : T
    : T;

type NonEmptyOptionals<T extends IterableContainer, Item> = T extends readonly [
  infer Head,
  ...infer Tail,
]
  ?
      | [Head, ...Partial<Tail>, ...CoercedArray<Item>]
      | NonEmptyOptionals<Tail, Item>
  : IfNever<Item, never, [Item, ...Array<Item>]>;
