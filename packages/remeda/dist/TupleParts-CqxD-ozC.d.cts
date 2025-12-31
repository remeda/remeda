import { t as IterableContainer } from "./IterableContainer-Bil0kSL1.cjs";
import { t as RemedaTypeError } from "./RemedaTypeError-DGiM-bRZ.cjs";
import { Or, Simplify } from "type-fest";

//#region src/internal/types/TupleParts.d.ts

/**
 * Takes a tuple and returns the types that make up its parts. These parts
 * follow TypeScript's only supported format for arrays/tuples:
 * [<required>, <optional>, ...<rest>[], <suffix>].
 *
 * There are some limitations to what shapes TypeScript supports:
 * tuples can only have a suffix if they also have a non-never rest element,
 * **and** tuples cannot have both an optional part and a suffix; this means
 * there are only 10 possible shapes for tuples:
 *   1.  Empty Tuples: `[]`.
 *   2.  Fixed Tuples: `[string, number]`.
 *   3.  Optional Tuples: `[string?, number?]`.
 *   4.  Mixed Tuples: `[string, number?]`.
 *   5.  Arrays: `Array<string>`.
 *   6.  Fixed-Prefix Arrays: `[string, ...Array<string>]`.
 *   7.  Optional-Prefix Arrays: `[number?, ...Array<boolean>]`.
 *   8.  Mixed-Prefix Arrays: `[string, number?, ...Array<boolean>]`.
 *   9.  Fixed-Suffix Arrays: `[...Array<string>, string]`.
 *   10. Fixed-Elements Arrays: `[string, ...Array<string>, string]`.
 *
 * @example [
 *   ...TupleParts<T>["required"],
 *   ...Partial<TupleParts<T>["optional"]>,
 *   ...CoercedArray<TupleParts<T>["item"]>,
 *   ...TupleParts<T>["suffix"],
 * ].
 */
type TupleParts<T extends IterableContainer, Prefix extends Array<unknown> = []> = T extends readonly [infer Head, ...infer Tail] ? TupleParts<Tail, [...Prefix, Head]> : Simplify<{
  /**
   * A fixed tuple that defines the part of the tuple where all its
   * elements are required. This will always be the first part of the
   * tuple and will never contain any optional or rest elements. When the
   * array doesn't have a required part this will be an empty tuple
   * (`[]`).
   */
  required: Prefix;
} & TuplePartsWithoutRequired<T>>;
type TuplePartsWithoutRequired<T extends IterableContainer, Suffix extends Array<unknown> = []> = T extends readonly [...infer Head, infer Tail] ? TuplePartsWithoutRequired<Head, [Tail, ...Suffix]> : (Suffix extends readonly [] ? TuplePartsWithoutFixed<T> :
// When the suffix is not empty we can skip the optional part and go
{
  optional: [];
} & TuplePartsRest<T>) & {
  /**
   * A *fixed* tuple that defines the part of a tuple **after** a non-never
   * rest parameter. These could never be optional elements, and could
   * never contain another rest element. When the array doesn't have a
   * required part this will be an empty tuple (`[]`).
   */
  suffix: Suffix;
};
type TuplePartsWithoutFixed<T extends IterableContainer, Optional extends Array<unknown> = []> = T extends readonly [(infer Head)?, ...infer Tail] ? Or<T extends readonly [] ? true : false, Array<T[number]> extends Tail ? true : false> extends true ? {
  /**
   * A *fixed* tuple that defines the part of a tuple where all its
   * elements are suffixed with the optional operator (`?`); but with
   * the optional operator removed (e.g. `[string?]` would be
   * represented as `[string]`). These elements can only follow the
   * `required` part (which could be empty).
   * To add optional operator back wrap the result with the built-in
   * `Partial` type.
   * When the array doesn't have a required part this will be an empty
   * tuple (`[]`).
   *
   * @example Partial<TupleParts<T>["optional"]>
   */
  optional: Optional;
} & TuplePartsRest<T> : TuplePartsWithoutFixed<Tail, [...Optional, Head | undefined]> : RemedaTypeError<"TupleParts", "Unexpected tuple shape", {
  type: never;
  metadata: T;
}>;
type TuplePartsRest<T extends IterableContainer> = {
  /**
   * The type for the rest parameter of the tuple, if any. Unlike the
   * other parts of the tuple, this is a single type and not
   * represented as an array/tuple. When a tuple doesn't have a rest
   * element, this will be `never`. To convert this to a matching array
   * type that could be spread into a new type use the `CoercedArray`
   * type which handles the `never` case correctly.
   *
   * @example CoercedArray<TupleParts<T>["item"]>
   */
  item: T extends readonly [] ? never : T[number];
};
//#endregion
export { TupleParts as t };
//# sourceMappingURL=TupleParts-CqxD-ozC.d.cts.map