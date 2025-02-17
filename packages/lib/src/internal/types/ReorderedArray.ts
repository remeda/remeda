import type { IterableContainer } from "./IterableContainer";

export type ReorderedArray<T extends IterableContainer> = {
  -readonly [P in keyof T]: T[number];
};
