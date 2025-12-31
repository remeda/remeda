import { t as IterableContainer } from "./IterableContainer-Bil0kSL1.cjs";
import { t as TupleParts } from "./TupleParts-CqxD-ozC.cjs";
import { t as CoercedArray } from "./CoercedArray-DlHZGNXy.cjs";
import { IsNever } from "type-fest";

//#region src/internal/types/FilteredArray.d.ts
type FilteredArray<T extends IterableContainer, Condition> = T extends unknown ? [...FilteredFixedTuple<TupleParts<T>["required"], Condition>, ...FilteredFixedTuple<TupleParts<T>["optional"], Condition>, ...CoercedArray<SymmetricRefine<TupleParts<T>["item"], Condition>>, ...FilteredFixedTuple<TupleParts<T>["suffix"], Condition>] : never;
/**
 * The real logic for filtering an array is done on fixed tuples (as those make
 * up the required prefix, the optional prefix, and the suffix of the array).
 */
type FilteredFixedTuple<T, Condition, Output extends Array<unknown> = []> = T extends readonly [infer Head, ...infer Rest] ? FilteredFixedTuple<Rest, Condition, Head extends Condition ? [...Output, Head] : Head | Condition extends object ? Output : Condition extends Head ?
// But for any other type (mostly primitives), if the condition
Output | [...Output, Condition] : Output> : Output;
/**
 * This type is similar to the built-in `Extract` type, but allows us to have
 * either Item or Condition be narrower than the other.
 */
type SymmetricRefine<Item, Condition> = Item extends Condition ? Item : Condition extends Item ? Condition : RefineIncomparable<Item, Condition>;
/**
 * When types are incomparable (neither one extends the other) they might still
 * have a common refinement; this can happen when two objects share one or more
 * prop while both having distinct props too (e.g., `{ a: string; b: number }`
 * and `{ b: number, c: boolean }`), or when a prop is wider in one of them,
 * allowing more value types than the other (e.g.,
 * `{ a: "cat" | "dog", b: number }` and `{ a: "cat" }`).
 */
type RefineIncomparable<Item, Condition> = Item extends Record<PropertyKey, unknown> ? Condition extends Record<PropertyKey, unknown> ? IsNever<Extract<keyof Item, keyof Condition>> extends true ? never : Item & Condition : never : never;
//#endregion
export { FilteredArray as t };
//# sourceMappingURL=FilteredArray-Ci4z7F_Y.d.cts.map