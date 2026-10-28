import { fc, test } from "@fast-check/vitest";
import { expect } from "vitest";
import { forceFusion } from "../test/forceFusion";
import { dropLast } from "./dropLast";
import { pipe } from "./pipe";

// Dense only: data-first slices the input, which keeps its holes, while a
// fused run reads each hole as `undefined`.
const items = fc.array(fc.anything());

// Whole counts around the input's length, fractions in quarter steps, and the
// values `dropLast` handles specially.
const counts = fc.oneof(
  fc.integer({ min: -3, max: 12 }),
  fc.integer({ min: -12, max: 48 }).map((quarters) => quarters / 4),
  fc.constantFrom(NaN, Infinity, -Infinity, -0),
);

test.prop([items, counts])(
  "data-first and data-last produce the same result",
  (data, n) => {
    expect(pipe(data, dropLast(n))).toStrictEqual(dropLast(data, n));
  },
);

test.prop([items, counts])(
  "data-first and a fused run produce the same result",
  (data, n) => {
    expect(pipe(data, forceFusion(), dropLast(n))).toStrictEqual(
      dropLast(data, n),
    );
  },
);
