import type { IsAny, IsNever } from "type-fest";
import type { Narrowed } from "./Narrowed";

/**
 * Whether an array item satisfies a type-predicate's condition: `"always"`
 * when every value of the item does, `"never"` when no value could, and
 * `"maybe"` when only some values do, in which case the item narrows to
 * `Narrowed<Item, Condition>` when it matches.
 */
export type ItemMatch<Item, Condition> =
  IsAny<Item> extends true
    ? // `any` would satisfy the `[Item] extends [Condition]` check below, but
      // it isn't a guaranteed match; `Narrowed` already refines it down to the
      // condition itself, so it behaves like any other item that might match.
      "maybe"
    : // The check is wrapped in tuples so that it doesn't distribute over
      // union items; a union item is checked as a whole.
      [Item] extends [Condition]
      ? "always"
      : IsNever<Narrowed<Item, Condition>> extends true
        ? "never"
        : "maybe";
