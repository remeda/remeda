import type { IsAny, Primitive } from "type-fest";
import type { StrictFunction } from "./StrictFunction";

/**
 * A wrapper around the built-in intersection operator (`&`) that allows us to
 * reshape the output in cases where TypeScript would leave it broader (`any`)
 * or more vague (see `CanIntersect`) than what we believe is useful. This comes
 * into play when we need to narrow array/tuple items in filtering functions
 * that take type-narrowing predicates (like `filter`, `find`, `partition`,
 * `takeWhile`, etc...), enabling them to accept wider and incomparable types
 * and still refine to useful types.
 */
export type Narrowed<T, Condition> =
  IsAny<T> extends true
    ? Condition
    : T extends Condition
      ? T
      : Condition extends T
        ? Condition
        : CanIntersect<T, Condition> extends true
          ? T & Condition
          : never;

/**
 * We only want to rely on TypeScript's intersection semantics when both types
 * are of the same "kind": either primitives or object-like, for any other kind,
 * or when their kinds are mismatched, we prefer to fallback to `never`
 * explicitly and not their intersection.
 */
type CanIntersect<T0, T1> = T0 extends Primitive
  ? T1 extends Primitive
    ? true
    : false
  : T1 extends Primitive
    ? false
    : IsObjectLike<T0> extends true
      ? IsObjectLike<T1>
      : false;

/**
 * JavaScript defines `object`s as pretty much everything but primitives, which
 * includes arrays and functions that behave differently and have different
 * intersection semantics.
 */
type IsObjectLike<T> = T extends object
  ? T extends readonly unknown[]
    ? false
    : T extends StrictFunction
      ? false
      : true
  : false;
