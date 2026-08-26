import type { IsNever } from "type-fest";

/**
 * Find the common subtype which T0 and T1 both extend. Similar to the built-in
 * `Extract` utility, but allows either T0 or T1 to be wider than the other.
 */
export type CommonSubtype<T0, T1> = T0 extends T1
  ? T0
  : T1 extends T0
    ? T1
    : // Our types are incomparable (neither one extends the other) but they
      // might still share some common props.
      NonEmptyIntersection<T0, T1>;

type NonEmptyIntersection<T0, T1> =
  IsNonArrayObject<T0> extends true
    ? IsNonArrayObject<T1> extends true
      ? HaveCommonProps<T0, T1> extends true
        ? T0 & T1
        : never
      : never
    : never;

// Arrays are objects but they don't behave like ones because they have
// different `extend` and `keyof` semantics.
type IsNonArrayObject<T> = T extends object
  ? T extends readonly unknown[]
    ? false
    : true
  : false;

type HaveCommonProps<T0, T1> =
  IsNever<Extract<keyof T0, keyof T1>> extends true ? false : true;
