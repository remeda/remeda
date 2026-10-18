import { fc, test } from "@fast-check/vitest";
import { expect } from "vitest";
import { pipe } from "./pipe";
import { take } from "./take";
import { takeFirstBy } from "./takeFirstBy";

// Few distinct values, so items often repeat, among them `NaN`, `-0` next to
// `0`, and two objects of the same shape that only their reference tells
// apart.
const item = fc.oneof(
  fc.integer({ min: 0, max: 3 }),
  fc.constantFrom(NaN, -0, "0", { id: 0 }, { id: 0 }),
);

// Dense only: the heap is a slice of the input, which keeps a hole, while a
// lazy step reads it as `undefined`.
const items = fc.array(item);

// Few distinct projections, so ties are common, and `NaN`, which ties with
// everything, so the result depends on the order of the comparisons.
const projected = fc.oneof(fc.integer({ min: 0, max: 3 }), fc.constant(NaN));

// Whole and fractional amounts, past the length too, and the special ones:
// `NaN`, `-0` and the infinities.
const amountToTake = fc.oneof(
  fc.integer({ min: -2, max: 12 }),
  fc.double({ min: -2, max: 12 }),
  fc.constantFrom(NaN, -0, Infinity, -Infinity),
);

// Whole counts only: a lazy `take` rounds a fractional count up and takes
// everything for `NaN`, while data-first `take` slices.
const count = fc.integer({ min: -1, max: 12 });

test.prop([
  items,
  amountToTake,
  fc.func(projected),
  fc.constantFrom("asc", "desc"),
])(
  "data-first and data-last produce the same result",
  (data, amount, projectionOf, direction) => {
    const projection = (value: unknown): number => projectionOf(value);

    const dataFirst = takeFirstBy(data, amount, [projection, direction]);
    const dataLast = pipe(data, takeFirstBy(amount, [projection, direction]));
    const afterTake = pipe(
      data,
      take(Infinity),
      takeFirstBy(amount, [projection, direction]),
    );

    // By identity and position: deep equality can't tell the two objects
    // apart, and the heap layout is part of the result.
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

test.prop([
  items,
  amountToTake,
  fc.func(projected),
  fc.constantFrom("asc", "desc"),
  count,
])(
  "taking a prefix in the pipe takes like data-first on the prefix",
  (data, amount, projectionOf, direction, prefixLength) => {
    const projection = (value: unknown): number => projectionOf(value);

    const onPrefix = takeFirstBy(take(data, prefixLength), amount, [
      projection,
      direction,
    ]);
    const dataLast = pipe(
      data,
      take(prefixLength),
      takeFirstBy(amount, [projection, direction]),
    );

    expect(dataLast).toHaveLength(onPrefix.length);
    expect(
      dataLast.every((value, index) => Object.is(value, onPrefix[index])),
    ).toBe(true);
  },
);

test.prop([items, amountToTake, fc.func(projected), fc.func(fc.boolean())])(
  "data-last throws like data-first",
  (data, amount, projectionOf, throwsOn) => {
    // Named after the item, so projecting the items in a different order
    // fails differently.
    const projection = (value: unknown): number => {
      if (throwsOn(value)) {
        throw new Error(`Projected ${typeof value} ${String(value)}`);
      }

      return projectionOf(value);
    };

    const dataFirst = outcomeOf(() => takeFirstBy(data, amount, projection));

    expect(
      outcomeOf(() => pipe(data, takeFirstBy(amount, projection))),
    ).toStrictEqual(dataFirst);
    expect(
      outcomeOf(() =>
        pipe(data, take(Infinity), takeFirstBy(amount, projection)),
      ),
    ).toStrictEqual(dataFirst);
  },
);

// What `run` returned or threw, so calls that might fail can be compared:
// strict equality compares errors by class and message.
function outcomeOf(
  run: () => unknown,
): Readonly<{ returned: unknown } | { threw: unknown }> {
  try {
    return { returned: run() };
  } catch (error) {
    return { threw: error };
  }
}
