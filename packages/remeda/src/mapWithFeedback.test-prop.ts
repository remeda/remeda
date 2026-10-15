import { fc, test } from "@fast-check/vitest";
import { expect } from "vitest";
import { mapWithFeedback } from "./mapWithFeedback";
import { pipe } from "./pipe";

// Both calling styles read a hole as `undefined`.
const items = fc.oneof(fc.array(fc.anything()), fc.sparseArray(fc.anything()));

test.prop([items, fc.func(fc.integer()), fc.integer()])(
  "data-first and data-last produce the same result",
  (data, reducerOf, initialValue) => {
    // The reducer ignores `data`, which differs between the calling styles on
    // purpose: the whole input data-first, the items so far in `pipe`.
    const reducer = (
      previousValue: number,
      currentValue: unknown,
      index: number,
    ): number => reducerOf(previousValue, currentValue, index);

    expect(mapWithFeedback(data, reducer, initialValue)).toStrictEqual(
      pipe(data, mapWithFeedback(reducer, initialValue)),
    );
  },
);
