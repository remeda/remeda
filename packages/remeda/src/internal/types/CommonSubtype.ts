import type { IsAny, IsNever } from "type-fest";
import type { StrictFunction } from "./StrictFunction";

type CanIntersectOptions = {
  /**
   * When using the subtype for **filtering** (e.g., `filter`) the subtype
   * should be stricter so we don't consider disjoint objects as plausible
   * (because  TypeScript's duck-typing would actually consider them valid);
   * But when using the subtype for **selection** (e.g., `find`) the subtype
   * should be narrower to allow for matches on props that are missing in the
   * type but would be present in the runtime object.
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
> = T0 extends string
  ? T1 extends string
    ? // We only reach here if both strings are disjoint string literals, or
      // template literals, or are branded/tagged. TypeScript doesn't compare
      // two template literals against each other, so those come back as-is;
      // this is the best result we can return that would still keep our type
      // useful for strings.
      true
    : false
  : T1 extends string
    ? // Mirror of the string check above: without it a branded/tagged string
      // in the T1 position would fall through to the props check (a
      // primitive-object intersection has meaningful props, sharing
      // `String`'s keys) and produce an inhabited intersection instead of
      // `never`.
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
