import { fc, test } from "@fast-check/vitest";
import { expect } from "vitest";
import { mean } from "./mean";
import { pipe } from "./pipe";
import { take } from "./take";

// Often the values the mean treats specially: `NaN`, `-0` (which the sum's
// `0` seed turns into `0`), and the infinities.
const number = fc.oneof(
  fc.double(),
  fc.constantFrom(-0, NaN, Infinity, -Infinity),
);

// Both calling styles read a hole as `undefined`, which turns the mean into
// `NaN`.
const numbers = fc.oneof(fc.array(number), fc.sparseArray(number));

const count = fc.integer({ min: -1, max: 32 });

test.prop([numbers])(
  "data-first and data-last produce the same result",
  (data) => {
    const dataFirst = mean(data);

    expect(pipe(data, mean())).toBe(dataFirst);
    expect(pipe(data, take(Infinity), mean())).toBe(dataFirst);
  },
);

test.prop([numbers, count])(
  "taking a prefix in the pipe averages like data-first on the prefix",
  (data, prefixLength) => {
    expect(pipe(data, take(prefixLength), mean())).toBe(
      mean(take(data, prefixLength)),
    );
  },
);
