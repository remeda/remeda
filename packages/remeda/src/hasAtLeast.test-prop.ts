import { fc, test } from "@fast-check/vitest";
import { expect } from "vitest";
import { hasAtLeast } from "./hasAtLeast";
import { pipe } from "./pipe";
import { take } from "./take";

// Only the length matters, but the items still vary, among them `undefined`,
// which a count must not confuse with a missing item.
const item = fc.oneof(
  fc.integer({ min: 0, max: 3 }),
  fc.constantFrom(NaN, -0, "0", undefined, { id: 0 }, { id: 0 }),
);

// Both calling styles count a hole as an item.
const items = fc.oneof(fc.array(item), fc.sparseArray(item));

// Whole minimums on both sides of the length, fractional ones (doubles also
// cover `NaN` and `-0`), and the infinities.
const minimumCount = fc.oneof(
  fc.integer({ min: -2, max: 12 }),
  fc.double({ min: -2, max: 12 }),
  fc.constantFrom(Infinity, -Infinity),
);

// Whole counts only: in `pipe`, `take` rounds a fractional count up and keeps
// everything for `NaN`, while data-first `take` slices.
const takeCount = fc.oneof(
  fc.integer({ min: -1, max: 12 }),
  fc.constant(Infinity),
);

test.prop([items, minimumCount])(
  "data-first and data-last produce the same result",
  (data, minimum) => {
    expect(pipe(data, hasAtLeast(minimum))).toBe(hasAtLeast(data, minimum));
    expect(pipe(data, take(Infinity), hasAtLeast(minimum))).toBe(
      hasAtLeast(data, minimum),
    );
  },
);

test.prop([items, takeCount, minimumCount])(
  "a preceding take matches taking first",
  (data, count, minimum) => {
    expect(pipe(data, take(count), hasAtLeast(minimum))).toBe(
      hasAtLeast(take(data, count), minimum),
    );
  },
);
