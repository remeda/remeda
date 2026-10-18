import { fc, test } from "@fast-check/vitest";
import { expect } from "vitest";
import { join } from "./join";
import { pipe } from "./pipe";
import { take } from "./take";

// Every kind of item the types allow, among them the ones that join as an
// empty string (`null` and `undefined`), and the ones whose string form is
// special: `NaN`, `-0`, and strings that look like a glue or like `undefined`.
const item = fc.oneof(
  fc.integer({ min: -1, max: 3 }),
  fc.constantFrom(
    NaN,
    -0,
    1n,
    true,
    false,
    null,
    undefined,
    "",
    "a,b",
    "undefined",
  ),
);

// Both calling styles read a hole as `undefined`, which joins as an empty
// string.
const items = fc.oneof(fc.array(item), fc.sparseArray(item));

// Converting either of them to a string throws, each with its own error.
const unconvertible = fc.constantFrom(Symbol("item"), {
  toString: (): string => {
    throw new RangeError("No string form");
  },
});

// Whole counts only: in `pipe`, `take` keeps `Math.ceil(count)` items, and all
// of them for `NaN`, while data-first `take` truncates the count.
const count = fc.oneof(fc.integer({ min: -1, max: 12 }), fc.constant(Infinity));

test.prop([items, fc.string()])(
  "data-first and data-last produce the same result",
  (data, glue) => {
    const dataFirst = join(data, glue);

    expect(pipe(data, join(glue))).toBe(dataFirst);
    expect(pipe(data, take(Infinity), join(glue))).toBe(dataFirst);
  },
);

test.prop([items, fc.string(), count])(
  "data-last after `take` joins the taken prefix",
  (data, glue, takeCount) => {
    expect(pipe(data, take(takeCount), join(glue))).toBe(
      join(take(data, takeCount), glue),
    );
  },
);

test.prop([fc.array(fc.oneof(item, unconvertible)), fc.string()])(
  "data-last throws what data-first throws",
  (generated, glue) => {
    // @ts-expect-error [ts2322] -- The items that can't convert to a string are the input under test.
    const data: readonly JoinableItem[] = generated;

    const expected = thrownBy(() => join(data, glue));

    expect(thrownBy(() => pipe(data, join(glue)))).toStrictEqual(expected);
    expect(
      thrownBy(() => pipe(data, take(Infinity), join(glue))),
    ).toStrictEqual(expected);
  },
);

type JoinableItem = bigint | boolean | number | string | null | undefined;

// A list, so that a call that returns compares too, as an empty one.
function thrownBy(run: () => unknown): readonly unknown[] {
  try {
    run();
    return [];
  } catch (error) {
    return [error];
  }
}
