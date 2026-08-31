import type { IsAny, IsNever, Primitive } from "type-fest";
import type { StrictFunction } from "./StrictFunction";

/**
 * A best-effort common subtype of T0 and T1
 * (`CommonSubtype<T0, T1> extends T0` and `CommonSubtype<T0, T1> extends T1`);
 * similar to the built-in `Extract` but allows either T0 or T1 to be wider than
 * the other.
 *
 * The type should be used instead of the intersection operator (`&`) because
 * TypeScript doesn't reduce most disjoint intersections to `never`.
 *
 * Reducing to `never` is a heuristic, and it errs in both directions: pairs we
 * can cheaply rule out are rejected even when a value could inhabit both (two
 * incomparable functions, or two incomparable arrays, which `readonly []`
 * inhabits), and pairs we can't are kept even when they are provably disjoint
 * (`a${string}` and `b${string}` stay an uninhabited intersection).
 *
 * `RequireSharedKey` makes the reduction stricter: two objects with no key in
 * common become `never` instead of being intersected. Leave it off when the
 * result stands for a value that passed a runtime check, where duck typing
 * allows props the declared type doesn't mention.
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
 * and `{ a: "cat" }`). Sharing at least one key is our approximation for the
 * intersection being inhabited; it isn't a proof, but the case it lets through
 * most often is one TypeScript reduces on its own
 * (`{ a: "cat" } & { a: "dog" }` is already `never`).
 */
type HaveCommonProps<T0, T1> =
  IsNever<keyof T0 & keyof T1> extends true ? false : true;
