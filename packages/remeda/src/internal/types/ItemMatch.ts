import type { IsNever } from "type-fest";
import type { Narrowed } from "./Narrowed";

/**
 * Whether an array item satisfies a type-predicate's condition: `"always"`
 * when every value of the item does, `"never"` when no value could, and
 * `"maybe"` when only some values do, in which case the item narrows to
 * `Narrowed<Item, Condition>` when it matches.
 */
export type ItemMatch<Item, Condition> =
  // The check is wrapped in tuples so that it doesn't distribute over
  // union items; a union item is checked as a whole.
  [Item] extends [Condition]
    ? "always"
    : IsNever<Narrowed<Item, Condition>> extends true
      ? "never"
      : "maybe";
