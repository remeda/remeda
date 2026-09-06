import type { IsNever } from "type-fest";
import type { Narrowed } from "./Narrowed";

/**
 * Checks if `T` is assignable to `Condition` and in what way. Takes a `Cases`
 * object which defines how each branch should be used when used within other
 * types, as a types switch-case statement.
 *
 * `full` - the type is fully assignable into the condition.
 * `none` - the type is never assignable to the condition.
 * `partial` - means that there is a common subtype that allows assigning the
 * type through it, based on our semantics for `Narrowed`.
 *
 * This type is useful when matching input types to a provided type-predicate
 * type before applying `Narrowed` to the result.
 *
 * @see FilteredArray
 */
export type Assignability<
  T,
  Condition,
  Cases extends Record<"full" | "partial" | "none", unknown>,
> =
  // The check is wrapped in tuples so that it doesn't distribute over
  // union items; a union item is checked as a whole.
  [T] extends [Condition]
    ? Cases["full"]
    : IsNever<Narrowed<T, Condition>> extends true
      ? Cases["none"]
      : Cases["partial"];
