import { fc, test } from "@fast-check/vitest";
import { expect } from "vitest";
import { countBy } from "./countBy";
import { pipe } from "./pipe";
import { take } from "./take";

const SYMBOL_CATEGORY = Symbol("category");

// Few distinct values, so categories repeat often, among them the ones
// equality treats specially: `NaN`, `-0` next to `0`, and two objects of the
// same shape that only their reference tells apart.
const item = fc.oneof(
  fc.integer({ min: 0, max: 3 }),
  fc.constantFrom(NaN, -0, "0", { id: 0 }, { id: 0 }),
);

// Both calling styles read a hole as `undefined`.
const items = fc.oneof(fc.array(item), fc.sparseArray(item));

// The categories an object stores in its own way: `__proto__`, a name its
// prototype already has, numbers that share a property with a string (`-0`
// with `0`), and a symbol; `undefined` leaves the item out.
const category = fc.constantFrom(
  "__proto__",
  "toString",
  "a",
  0,
  -0,
  "0",
  10,
  "10",
  SYMBOL_CATEGORY,
  undefined,
);

// Whole counts only: in `pipe`, `take` keeps `Math.ceil(count)` items, and all
// of them for `NaN`, while data-first `take` truncates the count.
const count = fc.oneof(fc.integer({ min: -1, max: 12 }), fc.constant(Infinity));

test.prop([items, fc.func(category)])(
  "data-first and data-last produce the same result",
  (data, categoryOf) => {
    // The categorizer ignores `data`, which differs between the calling styles
    // on purpose: the whole input data-first, the items so far in `pipe`.
    const categorizer = (
      value: unknown,
      index: number,
    ): PropertyKey | undefined => categoryOf(value, index);

    const dataFirst = countBy(data, categorizer);

    expectSameCounts(pipe(data, countBy(categorizer)), dataFirst);
    expectSameCounts(
      pipe(data, take(Infinity), countBy(categorizer)),
      dataFirst,
    );
  },
);

test.prop([items, fc.func(category), count])(
  "data-last after `take` counts the taken prefix",
  (data, categoryOf, takeCount) => {
    const categorizer = (
      value: unknown,
      index: number,
    ): PropertyKey | undefined => categoryOf(value, index);

    expectSameCounts(
      pipe(data, take(takeCount), countBy(categorizer)),
      countBy(take(data, takeCount), categorizer),
    );
  },
);

test.prop([items, fc.func(category), fc.func(fc.boolean())])(
  "data-last throws what data-first throws",
  (data, categoryOf, throwsAt) => {
    // The message names the item, so the first item to throw must match too.
    const categorizer = (
      value: unknown,
      index: number,
    ): PropertyKey | undefined => {
      if (throwsAt(value, index)) {
        throw new RangeError(`No category for the item at ${index}`);
      }

      return categoryOf(value, index);
    };

    const expected = thrownBy(() => countBy(data, categorizer));

    expect(thrownBy(() => pipe(data, countBy(categorizer)))).toStrictEqual(
      expected,
    );
    expect(
      thrownBy(() => pipe(data, take(Infinity), countBy(categorizer))),
    ).toStrictEqual(expected);
  },
);

type Counts = Readonly<Record<PropertyKey, number | undefined>>;

// Deep equality skips the prototype and the key order.
function expectSameCounts(actual: Counts, expected: Counts): void {
  expect(actual).toStrictEqual(expected);
  expect(Object.getPrototypeOf(actual)).toBe(Object.getPrototypeOf(expected));
  expect(Reflect.ownKeys(actual)).toStrictEqual(Reflect.ownKeys(expected));
}

// A list, so that a call that returns compares too, as an empty one.
function thrownBy(run: () => unknown): readonly unknown[] {
  try {
    run();
    return [];
  } catch (error) {
    return [error];
  }
}
