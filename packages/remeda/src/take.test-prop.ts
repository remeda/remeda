import { fc, test } from "@fast-check/vitest";
import { expect } from "vitest";
import { identity } from "./identity";
import { map } from "./map";
import { pipe } from "./pipe";
import { take } from "./take";

// Fractions, NaN, infinities and negative zero are the point of this test.
const count = fc.oneof(
  fc.integer({ min: -3, max: 12 }),
  fc.integer({ min: -12, max: 48 }).map((quarters) => quarters / 4),
  fc.constantFrom(NaN, Infinity, -Infinity, -0),
  fc.double(),
);

// Dense only: data-first `slice` keeps holes, `pipe` reads them as `undefined`.
const items = fc.array(fc.integer());

// https://github.com/remeda/remeda/pull/1469
test.prop([items, count])(
  "data-first and data-last produce the same result",
  (data, n) => {
    expect(pipe(data, take(n))).toStrictEqual(take(data, n));
  },
);

test.prop([items, count])(
  "data-first and data-last produce the same result in a fused run",
  (data, n) => {
    expect(pipe(data, map(identity()), take(n))).toStrictEqual(take(data, n));
  },
);
