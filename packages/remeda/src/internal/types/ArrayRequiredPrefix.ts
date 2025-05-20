import type {
  And,
  GreaterThan,
  IsEqual,
  IsLiteral,
  IsNever,
  ReadonlyTuple,
} from "type-fest";
import type { CoercedArray } from "./CoercedArray";
import type { RemedaTypeError } from "./RemedaTypeError";
import type { TupleParts } from "./TupleParts";
import type { IterableContainer } from "./IterableContainer";
import type { ClampedIntegerSubtract } from "./ClampedIntegerSubtract";

export type ArrayRequiredPrefix<T extends IterableContainer, N extends number> =
  IsLiteral<N> extends true
    ? // Distribute T to support union types
      T extends unknown
      ? ClampedIntegerSubtract<
          N,
          [...TupleParts<T>["required"], ...TupleParts<T>["suffix"]]["length"]
        > extends infer Remainder extends number
        ? Remainder extends 0
          ? // The array already has enough required items in it's prefix or
            // suffix so it satisfies the requirement without modifications.
            T
          : And<
                // We need more items than the optional part of the tuple can
                // provide
                GreaterThan<Remainder, TupleParts<T>["optional"]["length"]>,
                // ...and there is no rest element we can use
                IsNever<TupleParts<T>["item"]>
              > extends true
            ? RemedaTypeError<
                "ArrayRequiredPrefix",
                "The input tuple cannot satisfy the minimum",
                {
                  type: never;
                  metadata: [T, N];
                }
              >
            : // This is the crux of the type, there are two important things to
              // note here:
              // 1. We need to make sure we don't remove the readonly modifier
              // from the output so we copy it from the input, if it exists.
              WithSameReadonly<
                T,
                [
                  // We recreate the array by largely copying the input tuple to
                  // the output as-is, but we make two modifications to it:
                  ...TupleParts<T>["required"],

                  // We first make optional items required, we do this as many
                  // times as needed to fulfil the Remainder amount. If we have
                  // leftover optional items they are added to the output as
                  // they were originally defined as optional.
                  ...OptionalTupleRequiredPrefix<
                    TupleParts<T>["optional"],
                    Remainder
                  >,

                  // Additionally, if we still haven't satisfied the Remainder
                  // amount we create "new" items in the output array by adding
                  // the item type of the rest element.
                  ...ReadonlyTuple<
                    TupleParts<T>["item"],
                    ClampedIntegerSubtract<
                      Remainder,
                      TupleParts<T>["optional"]["length"]
                    >
                  >,

                  // We then get back to copying the input tuple to the output,
                  // we add the rest element itself, and the required suffix.
                  ...CoercedArray<TupleParts<T>["item"]>,
                  ...TupleParts<T>["suffix"],
                ]
              >
        : RemedaTypeError<
            "ArrayRequiredPrefix",
            "Remainder didn't compute to a number?!",
            {
              type: never;
              metadata: [T, N];
            }
          >
      : RemedaTypeError<
          "ArrayRequiredPrefix",
          "Failed to distribute union?!",
          {
            type: never;
            metadata: T;
          }
        >
    : RemedaTypeError<
        "ArrayRequiredPrefix",
        "Only literal minimums are supported!",
        {
          type: never;
          metadata: N;
        }
      >;

// A trivial utility that makes the output Readonly if T is also readonly.
// Notice that we make the decision based on T, but output the type based on U.
type WithSameReadonly<Source, Destination> =
  IsEqual<Source, Readonly<Source>> extends true
    ? Readonly<Destination>
    : Destination;

// Instead of using type-fest utilities to compute the index for pivoting, and
// then using ArraySlice twice and spreading the result; we implement a much
// simpler iterative solution to make the beginning of the optional part
// required and the rest of it optional.
type OptionalTupleRequiredPrefix<
  T extends Array<unknown>,
  N,
  Prefix extends Array<unknown> = [],
> = Prefix["length"] extends N
  ? // This case happens when N is smaller than the number of items in T, it
    // means that Prefix contains the required part of the optional part, and
    // anything items that haven't been processed yet need to be added to the
    // prefix as optional items.
    [...Prefix, ...Partial<T>]
  : T extends readonly [infer Head, ...infer Rest]
    ? OptionalTupleRequiredPrefix<Rest, N, [...Prefix, Head]>
    : // This case happens when N is equal to or larger than the number of
      // items in T, it means that we made all items required and we don't have
      // any remainder that needs to be spread as optional items.
      Prefix;
