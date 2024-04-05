import type { IsNever } from "./is-never";
import type { Primitive } from "./primitive";

export type IsNotFalse<T extends boolean> = [T] extends [false] ? false : true;

export type IsPrimitive<T> = [T] extends [Primitive] ? true : false;

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
