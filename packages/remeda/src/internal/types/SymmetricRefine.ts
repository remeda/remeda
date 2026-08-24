import type { IsNever } from "type-fest";

/**
 * This type is similar to the built-in `Extract` type, but allows us to have
 * either Item or Condition be narrower than the other.
 */
export type SymmetricRefine<Item, Condition> = Item extends Condition
  ? Item
  : Condition extends Item
    ? Condition
    : RefineIncomparable<Item, Condition>;

/**
 * When types are incomparable (neither one extends the other) they might still
 * have a common refinement; this can happen when two objects share one or more
 * prop while both having distinct props too (e.g., `{ a: string; b: number }`
 * and `{ b: number, c: boolean }`), or when a prop is wider in one of them,
 * allowing more value types than the other (e.g.,
 * `{ a: "cat" | "dog", b: number }` and `{ a: "cat" }`).
 */
type RefineIncomparable<Item, Condition> =
  IsRealObject<Item> extends true
    ? IsRealObject<Condition> extends true
      ? // We take the (symmetric) intersection of the two objects; but only
        // when we know it isn't empty. This would only happen if they share at
        // least one key.
        IsNever<Extract<keyof Item, keyof Condition>> extends true
        ? never
        : Item & Condition
      : never
    : never;

// Arrays are objects but they don't behave like ones because they have
// different `extend` and `keyof` semantics.
type IsRealObject<T> = T extends object
  ? T extends readonly unknown[]
    ? false
    : true
  : false;
