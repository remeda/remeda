import { fc, test } from "@fast-check/vitest";
import { expect } from "vitest";
import { difference } from "./difference";
import { doNothing } from "./doNothing";
import { drop } from "./drop";
import { filter } from "./filter";
import { flat } from "./flat";
import { flatMap } from "./flatMap";
import { forEach } from "./forEach";
import { map } from "./map";
import { mapWithFeedback } from "./mapWithFeedback";
import { pipe } from "./pipe";
import { take } from "./take";
import { unique } from "./unique";
import { uniqueBy } from "./uniqueBy";

type Step = (data: readonly number[]) => readonly number[];

// Lazy functions that can't stop the pipe early, so a run made only of them
// runs on an array step by step, each function through its data-first call.
const STEPS: readonly Step[] = [
  map((x) => x * 2),
  filter((x) => x % 3 !== 0),
  flatMap((x) => [x, x + 1]),
  flatMap((x) => (x % 2 === 0 ? [] : [x])),
  flat(),
  drop(2),
  unique(),
  uniqueBy((x) => x % 4),
  difference([1, 2, 2]),
  mapWithFeedback((sum, x) => sum + x, 0),
  forEach(doNothing()),
];

// Dense: holes are where the data-first calls of native methods differ from
// the lazy evaluators.
const items = fc.array(fc.integer({ min: -5, max: 5 }));
const step = fc.constantFrom(...STEPS);

test.prop([items, step, step, step])(
  "a run that can't stop early returns what the fused run returns",
  (data, first, second, third) => {
    expect(pipe(data, first, second, third)).toStrictEqual(
      // `take` can stop early, so the same run with it fuses.
      pipe(data, first, second, third, take(Infinity)),
    );
  },
);
