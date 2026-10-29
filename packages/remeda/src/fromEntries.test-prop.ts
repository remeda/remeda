import { fc, test } from "@fast-check/vitest";
import { expect } from "vitest";
import { fromEntries } from "./fromEntries";

const FIRST_SYMBOL = Symbol("first");
const SECOND_SYMBOL = Symbol("second");

// Few distinct keys, so duplicates are common, among them the ones objects
// store specially: `__proto__`, which plain assignment doesn't define as an own
// property, integer-like keys, which come first in ascending order, and
// numbers, which share the property of their string form (`-0` that of "0").
const key = fc.oneof(
  fc.constant("__proto__"),
  fc.integer({ min: 0, max: 3 }).map(String),
  fc.constantFrom("a", "b"),
  fc.string(),
  fc.integer({ min: -1, max: 3 }),
  fc.double(),
  fc.constantFrom(FIRST_SYMBOL, SECOND_SYMBOL),
);

const entries = fc.array(fc.tuple(key, fc.anything()));

test.prop([entries])(
  "the same own keys as Object.fromEntries, in the same order",
  (data) => {
    expect(Reflect.ownKeys(fromEntries(data))).toStrictEqual(
      Reflect.ownKeys(Object.fromEntries(data)),
    );
  },
);

test.prop([entries])(
  "the same own properties as Object.fromEntries",
  (data) => {
    const result = fromEntries(data);
    const expected = Object.fromEntries(data);

    // Descriptors compare each value along with its attributes.
    expect(
      Reflect.ownKeys(result).map((ownKey) =>
        Object.getOwnPropertyDescriptor(result, ownKey),
      ),
    ).toStrictEqual(
      Reflect.ownKeys(expected).map((ownKey) =>
        Object.getOwnPropertyDescriptor(expected, ownKey),
      ),
    );
  },
);

test.prop([entries])("the prototype is Object.prototype", (data) => {
  expect(Object.getPrototypeOf(fromEntries(data))).toBe(Object.prototype);
});
