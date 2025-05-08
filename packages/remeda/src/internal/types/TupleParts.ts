import type { IterableContainer } from "./IterableContainer";
import type { RemedaTypeError } from "./RemedaTypeError";

/**
 * Takes a tuple and returns the types that make up its parts. These parts
 * follow TypeScript's only supported format for arrays/tuples:
 * [<required>, <optional>, ...<rest>[], <suffix>].
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
  _Required extends Array<unknown> = [],
  _Optional extends Array<unknown> = [],
  _Suffix extends Array<unknown> = [],
> = T extends readonly [infer Head, ...infer Tail]
  ? // Build the `required` part:
    TupleParts<Tail, [..._Required, Head], _Optional, _Suffix>
  : T extends readonly [...infer Head, infer Tail]
    ? // Build the `suffix` part:
      TupleParts<Head, _Required, _Optional, [Tail, ..._Suffix]>
    : // At this point our tuple doesn't have the `required` part or the
      // `suffix` part. We now need to check if it has an `optional` part by
      // making everything required and seeing if anything in the type changed.
      T extends Required<T>
      ? // The tuple has been reduced to a trivial array, extract it's item type
        // and return the results.
        T extends ReadonlyArray<infer Item>
        ? {
            /**
             * A *trivial* tuple that defines the part of the tuple where all
             * its elements are required. This will always be the first part of
             * the  tuple and will never contain any optional or rest elements.
             * When the array doesn't have a required part this will be an
             * empty tuple (`[]`).
             */
            required: _Required;

            /**
             * A *trivial* tuple that defines the part of a tuple where all its
             * elements are suffixed with the optional operator (`?`); but with
             * the optional operator removed (e.g. `[string?]` would be
             * represented as `[string]`). These elements can only follow the
             * `required` part (which could be empty).
             * To add optional operator back wrap the result with the built-in
             * `Partial` type.
             * When the array doesn't have a required part this will be an
             * empty tuple (`[]`).
             *
             * @example Partial<TupleParts<T>["optional"]>
             */
            optional: _Optional;

            /**
             * The type for the rest parameter of the tuple, if any. Unlike the
             * other parts of the tuple, this is a single type and not
             * represented as an array/tuple. When a tuple doesn't have a rest
             * element, this will be `never`. To convert this to a matching
             * array type that could be spread into a new type use
             * the `CoercedArray` type which handles the `never` case correctly.
             *
             * @example CoercedArray<TupleParts<T>["item"]>
             */
            item: Item;

            /**
             * A *trivial* tuple that defines the part of a tuple **after** a
             * non-never rest parameter. These could never be optional
             * elements, and could never contain another rest element.
             * When the array doesn't have a required part this will be an
             * empty tuple (`[]`).
             */
            suffix: _Suffix;
          }
        : never
      : T extends readonly [(infer OptionalHead)?, ...infer Tail]
        ? // Build the `optional` part:
          TupleParts<Tail, _Required, [..._Optional, OptionalHead], _Suffix>
        : RemedaTypeError<"TupleParts", "Unexpected tuple shape!", T>;

/**
 * ! **DO NOT USE THIS IN NEW CODE** !
 *
 * @deprecated The tuple prefix contains both optional and required elements and
 * doesn't differentiate between them. Most types would require different logic
 * for the optional part than the required part.
 */
export type TuplePrefix<T extends IterableContainer> = [
  ...TupleParts<T>["required"],
  ...Partial<TupleParts<T>["optional"]>,
];
