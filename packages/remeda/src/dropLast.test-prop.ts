import { fc, test } from "@fast-check/vitest";
import { expect } from "vitest";
import { forceFusion } from "../test/forceFusion";
import { dropLast } from "./dropLast";
import { pipe } from "./pipe";

test.prop([
  fc.array(fc.anything()),
  // Whole counts around the input's length, fractions in quarter steps, `NaN`,
  // the infinities and `-0`, and any double.
  fc.oneof(
    fc.integer({ min: -3, max: 12 }),
    fc.integer({ min: -12, max: 48 }).map((quarters) => quarters / 4),
    fc.constantFrom(NaN, Infinity, -Infinity, -0),
    fc.double(),
  ),
])("data-first and a fused sequence produce the same result", (data, n) => {
  expect(pipe(data, forceFusion(), dropLast(n))).toStrictEqual(
    dropLast(data, n),
  );
});
