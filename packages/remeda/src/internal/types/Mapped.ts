import type { IterableContainer } from "./IterableContainer";

export type Mapped<T extends IterableContainer, K> = {
  -readonly [P in keyof T]: K;
};
