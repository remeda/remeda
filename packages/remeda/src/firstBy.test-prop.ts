import { fc, test } from "@fast-check/vitest";
import { expect } from "vitest";
import { firstBy } from "./firstBy";
import { pipe } from "./pipe";
import { take } from "./take";

// Few distinct values, so repeated items are common, among them `NaN`, `-0`
// next to `0`, and two objects of the same shape that only their reference
// tells apart.
const item = fc.oneof(
  fc.integer({ min: 0, max: 3 }),
  fc.constantFrom(NaN, -0, "0", { id: 0 }, { id: 0 }),
);

// Both calling styles read a hole as `undefined`.
const items = fc.oneof(fc.array(item), fc.sparseArray(item));

// Few distinct projections, so ties are common, and `NaN`, which ties with
// everything, so the result depends on the order of the comparisons.
const projected = fc.oneof(fc.integer({ min: 0, max: 3 }), fc.constant(NaN));

const count = fc.integer({ min: -1, max: 32 });

test.prop([items, fc.func(projected), fc.constantFrom("asc", "desc")])(
  "data-first and data-last produce the same result",
  (data, projectionOf, direction) => {
    const projection = (value: unknown): number => projectionOf(value);

    const dataFirst = firstBy(data, [projection, direction]);

    // By identity: deep equality can't tell the two objects apart.
    expect(pipe(data, firstBy([projection, direction]))).toBe(dataFirst);
    expect(pipe(data, take(Infinity), firstBy([projection, direction]))).toBe(
      dataFirst,
    );
  },
);

test.prop([items, fc.func(projected), fc.constantFrom("asc", "desc"), count])(
  "taking a prefix in the pipe finds like data-first on the prefix",
  (data, projectionOf, direction, prefixLength) => {
    const projection = (value: unknown): number => projectionOf(value);

    expect(
      pipe(data, take(prefixLength), firstBy([projection, direction])),
    ).toBe(firstBy(take(data, prefixLength), [projection, direction]));
  },
);

test.prop([items, fc.func(projected), fc.func(fc.boolean())])(
  "data-last throws like data-first",
  (data, projectionOf, throwsOn) => {
    // Named after the item, so projecting the items in a different order
    // fails differently.
    const projection = (value: unknown): number => {
      if (throwsOn(value)) {
        throw new Error(`Projected ${typeof value} ${String(value)}`);
      }

      return projectionOf(value);
    };

    const dataFirst = outcomeOf(() => firstBy(data, projection));

    expect(outcomeOf(() => pipe(data, firstBy(projection)))).toStrictEqual(
      dataFirst,
    );
    expect(
      outcomeOf(() => pipe(data, take(Infinity), firstBy(projection))),
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
