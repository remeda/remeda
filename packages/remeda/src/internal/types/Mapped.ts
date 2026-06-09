import type { IterableContainer } from "./IterableContainer";

export type Mapped<T extends IterableContainer, K> = T[number][] extends T
  ? // In rare cases TypeScript can't infer the exact shape of the array but can
    // still infer it's a simple array. For those cases TypeScript would fail to
    // remap the array, resulting in a broken type. To circumvent this we can
    // fallback to a simpler type if we know that TypeScript would treat it as
    // such anyway. (https://github.com/remeda/remeda/issues/1364)
    K[]
  : // Otherwise we use a mapped type to preserve the original shape of the
    // input.
    { -readonly [P in keyof T]: K };
