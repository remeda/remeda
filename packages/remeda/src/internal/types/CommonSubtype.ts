import type { IsAny, IsNever, Primitive } from "type-fest";
import type { StrictFunction } from "./StrictFunction";

/**
 * A best-effort common subtype of T0 and T1
 * (`CommonSubtype<T0, T1> extends T0` and `CommonSubtype<T0, T1> extends T1`);
 * similar to the built-in `Extract` but allows either T0 or T1 to be wider than
 * the other. Types we can prove are disjoint result in `never`; incomparable
 * types that we can't prove either way fall back to their intersection.
 *
 * The type should be used instead of the intersection operator (`&`) because
 * TypeScript doesn't reduce most disjoint intersections to `never`.
 *
 * Use `StrictCommonSubtype` when two objects sharing no keys should be treated
 * as disjoint rather than intersected.
 */

export type CommonSubtype<T0, T1, RequireSharedKey extends boolean = false> =
  IsAny<T0> extends true
    ? T1
    : T0 extends T1
      ? T0
      : T1 extends T0
        ? T1
        : CanIntersect<T0, T1, RequireSharedKey> extends true
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
  RequireSharedKey extends boolean,
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
        ? RequireSharedKey extends true
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
