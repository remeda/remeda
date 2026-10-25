import { fc, test } from "@fast-check/vitest";
import { expect } from "vitest";
import { mapToObj } from "./mapToObj";
import { pipe } from "./pipe";
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
const entry = fc.tuple(key, fc.oneof(item, fc.constant(null)));

// Destructuring each of them throws.
const notIterable = fc.constantFrom(1, null, undefined, { 0: "a", 1: "b" });

const count = fc.oneof(fc.integer({ min: -1, max: 12 }), fc.constant(Infinity));

test.prop([items, fc.func(entry)])(
  "data-first and data-last produce the same result",
  (data, entryOf) => {
    // The callback ignores `data`, which differs between the calling styles on
    // purpose: the whole input data-first, the items so far in `pipe`.
    const callback = (value: unknown, index: number): [PropertyKey, unknown] =>
      entryOf(value, index);

    const dataFirst = mapToObj(data, callback);

    expectSameObject(pipe(data, mapToObj(callback)), dataFirst);
    expectSameObject(pipe(data, take(Infinity), mapToObj(callback)), dataFirst);
  },
);

test.prop([items, fc.func(entry), count])(
  "data-last after `take` builds the taken prefix",
  (data, entryOf, takeCount) => {
    const callback = (value: unknown, index: number): [PropertyKey, unknown] =>
      entryOf(value, index);

    expectSameObject(
      pipe(data, take(takeCount), mapToObj(callback)),
      mapToObj(take(data, takeCount), callback),
    );
  },
);

test.prop([
  items,
  fc.func(fc.oneof(entry, notIterable)),
  fc.func(fc.boolean()),
])("data-last throws what data-first throws", (data, resultOf, throwsAt) => {
  // The message names the item, so the first item to throw must match too.
  const callback = (value: unknown, index: number): [PropertyKey, unknown] => {
    if (throwsAt(value, index)) {
      throw new RangeError(`No entry for the item at ${index}`);
    }

    // @ts-expect-error [ts2322] -- The results that aren't iterable are the input under test.
    return resultOf(value, index);
  };

  const expected = thrownBy(() => mapToObj(data, callback));

  expect(thrownBy(() => pipe(data, mapToObj(callback)))).toStrictEqual(
    expected,
  );
  expect(
    thrownBy(() => pipe(data, take(Infinity), mapToObj(callback))),
  ).toStrictEqual(expected);
});

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
