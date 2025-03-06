import type { IterableContainer } from "./IterableContainer";

export type Mapped<T extends Iterable<unknown>, K> = [T] extends [
  IterableContainer,
]
  ? {
      -readonly [P in keyof T]: K;
    }
  : Array<K>;
