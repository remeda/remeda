import { fc, test } from "@fast-check/vitest";
import { expect } from "vitest";
import { groupByProp } from "./groupByProp";
import { pipe } from "./pipe";
import { take } from "./take";

const SYMBOL_VALUE = Symbol("value");

// The values an object stores as keys in its own way: `__proto__`, a name its
// prototype already has, numbers that share a property with a string (`-0`
// with `0`), and a symbol; `undefined` and a missing prop leave the item out.
const kind = fc.constantFrom(
  "__proto__",
  "toString",
  "a",
  0,
  -0,
  "0",
  10,
  "10",
  SYMBOL_VALUE,
  undefined,
);

// Every record is a new object, so items of the same shape are only told
// apart by their reference.
const item = fc.record({ kind }, { requiredKeys: [] });

// Both calling styles read a hole as `undefined`, which is left out.
const items = fc.oneof(fc.array(item), fc.sparseArray(item));

// Whole counts only: in `pipe`, `take` keeps `Math.ceil(count)` items, and all
// of them for `NaN`, while data-first `take` truncates the count.
const count = fc.oneof(fc.integer({ min: -1, max: 12 }), fc.constant(Infinity));

// Reading the prop of these throws, each with its own message, so the first
// item to throw must match too.
const unreadableItem = fc.constantFrom(
  {
    get kind(): string {
      throw new RangeError("The first kind is unreadable");
    },
  },
  {
    get kind(): string {
      throw new RangeError("The second kind is unreadable");
    },
  },
);

test.prop([items])(
  "data-first and data-last produce the same result",
  (data) => {
    const dataFirst = groupByProp(data, "kind");

    expectSameGroups(pipe(data, groupByProp("kind")), dataFirst);
    expectSameGroups(
      pipe(data, take(Infinity), groupByProp("kind")),
      dataFirst,
    );
  },
);

test.prop([items, count])(
  "data-last after `take` groups the taken prefix",
  (data, takeCount) => {
    expectSameGroups(
      pipe(data, take(takeCount), groupByProp("kind")),
      groupByProp(take(data, takeCount), "kind"),
    );
  },
);

test.prop([fc.array(fc.oneof(item, unreadableItem))])(
  "data-last throws what data-first throws",
  (data) => {
    const expected = thrownBy(() => groupByProp(data, "kind"));

    expect(thrownBy(() => pipe(data, groupByProp("kind")))).toStrictEqual(
      expected,
    );
    expect(
      thrownBy(() => pipe(data, take(Infinity), groupByProp("kind"))),
    ).toStrictEqual(expected);
  },
);

type Groups = Readonly<Record<PropertyKey, readonly unknown[] | undefined>>;

// Deep equality skips the prototype and the key order, and it can't tell the
// items of the same shape apart.
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
