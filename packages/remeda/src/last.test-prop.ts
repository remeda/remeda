import { fc, test } from "@fast-check/vitest";
import { expect } from "vitest";
import { last } from "./last";
import { pipe } from "./pipe";
import { take } from "./take";

// Few distinct values, so the last item often repeats an earlier one, among
// them `NaN`, `-0` next to `0`, and two objects of the same shape that only
// their reference tells apart.
const item = fc.oneof(
  fc.integer({ min: 0, max: 3 }),
  fc.constantFrom(NaN, -0, "0", { id: 0 }, { id: 0 }),
);

// Both calling styles read a hole as `undefined`, a trailing one included.
const items = fc.oneof(fc.array(item), fc.sparseArray(item));

// Whole counts only: a lazy `take` rounds a fractional count up and takes
// everything for `NaN`, while data-first `take` slices.
const count = fc.integer({ min: -1, max: 32 });

test.prop([items])(
  "data-first and data-last produce the same result",
  (data) => {
    const dataFirst = last(data);

    // By identity: deep equality can't tell the two objects apart.
    expect(pipe(data, last())).toBe(dataFirst);
    expect(pipe(data, take(Infinity), last())).toBe(dataFirst);
  },
);

test.prop([items, count])(
  "taking a prefix in the pipe ends like data-first on the prefix",
  (data, prefixLength) => {
    expect(pipe(data, take(prefixLength), last())).toBe(
      last(take(data, prefixLength)),
    );
  },
);
