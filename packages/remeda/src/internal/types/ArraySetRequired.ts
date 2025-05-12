import type {
  And,
  GreaterThan,
  IsLiteral,
  IsNever,
  ReadonlyTuple,
} from "type-fest";
import type { CoercedArray } from "./CoercedArray";
import type { RemedaTypeError } from "./RemedaTypeError";
import type { TupleParts } from "./TupleParts";
import type { IterableContainer } from "./IterableContainer";

export type ArraySetRequired<
  T extends IterableContainer,
  MinRequiredItems extends number,
> =
  IsLiteral<MinRequiredItems> extends true
    ? // Distribute T to support union types
      T extends unknown
      ? SubtractNonNegativeIntegers<
          SubtractNonNegativeIntegers<
            MinRequiredItems,
            TupleParts<T>["required"]["length"]
          >,
          TupleParts<T>["suffix"]["length"]
        > extends infer Remainder extends number
        ? Remainder extends 0
          ? // The array already has enough required items in it's prefix or suffix
            // so it satisfies the requirement without modifications.
            T
          : And<
                // We need more items than the optional part of the tuple can provide
                GreaterThan<Remainder, TupleParts<T>["optional"]["length"]>,
                // ...and there is no rest element we can use
                IsNever<TupleParts<T>["item"]>
              > extends true
            ? RemedaTypeError<
                "ArraySetRequired",
                "The input tuple cannot satisfy the minimum",
                [T, MinRequiredItems]
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
                  // leftover optional items they are added to the output as they
                  // were originally defined as optional.
                  ...OptionalTupleSetRequired<
                    TupleParts<T>["optional"],
                    Remainder
                  >,

                  // Additionally, if we still haven't satisfied the Remainder
                  // amount we create "new" items in the output array by adding
                  // the item type of the rest element.
                  ...ReadonlyTuple<
                    TupleParts<T>["item"],
                    SubtractNonNegativeIntegers<
                      Remainder,
                      TupleParts<T>["optional"]["length"]
                    >
                  >,

                  // We then get back to copying the input tuple to the output, we
                  // add the rest element itself, and the required suffix.
                  ...CoercedArray<TupleParts<T>["item"]>,
                  ...TupleParts<T>["suffix"],
                ]
              >
        : RemedaTypeError<
            "ArraySetRequired",
            "Remainder didn't compute to a number?!",
            [T, MinRequiredItems]
          >
      : RemedaTypeError<"ArraySetRequired", "Failed to distribute union?!", T>
    : RemedaTypeError<
        "ArraySetRequired",
        "Only literal minimums are supported!",
        MinRequiredItems
      >;

type WithSameReadonly<T, U> = Readonly<T> extends T ? Readonly<U> : U;

type SubtractNonNegativeIntegers<
  N,
  Subtrahend,
  SubtrahendBag extends Array<unknown> = [],
  OutputBag extends Array<unknown> = [],
> = [...SubtrahendBag, ...OutputBag]["length"] extends N
  ? OutputBag["length"]
  : SubtrahendBag["length"] extends Subtrahend
    ? SubtractNonNegativeIntegers<
        N,
        Subtrahend,
        SubtrahendBag,
        [...OutputBag, unknown]
      >
    : SubtractNonNegativeIntegers<
        N,
        Subtrahend,
        [...SubtrahendBag, unknown],
        OutputBag
      >;

type OptionalTupleSetRequired<
  T extends Array<unknown>,
  Min,
  _Output extends Array<unknown> = [],
> = _Output["length"] extends Min
  ? [..._Output, ...Partial<T>]
  : T extends [infer Head, ...infer Rest]
    ? OptionalTupleSetRequired<Rest, Min, [..._Output, Head]>
    : _Output;
