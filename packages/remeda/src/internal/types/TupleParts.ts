import type { Or, Simplify } from "type-fest";
import type { IterableContainer } from "./IterableContainer";
import type { RemedaTypeError } from "./RemedaTypeError";

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
export type TupleParts<
  T extends IterableContainer,
  Prefix extends Array<unknown> = [],
> = T extends readonly [infer Head, ...infer Tail]
  ? // The first step to building the tuple parts is to remove the extract (and
    // remove) the required prefix from the tuple.
    TupleParts<Tail, [...Prefix, Head]>
  : // We wrap everything with `Simplify` to flatten all the intersections we
    // use to construct the type.
    Simplify<
      {
        /**
         * A fixed tuple that defines the part of the tuple where all its
         * elements are required. This will always be the first part of the
         * tuple and will never contain any optional or rest elements. When the
         * array doesn't have a required part this will be an empty tuple
         * (`[]`).
         */
        required: Prefix;
      } & TuplePartsWithoutRequired<T>
    >;

// This is an internal type and assumes that the tuple has no required prefix!
type TuplePartsWithoutRequired<
  T extends IterableContainer,
  Suffix extends Array<unknown> = [],
> = T extends readonly [...infer Head, infer Tail]
  ? // Our tuple has no required prefix, now we extract (and remove) the
    // required suffix from the tuple.
    TuplePartsWithoutRequired<Head, [Tail, ...Suffix]>
  : (Suffix extends readonly []
      ? // By definition the tuple can only have an optional part when the
        // suffix is *empty*.
        TuplePartsWithoutFixed<T>
      : // When the suffix is not empty we can skip the optional part and go
        // directly to the rest part.
        { optional: [] } & TuplePartsRest<T>) & {
      /**
       * A *fixed* tuple that defines the part of a tuple **after** a non-never
       * rest parameter. These could never be optional elements, and could
       * never contain another rest element. When the array doesn't have a
       * required part this will be an empty tuple (`[]`).
       */
      suffix: Suffix;
    };

// This is an internal type and assumes that the tuple has no required parts
// (neither prefix nor suffix).
type TuplePartsWithoutFixed<
  T extends IterableContainer,
  Optional extends Array<unknown> = [],
> = T extends readonly [(infer Head)?, ...infer Tail]
  ? // Optional elements behave differently than required ones, and TypeScript
    // has a hard time telling which is which based on inference alone. This
    // requires we do additional checks on the inferred types in order to
    // determine if the optional part has been fully extracted yet or not.
    Or<
      // The first check is obvious and allows us to stop the recursion when
      // dealing with tuples that don't have a rest element.
      T extends readonly [] ? true : false,
      // The second check is to catch cases where T is just an array (e.g.
      // `string[]`).
      Array<T[number]> extends Tail ? true : false
    > extends true
    ? {
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
      } & TuplePartsRest<T>
    : TuplePartsWithoutFixed<Tail, [...Optional, Head | undefined]>
  : RemedaTypeError<
      "TupleParts",
      "Unexpected tuple shape",
      {
        type: never;
        metadata: T;
      }
    >;

// This is an internal type and assumes that the tuple is either an empty tuple
// `[]` or a simple array, all other parts of the tuple should be stripped
// before using it.
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
