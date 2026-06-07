import type { IsAny, IsNever } from "type-fest";

/**
 * An extension of Extract for type predicates which falls back to the base
 * in order to narrow the `unknown` case.
 *
 * @example
 *   function isMyType<T>(data: T | MyType): data is NarrowedTo<T, MyType> { ... }
 */
export type NarrowedTo<T, Base> =
  IsNever<Extract<T, Base>> extends true
    ? Base
    : IsAny<T> extends true
      ? Base
      : Extract<T, Base>;
