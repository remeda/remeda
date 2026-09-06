import type { IterableContainer } from "./IterableContainer";
import type { TupleParts } from "./TupleParts";

/**
 * The first element of `T`, or `undefined` when `T` might be empty.
 */
export type First<T extends IterableContainer> =
  TupleParts<T>["required"] extends readonly []
    ? | TupleParts<T>["optional"][number]
      | TupleParts<T>["item"]
      | TupleParts<T>["suffix"][0]
    : TupleParts<T>["required"][0];
