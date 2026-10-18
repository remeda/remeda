import { fc, test } from "@fast-check/vitest";
import { expect } from "vitest";
import { fromKeys } from "./fromKeys";
import { pipe } from "./pipe";
import { take } from "./take";

const SYMBOL_KEY = Symbol("key");

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

// Both calling styles read a hole as `undefined`.
const keys = fc.oneof(fc.array(key), fc.sparseArray(key));

// Few distinct values, among them the ones equality treats specially: `NaN`,
// `-0` next to `0`, and two objects of the same shape that only their
// reference tells apart; and `null`, which removes the prototype when
// assigned to `__proto__`.
const value = fc.oneof(
  fc.integer({ min: 0, max: 3 }),
  fc.constantFrom(NaN, -0, "0", null, { id: 0 }, { id: 0 }),
);

// Whole counts only: in `pipe`, `take` keeps `Math.ceil(count)` items, and all
// of them for `NaN`, while data-first `take` truncates the count.
const count = fc.oneof(fc.integer({ min: -1, max: 12 }), fc.constant(Infinity));

test.prop([keys, fc.func(value)])(
  "data-first and data-last produce the same result",
  (data, valueOf) => {
    // The mapper ignores `data`, which differs between the calling styles on
    // purpose: the whole input data-first, the items so far in `pipe`.
    const mapper = (item: PropertyKey, index: number): unknown =>
      valueOf(item, index);

    const dataFirst = fromKeys(data, mapper);

    expectSameObject(pipe(data, fromKeys(mapper)), dataFirst);
    expectSameObject(pipe(data, take(Infinity), fromKeys(mapper)), dataFirst);
  },
);

test.prop([keys, fc.func(value), count])(
  "data-last after `take` builds the taken prefix",
  (data, valueOf, takeCount) => {
    const mapper = (item: PropertyKey, index: number): unknown =>
      valueOf(item, index);

    expectSameObject(
      pipe(data, take(takeCount), fromKeys(mapper)),
      fromKeys(take(data, takeCount), mapper),
    );
  },
);

test.prop([keys, fc.func(value), fc.func(fc.boolean())])(
  "data-last throws what data-first throws",
  (data, valueOf, throwsAt) => {
    // The message names the item, so the first item to throw must match too.
    const mapper = (item: PropertyKey, index: number): unknown => {
      if (throwsAt(item, index)) {
        throw new RangeError(`No value for the key at ${index}`);
      }

      return valueOf(item, index);
    };

    const expected = thrownBy(() => fromKeys(data, mapper));

    expect(thrownBy(() => pipe(data, fromKeys(mapper)))).toStrictEqual(
      expected,
    );
    expect(
      thrownBy(() => pipe(data, take(Infinity), fromKeys(mapper))),
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
