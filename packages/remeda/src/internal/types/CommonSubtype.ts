import type { IsAny, IsNever } from "type-fest";

/**
 * Find the widest subtype which extends both T0 and T1:
 * (`CommonSubtype<T0, T1> extends T0` and `CommonSubtype<T0, T1> extends T1`);
 * similar to the built-in `Extract` but allows either T0 or T1 to be wider than
 * the other.
 */
export type CommonSubtype<T0, T1> =
  IsAny<T0> extends true
    ? // `any` extends and doesn't extend any type at the same time, resulting
      // in a union of both branches, which is not semantically correct for
      // this type. The opposite case where T1 is `any` would be handled
      // correctly implicitly when we check if T0 extends T1 because all types
      // extends `any`.
      T1
    : T0 extends T1
      ? T0
      : T1 extends T0
        ? T1
        : // Our types are incomparable (neither one extends the other) but they
          // might still share some common props.
          NonEmptyIntersection<T0, T1>;

type NonEmptyIntersection<T0, T1> = T0 extends string
  ? T1 extends string
    ? // We only reach here if both strings are disjoint string literals or
      // template literals. TypeScript will infer the intersection of disjoint
      // literals as `never`, but for template strings it stops short of
      // semantically analyzing the templates and returns the intersection
      // as-is; this is the best result we can return that would still keep our
      // type useful for strings.
      T0 & T1
    : never
  : IsNonArrayObject<T0> extends true
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
