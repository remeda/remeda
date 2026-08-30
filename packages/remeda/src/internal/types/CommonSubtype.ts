import type { IsAny, IsNever } from "type-fest";

/**
 * A best-effort common subtype of T0 and T1
 * (`CommonSubtype<T0, T1> extends T0` and `CommonSubtype<T0, T1> extends T1`);
 * similar to the built-in `Extract` but allows either T0 or T1 to be wider than
 * the other. Incomparable types are treated as disjoint (resulting in `never`)
 * unless they are both strings, or both non-array objects sharing at least one
 * key, which fall back to their intersection.
 *
 * The type should be used instead of the intersection operator (`&`) because
 * TypeScript doesn't reduce most disjoint intersections to `never`.
 */
export type CommonSubtype<T0, T1> =
  IsAny<T0> extends true
    ? // `any` extends and doesn't extend any type at the same time, resulting
      // in a union of both branches, which is not semantically correct for
      // this type. The opposite case where T1 is `any` would be handled
      // correctly implicitly when we check if T0 extends T1 because all types
      // extend `any`.
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
    ? // We only reach here if both strings are disjoint string literals, or
      // template literals, or are branded/tagged. TypeScript will infer the
      // intersection of disjoint literals as `never`, but for template strings
      // it stops short of semantically analyzing the templates and returns the
      // intersection as-is; this is the best result we can return that would
      // still keep our type useful for strings.
      T0 & T1
    : never
  : T1 extends string
    ? // Mirror of the string check above: without it a branded/tagged string
      // in the T1 position would fall through to the object branch (a
      // primitive-object intersection is a non-array object sharing
      // `String`'s keys) and produce an inhabited intersection instead of
      // `never`.
      never
    : IsNonArrayObject<T0> extends true
      ? IsNonArrayObject<T1> extends true
        ? // Incomparable objects might still have a common refinement: they might
          // share some props while each having distinct ones too (e.g.,
          // `{ a: string; b: number }` and `{ b: number; c: boolean }`), or a
          // shared prop might be wider in one of them (e.g.,
          // `{ a: "cat" | "dog"; b: number }` and `{ a: "cat" }`). We take the
          // intersection of the two objects, but only when we know it isn't
          // empty, which we approximate by them sharing at least one key.
          HaveCommonProps<T0, T1> extends true
          ? T0 & T1
          : never
        : never
      : never;

// Arrays are objects, but the shared-key heuristic breaks down for them:
// every array shares `length` and the array methods with all other arrays (and
// with many objects), so it would bless bogus intersections like
// `string[] & number[]`.
type IsNonArrayObject<T> = T extends object
  ? T extends readonly unknown[]
    ? false
    : true
  : false;

type HaveCommonProps<T0, T1> =
  IsNever<keyof T0 & keyof T1> extends true ? false : true;
