import type { IsNever } from "type-fest";

// TODO [type-fest@>=5]: This type will be exported in v5. We don't need to re-implement and export it here.
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
