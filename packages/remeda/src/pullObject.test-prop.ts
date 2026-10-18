import { fc, test } from "@fast-check/vitest";
import { expect } from "vitest";
import { pipe } from "./pipe";
import { pullObject } from "./pullObject";
import { take } from "./take";

const SYMBOL_KEY = Symbol("key");

// Few distinct values, among them the ones equality treats specially: `NaN`,
// `-0` next to `0`, and two objects of the same shape that only their
// reference tells apart.
const item = fc.oneof(
  fc.integer({ min: 0, max: 3 }),
  fc.constantFrom(NaN, -0, "0", { id: 0 }, { id: 0 }),
);

// Both calling styles read a hole as `undefined`.
const items = fc.oneof(fc.array(item), fc.sparseArray(item));

// Few keys, so they repeat often, among them the ones an object stores in its
// own way: `__proto__`, which an object value assigned to replaces the
// prototype, a name the prototype already has, numbers that share a property
// with a string (`-0` with `0`), and a symbol.
const key = fc.constantFrom(
  "__proto__",
  "toString",
  "a",
  0,
  -0,
  "0",
  10,
  "10",
  SYMBOL_KEY,
);

// The items, and `null`, which removes the prototype when assigned to
// `__proto__`.
const value = fc.oneof(item, fc.constant(null));

// Whole counts only: in `pipe`, `take` keeps `Math.ceil(count)` items, and all
// of them for `NaN`, while data-first `take` truncates the count.
const count = fc.oneof(fc.integer({ min: -1, max: 12 }), fc.constant(Infinity));

test.prop([items, fc.func(key), fc.func(value)])(
  "data-first and data-last produce the same result",
  (data, keyOf, valueOf) => {
    // The extractors ignore `data`, which differs between the calling styles
    // on purpose: the whole input data-first, the items so far in `pipe`.
    const keyExtractor = (element: unknown, index: number): PropertyKey =>
      keyOf(element, index);
    const valueExtractor = (element: unknown, index: number): unknown =>
      valueOf(element, index);

    const dataFirst = pullObject(data, keyExtractor, valueExtractor);

    expectSameObject(
      pipe(data, pullObject(keyExtractor, valueExtractor)),
      dataFirst,
    );
    expectSameObject(
      pipe(data, take(Infinity), pullObject(keyExtractor, valueExtractor)),
      dataFirst,
    );
  },
);

test.prop([items, fc.func(key), fc.func(value), count])(
  "data-last after `take` builds the taken prefix",
  (data, keyOf, valueOf, takeCount) => {
    const keyExtractor = (element: unknown, index: number): PropertyKey =>
      keyOf(element, index);
    const valueExtractor = (element: unknown, index: number): unknown =>
      valueOf(element, index);

    expectSameObject(
      pipe(data, take(takeCount), pullObject(keyExtractor, valueExtractor)),
      pullObject(take(data, takeCount), keyExtractor, valueExtractor),
    );
  },
);

test.prop([
  items,
  fc.func(key),
  fc.func(value),
  fc.func(fc.boolean()),
  fc.func(fc.boolean()),
])(
  "data-last throws what data-first throws",
  (data, keyOf, valueOf, keyThrowsAt, valueThrowsAt) => {
    // The messages name the extractor and the item, so the first call to
    // throw must match too, down to which extractor runs first for an item.
    const keyExtractor = (element: unknown, index: number): PropertyKey => {
      if (keyThrowsAt(element, index)) {
        throw new RangeError(`No key for the item at ${index}`);
      }

      return keyOf(element, index);
    };
    const valueExtractor = (element: unknown, index: number): unknown => {
      if (valueThrowsAt(element, index)) {
        throw new RangeError(`No value for the item at ${index}`);
      }

      return valueOf(element, index);
    };

    const expected = thrownBy(() =>
      pullObject(data, keyExtractor, valueExtractor),
    );

    expect(
      thrownBy(() => pipe(data, pullObject(keyExtractor, valueExtractor))),
    ).toStrictEqual(expected);
    expect(
      thrownBy(() =>
        pipe(data, take(Infinity), pullObject(keyExtractor, valueExtractor)),
      ),
    ).toStrictEqual(expected);
  },
);

type Built = Readonly<Record<PropertyKey, unknown>>;

// Deep equality skips the prototype and the key order, and it can't tell the
// two objects of the same shape apart.
function expectSameObject(actual: Built, expected: Built): void {
  expect(actual).toStrictEqual(expected);
  expect(Object.getPrototypeOf(actual)).toBe(Object.getPrototypeOf(expected));
  expect(Reflect.ownKeys(actual)).toStrictEqual(Reflect.ownKeys(expected));
  expect(
    Reflect.ownKeys(expected).every((ownKey) =>
      Object.is(actual[ownKey], expected[ownKey]),
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
