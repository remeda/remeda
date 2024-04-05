import { type IsNever } from "type-fest";

// Type-fest don't export this type so we need to redefine it, I don't know why
// they don't export it, it's great!
// TODO [2024-10-04]: Check if type-fest now export this type.
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
  ? // In some cases `Result` will return `false | true` which is `boolean`,
    // that means `T` has at least two types and it's a union type,
    // so we will return `true` instead of `boolean`.
    boolean extends Result
    ? true
    : Result
  : never; // Should never happen
