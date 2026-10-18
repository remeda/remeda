import { fc, test } from "@fast-check/vitest";
import { expect } from "vitest";
import { fromEntries } from "./fromEntries";
import { pipe } from "./pipe";
import { take } from "./take";

const SYMBOL_KEY = Symbol("key");

// Few keys, so they repeat often, among them the ones an object stores in its
// own way: `__proto__`, a name its prototype already has, numbers that share a
// property with a string (`-0` with `0`), and a symbol.
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

// Few distinct values, among them the ones equality treats specially: `NaN`,
// `-0` next to `0`, and two objects of the same shape that only their
// reference tells apart.
const value = fc.oneof(
  fc.integer({ min: 0, max: 3 }),
  fc.constantFrom(NaN, -0, "0", { id: 0 }, { id: 0 }),
);

const entry = fc.tuple(key, value);

// Each of them throws with its own message.
const notAnEntry = fc.constantFrom(1, "ab", true, null, undefined);

// Whole counts only: in `pipe`, `take` keeps `Math.ceil(count)` items, and all
// of them for `NaN`, while data-first `take` truncates the count.
const count = fc.oneof(fc.integer({ min: -1, max: 12 }), fc.constant(Infinity));

test.prop([fc.array(entry)])(
  "data-first and data-last produce the same result",
  (entries) => {
    const dataFirst = fromEntries(entries);

    expectSameObject(pipe(entries, fromEntries()), dataFirst);
    expectSameObject(pipe(entries, take(Infinity), fromEntries()), dataFirst);
  },
);

test.prop([fc.array(entry), count])(
  "data-last after `take` builds the taken prefix",
  (entries, takeCount) => {
    expectSameObject(
      pipe(entries, take(takeCount), fromEntries()),
      fromEntries(take(entries, takeCount)),
    );
  },
);

test.prop([
  fc.oneof(fc.sparseArray(entry), fc.array(fc.oneof(entry, notAnEntry))),
])("data-last throws what data-first throws", (data) => {
  // @ts-expect-error [ts2322] -- The holes and the values that aren't entries are the input under test.
  const entries: readonly (readonly [PropertyKey, unknown])[] = data;

  const expected = thrownBy(() => fromEntries(entries));

  expect(thrownBy(() => pipe(entries, fromEntries()))).toStrictEqual(expected);
  expect(
    thrownBy(() => pipe(entries, take(Infinity), fromEntries())),
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
