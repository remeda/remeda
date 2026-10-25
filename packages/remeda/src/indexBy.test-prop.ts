import { fc, test } from "@fast-check/vitest";
import { expect } from "vitest";
import { indexBy } from "./indexBy";
import { pipe } from "./pipe";
import { take } from "./take";

const SYMBOL_KEY = Symbol("key");

// Few distinct values, so keys repeat often, among them the ones equality
// treats specially: `NaN`, `-0` next to `0`, and two objects of the same shape
// that only their reference tells apart.
const item = fc.oneof(
  fc.integer({ min: 0, max: 3 }),
  fc.constantFrom(NaN, -0, "0", { id: 0 }, { id: 0 }),
);

// Both calling styles read a hole as `undefined`.
const items = fc.oneof(fc.array(item), fc.sparseArray(item));

// The keys an object stores in its own way: `__proto__`, which an object item
// assigned to replaces the prototype, a name the prototype already has,
// numbers that share a property with a string (`-0` with `0`), and a symbol.
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

const count = fc.oneof(fc.integer({ min: -1, max: 12 }), fc.constant(Infinity));

test.prop([items, fc.func(key)])(
  "data-first and data-last produce the same result",
  (data, keyOf) => {
    // The mapper ignores `data`, which differs between the calling styles on
    // purpose: the whole input data-first, the items so far in `pipe`.
    const mapper = (value: unknown, index: number): PropertyKey =>
      keyOf(value, index);

    const dataFirst = indexBy(data, mapper);

    expectSameIndex(pipe(data, indexBy(mapper)), dataFirst);
    expectSameIndex(pipe(data, take(Infinity), indexBy(mapper)), dataFirst);
  },
);

test.prop([items, fc.func(key), count])(
  "data-last after `take` indexes the taken prefix",
  (data, keyOf, takeCount) => {
    const mapper = (value: unknown, index: number): PropertyKey =>
      keyOf(value, index);

    expectSameIndex(
      pipe(data, take(takeCount), indexBy(mapper)),
      indexBy(take(data, takeCount), mapper),
    );
  },
);

test.prop([items, fc.func(key), fc.func(fc.boolean())])(
  "data-last throws what data-first throws",
  (data, keyOf, throwsAt) => {
    // The message names the item, so the first item to throw must match too.
    const mapper = (value: unknown, index: number): PropertyKey => {
      if (throwsAt(value, index)) {
        throw new RangeError(`No key for the item at ${index}`);
      }

      return keyOf(value, index);
    };

    const expected = thrownBy(() => indexBy(data, mapper));

    expect(thrownBy(() => pipe(data, indexBy(mapper)))).toStrictEqual(expected);
    expect(
      thrownBy(() => pipe(data, take(Infinity), indexBy(mapper))),
    ).toStrictEqual(expected);
  },
);

type Index = Readonly<Record<PropertyKey, unknown>>;

// Deep equality skips the prototype and the key order, and it can't tell the
// two objects of the same shape apart.
function expectSameIndex(actual: Index, expected: Index): void {
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
