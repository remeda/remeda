import type { IsNever } from "type-fest";

// TODO: This type is copied from type-fest because it isn't exported. It's part of the "internal" types. We should check back in a while to see if this type is added to the public offering.
export type IsUnion<T> = InternalIsUnion<T>;

type InternalIsUnion<T, U = T> = (
  IsNever<T> extends true
    ? false
    : // eslint-disable-next-line @typescript-eslint/no-explicit-any
      T extends any
      ? [U] extends [T]
        ? false
        : true
      : never
) extends infer Result
  ? // that means `T` has at least two types and it's a union type,
    // so we will return `true` instead of `boolean`.
    boolean extends Result
    ? true
    : Result
  : never; // Should never happen
