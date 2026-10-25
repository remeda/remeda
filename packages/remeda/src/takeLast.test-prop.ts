import { fc, test } from "@fast-check/vitest";
import { expect } from "vitest";
import { pipe } from "./pipe";
import { take } from "./take";
import { takeLast } from "./takeLast";

// Few distinct values, so items often repeat, among them `NaN`, `-0` next to
// `0`, and two objects of the same shape that only their reference tells
// apart.
const item = fc.oneof(
  fc.integer({ min: 0, max: 3 }),
  fc.constantFrom(NaN, -0, "0", { id: 0 }, { id: 0 }),
);

// Dense only: `slice` keeps a hole, while a lazy step reads it as
// `undefined`.
const items = fc.array(item);

// Whole and fractional amounts, past the length too, and the special ones:
// `NaN`, `-0`, the infinities, and `Number.MIN_VALUE`, which is too small to
// change the length when subtracted from it.
const amountToTake = fc.oneof(
  fc.integer({ min: -2, max: 12 }),
  fc.double({ min: -2, max: 12 }),
  fc.constantFrom(NaN, -0, Infinity, -Infinity, Number.MIN_VALUE),
);

const count = fc.integer({ min: -1, max: 12 });

test.prop([items, amountToTake])(
  "data-first and data-last produce the same result",
  (data, amount) => {
    const dataFirst = takeLast(data, amount);
    const dataLast = pipe(data, takeLast(amount));
    const afterTake = pipe(data, take(Infinity), takeLast(amount));

    // By identity: deep equality can't tell the two objects apart.
    expect(dataLast).toHaveLength(dataFirst.length);
    expect(
      dataLast.every((value, index) => Object.is(value, dataFirst[index])),
    ).toBe(true);
    expect(afterTake).toHaveLength(dataFirst.length);
    expect(
      afterTake.every((value, index) => Object.is(value, dataFirst[index])),
    ).toBe(true);
  },
);

test.prop([items, amountToTake, count])(
  "taking a prefix in the pipe takes like data-first on the prefix",
  (data, amount, prefixLength) => {
    const onPrefix = takeLast(take(data, prefixLength), amount);
    const dataLast = pipe(data, take(prefixLength), takeLast(amount));

    expect(dataLast).toHaveLength(onPrefix.length);
    expect(
      dataLast.every((value, index) => Object.is(value, onPrefix[index])),
    ).toBe(true);
  },
);
