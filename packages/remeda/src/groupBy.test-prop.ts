import { fc, test } from "@fast-check/vitest";
import { expect } from "vitest";
import { groupBy } from "./groupBy";
import { pipe } from "./pipe";
import { take } from "./take";

const SYMBOL_KEY = Symbol("key");

// Few distinct values, so groups often hold several items, among them the
// ones equality treats specially: `NaN`, `-0` next to `0`, and two objects of
// the same shape that only their reference tells apart.
const element = fc.oneof(
  fc.integer({ min: 0, max: 3 }),
  fc.constantFrom(NaN, -0, "0", { id: 0 }, { id: 0 }),
);

// Both calling styles read a hole as `undefined`.
const elements = fc.oneof(fc.array(element), fc.sparseArray(element));

// The keys an object stores in its own way: `__proto__`, a name its prototype
// already has, numbers that share a property with a string (`-0` with `0`),
// and a symbol; `undefined` leaves the item out.
const groupKey = fc.constantFrom(
  "__proto__",
  "toString",
  "a",
  0,
  -0,
  "0",
  10,
  "10",
  SYMBOL_KEY,
  undefined,
);

const count = fc.oneof(fc.integer({ min: -1, max: 12 }), fc.constant(Infinity));

test.prop([fc.array(fc.anything()), fc.func(fc.string()).map(pureGrouper)])(
  "all elements are preserved across groups",
  (data, grouper) => {
    const result = groupBy(data, grouper);

    expect(Object.values(result).flat()).toHaveLength(data.length);
  },
);

test.prop([fc.array(fc.anything()), fc.func(fc.string()).map(pureGrouper)])(
  "each element is grouped by its computed key",
  (data, grouper) => {
    const result = groupBy(data, grouper);

    expect(
      Object.entries(result).every(([key, items]) =>
        items.every((item) => grouper(item) === key),
      ),
    ).toBe(true);
  },
);

test.prop([fc.array(fc.anything()), fc.func(fc.string()).map(pureGrouper)])(
  "groups are never empty",
  (data, grouper) => {
    const result = groupBy(data, grouper);

    expect(Object.values(result).every((group) => group.length > 0)).toBe(true);
  },
);

test.prop([elements, fc.func(groupKey)])(
  "data-first and data-last produce the same result",
  (data, keyOf) => {
    // The grouper ignores `data`, which differs between the calling styles on
    // purpose: the whole input data-first, the items so far in `pipe`.
    const grouper = (value: unknown, index: number): PropertyKey | undefined =>
      keyOf(value, index);

    const dataFirst = groupBy(data, grouper);

    expectSameGroups(pipe(data, groupBy(grouper)), dataFirst);
    expectSameGroups(pipe(data, take(Infinity), groupBy(grouper)), dataFirst);
  },
);

test.prop([elements, fc.func(groupKey), count])(
  "data-last after `take` groups the taken prefix",
  (data, keyOf, takeCount) => {
    const grouper = (value: unknown, index: number): PropertyKey | undefined =>
      keyOf(value, index);

    expectSameGroups(
      pipe(data, take(takeCount), groupBy(grouper)),
      groupBy(take(data, takeCount), grouper),
    );
  },
);

test.prop([elements, fc.func(groupKey), fc.func(fc.boolean())])(
  "data-last throws what data-first throws",
  (data, keyOf, throwsAt) => {
    // The message names the item, so the first item to throw must match too.
    const grouper = (
      value: unknown,
      index: number,
    ): PropertyKey | undefined => {
      if (throwsAt(value, index)) {
        throw new RangeError(`No group for the item at ${index}`);
      }

      return keyOf(value, index);
    };

    const expected = thrownBy(() => groupBy(data, grouper));

    expect(thrownBy(() => pipe(data, groupBy(grouper)))).toStrictEqual(
      expected,
    );
    expect(
      thrownBy(() => pipe(data, take(Infinity), groupBy(grouper))),
    ).toStrictEqual(expected);
  },
);

test.prop([
  fc.uniqueArray(fc.integer()),
  fc.func(fc.string()).map(pureGrouper),
])(
  "elements within groups maintain their relative order from the input",
  (data, grouper) => {
    const result = groupBy(data, grouper);

    expect(
      Object.values(result).every((group) =>
        group
          .map((item) => data.indexOf(item))
          .every(
            // If order is kept within the group then the indices should
            // monotonically increase.
            (index, i, arr) => i === 0 || (arr[i - 1] ?? Infinity) < index,
          ),
      ),
    ).toBe(true);
  },
);

test.prop([
  fc.array(fc.anything()),
  fc.func(fc.option(fc.string(), { nil: undefined })).map(pureGrouper),
])("elements mapped to undefined are excluded", (data, grouper) => {
  const result = groupBy(data, grouper);

  expect(Object.values(result).flat()).toHaveLength(
    data.filter((item) => grouper(item) !== undefined).length,
  );
});

test.prop([
  fc.array(fc.anything()),
  fc.func(fc.option(fc.string(), { nil: undefined })).map(pureGrouper),
])("excluded elements do not appear in any group", (data, grouper) => {
  const result = groupBy(data, grouper);

  expect(
    Object.values(result)
      .flat()
      .every((item) => grouper(item) !== undefined),
  ).toBe(true);
});

test.prop([
  fc.array(fc.option(fc.anything(), { nil: undefined })),
  fc.func(fc.string()).map(pureGrouper),
])(
  "undefined items can be grouped when grouper returns a key",
  (data, grouper) => {
    const result = groupBy(data, grouper);

    expect(
      Object.values(result)
        .flat()
        .filter((item) => item === undefined),
    ).toHaveLength(data.filter((item) => item === undefined).length);
  },
);

function pureGrouper<Ret extends string | undefined>(
  arbitrary: (...args: readonly unknown[]) => Ret,
) {
  // Only depend on the item, ignoring index and array. This ensures calling
  // grouper(item) in tests matches what groupBy computed.
  return (item: unknown) => arbitrary(item);
}

type Groups = Readonly<Record<PropertyKey, readonly unknown[] | undefined>>;

// Deep equality skips the prototype and the key order, and it can't tell the
// two objects of the same shape apart.
function expectSameGroups(actual: Groups, expected: Groups): void {
  expect(actual).toStrictEqual(expected);
  expect(Object.getPrototypeOf(actual)).toBe(Object.getPrototypeOf(expected));
  expect(Reflect.ownKeys(actual)).toStrictEqual(Reflect.ownKeys(expected));
  expect(
    Reflect.ownKeys(expected).every((ownKey) =>
      (expected[ownKey] ?? []).every((value, index) =>
        Object.is(value, actual[ownKey]?.[index]),
      ),
    ),
  ).toBe(true);
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
