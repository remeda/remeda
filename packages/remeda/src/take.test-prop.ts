import { fc, test } from "@fast-check/vitest";
import { expect } from "vitest";
import { identity } from "./identity";
import { map } from "./map";
import { pipe } from "./pipe";
import { take } from "./take";

// Fractions, NaN, infinities and negative zero are the point of this test.
const COUNT = fc.oneof(
  fc.integer({ min: -3, max: 12 }),
  fc.integer({ min: -12, max: 48 }).map((quarters) => quarters / 4),
  fc.constantFrom(NaN, Infinity, -Infinity, -0),
  fc.double(),
);

test.prop([fc.array(fc.integer()), COUNT])(
  "data-first and data-last produce the same result",
  (data, n) => {
    expect(pipe(data, take(n))).toStrictEqual(take(data, n));
  },
);

test.prop([fc.array(fc.integer()), COUNT])(
  "data-first and data-last produce the same result in a fused sequence",
  (data, n) => {
    expect(pipe(data, map(identity()), take(n))).toStrictEqual(take(data, n));
  },
);
