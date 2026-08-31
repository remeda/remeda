import type { IsAny, IsNever, Primitive } from "type-fest";
import type { StrictFunction } from "./StrictFunction";

type CanIntersectOptions = {
  /**
   * Whether two objects that share no keys should be treated as disjoint.
   *
   * This allows us some flexibility in supporting duck-typed types which might
   * not represent fully the runtime shape (e.g., when considering larger
   * objects via the "lens" of a specific interface it implements). This is
   * important for `filter`-like functions where we want to re-shape the input
   * on a per-item basis.
   */
  readonly requireSharedKey?: boolean;
};

/**
 * A best-effort common subtype of T0 and T1
 * (`CommonSubtype<T0, T1> extends T0` and `CommonSubtype<T0, T1> extends T1`);
 * similar to the built-in `Extract` but allows either T0 or T1 to be wider than
 * the other. Types we can prove are disjoint result in `never`; incomparable
 * types that we can't prove either way fall back to their intersection.
 *
 * The type should be used instead of the intersection operator (`&`) because
 * TypeScript doesn't reduce most disjoint intersections to `never`.
 */
export type CommonSubtype<
  T0,
  T1,
  Options extends CanIntersectOptions = { requireSharedKey: false },
> =
  IsAny<T0> extends true
    ? T1
    : T0 extends T1
      ? T0
      : T1 extends T0
        ? T1
        : CanIntersect<T0, T1, Options> extends true
          ? T0 & T1
          : never;

/**
 * Whether intersecting the two types is worth doing at all, or whether the
 * result would be junk we should reduce to `never` ourselves. Both params are
 * already narrowed to a single union member by the conditionals in
 * `CommonSubtype`, so neither distributes again here.
 */
type CanIntersect<
  T0,
  T1,
  Options extends CanIntersectOptions,
> = T0 extends Primitive
  ? T1 extends Primitive
    ? // When both types are primitives it is safe to intersect them because
      // TypeScript would reduce them to `never` implicitly for most cases. Only
      // template string literals would remain "unresolved", but we can't prove
      // if they are disjoint or not so it's a better outcome than `never`.
      true
    : false
  : T1 extends Primitive
    ? // The previous case catches when T0 is branded/tagged; but we need this
      // case when T1 is branded/tagged for symmetry.
      false
    : HasMeaningfulProps<T0> extends true
      ? HasMeaningfulProps<T1> extends true
        ? Options["requireSharedKey"] extends true
          ? HaveCommonProps<T0, T1>
          : true
        : false
      : false;

/**
 * JavaScript defines `object`s as pretty much everything but primitives, which
 * includes arrays and functions which behave differently and have different
 * semantics when inspecting their "props".
 */
type HasMeaningfulProps<T> = T extends object
  ? T extends readonly unknown[]
    ? false
    : T extends StrictFunction
      ? false
      : true
  : false;

/**
 * Incomparable objects might still have a common refinement: they might share
 * some props while each having distinct ones too (e.g.,
 * `{ a: string; b: number }` and `{ b: number; c: boolean }`), or a shared
 * prop might be wider in one of them (e.g., `{ a: "cat" | "dog"; b: number }`
 * and `{ a: "cat" }`). We take the intersection of the two objects, but only
 * when we know it isn't empty, which we approximate by them sharing at least
 * one key.
 */
type HaveCommonProps<T0, T1> =
  IsNever<keyof T0 & keyof T1> extends true ? false : true;
