import { fc, test } from "@fast-check/vitest";
import { expect } from "vitest";
import { only } from "./only";
import { pipe } from "./pipe";
import { take } from "./take";

// Few distinct values, among them the ones equality treats specially: `NaN`,
// `-0` next to `0`, `undefined` (which a lone result can't tell apart from no
// result), and two objects of the same shape that only their reference tells
// apart.
const item = fc.oneof(
  fc.integer({ min: 0, max: 3 }),
  fc.constantFrom(NaN, -0, "0", undefined, { id: 0 }, { id: 0 }),
);

// Both calling styles read a hole as `undefined`. Short arrays, so that the
// interesting lengths (0, 1 and 2) come up often.
const items = fc.oneof(
  fc.array(item, { maxLength: 4 }),
  fc.sparseArray(item, { maxLength: 4 }),
);

// Whole counts only: in `pipe`, `take` rounds a fractional count up and keeps
// everything for `NaN`, while data-first `take` slices.
const takeCount = fc.oneof(
  fc.integer({ min: -1, max: 5 }),
  fc.constant(Infinity),
);

test.prop([items])(
  "data-first and data-last produce the same result",
  (data) => {
    const dataFirst = only(data);

    // `toBe` compares with `Object.is`: `NaN` matches itself, while `-0` and
    // `0`, and the two objects, are told apart.
    expect(pipe(data, only())).toBe(dataFirst);
    expect(pipe(data, take(Infinity), only())).toBe(dataFirst);
  },
);

test.prop([items, takeCount])(
  "a preceding take matches taking first",
  (data, count) => {
    expect(pipe(data, take(count), only())).toBe(only(take(data, count)));
  },
);
