/**
 * V8 optimizes `pipe`, the lazy evaluators, and the step machinery against the
 * type feedback it has collected so far. The first benchmark in a file is the
 * only one that runs while that feedback still describes a single callback: the
 * moment a second callback arrives, the optimized code is discarded with a
 * "wrong feedback cell" bailout and the replacement is generic, which it stays
 * for the rest of the process. Measured on a single-step `map` pipe, the first
 * benchmark of a file reads 22% to 25% high, and the plateau the following
 * benchmarks settle on is itself still 14% above the level reached once every
 * lazy utility (rather than only the one under test) has been exercised. No
 * application stays in either state, so benchmarks that skip this pass compare
 * implementations under an engine specialization they will never see in
 * production, and the error is not a constant offset: it favors some pipe
 * shapes over others and has been observed to flip the sign of a comparison.
 *
 * This module drives the real `pipe` through every lazy utility, over several
 * element kinds and iterable kinds, with callbacks of every arity, until the
 * generic versions are compiled. It is registered as a `setupFiles` entry of
 * the `bench` project, which shares one module graph (and therefore one set of
 * feedback vectors) with the benchmark files themselves.
 *
 * `pollutePipeCallSites` takes the implementation to drive so that a benchmark
 * comparing a candidate implementation against the shipped one can give both
 * the identical treatment; the shipped `pipe` is driven on import.
 */

import { difference } from "../src/difference";
import { differenceWith } from "../src/differenceWith";
import { drop } from "../src/drop";
import { filter } from "../src/filter";
import { find } from "../src/find";
import { first } from "../src/first";
import { flat } from "../src/flat";
import { flatMap } from "../src/flatMap";
import { forEach } from "../src/forEach";
import { intersection } from "../src/intersection";
import { intersectionWith } from "../src/intersectionWith";
import { map } from "../src/map";
import { mapWithFeedback } from "../src/mapWithFeedback";
import { pipe } from "../src/pipe";
import { take } from "../src/take";
import { unique } from "../src/unique";
import { uniqueBy } from "../src/uniqueBy";
import { uniqueWith } from "../src/uniqueWith";
import { zip } from "../src/zip";
import { zipWith } from "../src/zipWith";

// Every input is short: the goal is to reach the generic compiled versions with
// as many distinct shapes as possible, not to spend time in the loops.
const INTEGERS: readonly number[] = [3, 1, 4, 1, 5, 9, 2, 6];
const DOUBLES: readonly number[] = [3.5, 1.25, 4.75, 1.25, 5.5, 9.125];
const STRINGS: readonly string[] = [
  "delta",
  "alpha",
  "charlie",
  "alpha",
  "bravo",
];

type Person = { readonly id: number; readonly name: string };

const RECORDS: readonly Person[] = [
  { id: 3, name: "delta" },
  { id: 1, name: "alpha" },
  { id: 4, name: "charlie" },
  { id: 1, name: "alpha" },
];

const MIXED: readonly unknown[] = [1, "two", 3.5, true, RECORDS[0], INTEGERS];

// Distinct hidden classes, so that the property reads inside the pipe end up
// megamorphic on shape too. Without this a benchmark file that introduces its
// own object shape pays a "wrong map" re-optimization on its first benchmark.
const SHAPES: readonly object[] = [
  { id: 1 },
  { id: 2, name: "b" },
  { name: "c", id: 3 },
  { id: 4, name: "d", age: 40 },
  { id: 5, age: 50, extra: true },
  { label: "f", id: 6, age: 60, tags: STRINGS },
  { age: 70 },
];

const INTEGER_SET: ReadonlySet<number> = new Set(INTEGERS);

const TEXT = "abracadabra";

// Deduping and set operations need a second operand with real overlap.
const OTHER_INTEGERS: readonly number[] = [1, 2, 7];
const OTHER_RECORDS: readonly Person[] = [{ id: 1, name: "alpha" }];

function* generateIntegers(): Generator<number> {
  yield* INTEGERS;
}

// Assigning here keeps the calls from being dead-code eliminated, the same
// trick the benchmark files use.
const sink: { value: unknown } = { value: undefined };

// Enough to carry every driven function past the interpreter and the mid tiers
// into an optimized generic version. Verified with `--trace-deopt`: once the
// first benchmark starts, no call-target or feedback-cell bailout of `pipe`,
// the step machinery, or an evaluator closure happens. A benchmark file that
// introduces an object shape this pass never used can still trigger one "wrong
// map" re-optimization on the first benchmark that reads it; it fires during
// the warmup and was not measurable in the benchmark's own window.
const ROUNDS = 300;

/**
 * Drives `pipeImplementation` through the whole lazy surface so that its call
 * sites reach the state a real application puts them in.
 *
 * @param pipeImplementation - The `pipe` to exercise. Pass a candidate
 * implementation to give it the same treatment the shipped one gets on import.
 */
export function pollutePipeCallSites(pipeImplementation: typeof pipe): void {
  for (let round = 0; round < ROUNDS; round++) {
    polluteSingleSteps(pipeImplementation);
    polluteMultiSteps(pipeImplementation);
    polluteIterableKinds(pipeImplementation);
    polluteObjectShapes(pipeImplementation);
    polluteDataFirst();
  }
}

function polluteSingleSteps(pipeImplementation: typeof pipe): void {
  // One parameter.
  sink.value = pipeImplementation(
    INTEGERS,
    map((value) => value * 2),
  );
  sink.value = pipeImplementation(
    DOUBLES,
    map((value) => value + 0.5),
  );
  sink.value = pipeImplementation(
    STRINGS,
    map((value) => value.toUpperCase()),
  );
  sink.value = pipeImplementation(
    RECORDS,
    map((record) => record.name),
  );
  sink.value = pipeImplementation(
    MIXED,
    map((value) => typeof value),
  );
  sink.value = pipeImplementation(
    INTEGERS,
    filter((value) => value % 2 === 0),
  );
  sink.value = pipeImplementation(
    STRINGS,
    filter((value) => value.startsWith("a")),
  );
  sink.value = pipeImplementation(
    RECORDS,
    flatMap((record) => [record.id, record.id + 1]),
  );
  sink.value = pipeImplementation(
    STRINGS,
    flatMap((value) => value),
  );
  sink.value = pipeImplementation(
    INTEGERS,
    forEach((value) => {
      sink.value = value;
    }),
  );
  sink.value = pipeImplementation(
    RECORDS,
    find((record) => record.id === 4),
  );
  sink.value = pipeImplementation(
    INTEGERS,
    find((value) => value > 100),
  );
  sink.value = pipeImplementation(INTEGERS, first());
  sink.value = pipeImplementation(INTEGERS, take(3));
  sink.value = pipeImplementation(INTEGERS, take(0));
  sink.value = pipeImplementation(DOUBLES, drop(2));
  sink.value = pipeImplementation([INTEGERS, DOUBLES], flat());
  sink.value = pipeImplementation([[INTEGERS], [DOUBLES]], flat(2));
  sink.value = pipeImplementation(INTEGERS, unique());
  sink.value = pipeImplementation(
    RECORDS,
    uniqueBy((record) => record.name),
  );
  sink.value = pipeImplementation(
    RECORDS,
    uniqueWith((a, b) => a.id === b.id),
  );
  sink.value = pipeImplementation(INTEGERS, difference(OTHER_INTEGERS));
  sink.value = pipeImplementation(
    RECORDS,
    differenceWith(OTHER_RECORDS, (a, b) => a.id === b.id),
  );
  sink.value = pipeImplementation(INTEGERS, intersection(OTHER_INTEGERS));
  sink.value = pipeImplementation(
    RECORDS,
    intersectionWith(OTHER_RECORDS, (a, b) => a.id === b.id),
  );
  sink.value = pipeImplementation(INTEGERS, zip(DOUBLES));
  sink.value = pipeImplementation(
    INTEGERS,
    zipWith(DOUBLES, (a, b) => a + b),
  );
  sink.value = pipeImplementation(
    INTEGERS,
    mapWithFeedback((total, value) => total + value, 0),
  );

  // Two parameters.
  sink.value = pipeImplementation(
    INTEGERS,
    map((value, index) => value + index),
  );
  sink.value = pipeImplementation(
    STRINGS,
    filter((value, index) => index < value.length),
  );
  sink.value = pipeImplementation(
    RECORDS,
    flatMap((record, index) => [record.id, index]),
  );
  sink.value = pipeImplementation(
    INTEGERS,
    find((value, index) => value === index),
  );

  // Three parameters, which also turns on the `data` buffer.
  sink.value = pipeImplementation(
    INTEGERS,
    map((value, index, data) => data.length - index + value),
  );
  sink.value = pipeImplementation(
    DOUBLES,
    filter((value, index, data) => value > index && data.length > 0),
  );
  sink.value = pipeImplementation(
    RECORDS,
    forEach((record, index, data) => {
      sink.value = data.length + index + record.id;
    }),
  );
  sink.value = pipeImplementation(
    STRINGS,
    flatMap((value, index, data) => [value, `${index}/${data.length}`]),
  );
}

function polluteMultiSteps(pipeImplementation: typeof pipe): void {
  sink.value = pipeImplementation(
    RECORDS,
    filter((record) => record.id > 1),
    map((record) => record.name),
  );
  sink.value = pipeImplementation(
    INTEGERS,
    map((value) => value * 3),
    filter((value) => value > 5),
    map(String),
  );
  sink.value = pipeImplementation(
    RECORDS,
    flatMap((record) => [record.id, record.id]),
    filter((value) => value !== 1),
    take(3),
  );
  sink.value = pipeImplementation(
    INTEGERS,
    map((value) => value + 1),
    filter((value) => value % 2 === 0),
    first(),
  );
  sink.value = pipeImplementation(
    DOUBLES,
    map((value) => value * 1.5),
    unique(),
    drop(1),
    take(2),
  );
  sink.value = pipeImplementation(
    STRINGS,
    map((value) => value.length),
    filter((length) => length > 4),
    map((length) => length * 2),
    filter((length) => length < 20),
    map((length) => length + 1),
    find((length) => length > 0),
  );

  // Non-lazy steps between lazy ones split the run into separate sequences.
  sink.value = pipeImplementation(
    RECORDS,
    map((record) => record.id),
    (values) => [...values].sort((a, b) => a - b),
    filter((value) => value > 1),
  );
  sink.value = pipeImplementation(
    INTEGERS,
    (values) => values.slice(1),
    map((value) => value * 2),
    (values) => values.length,
  );
}

/**
 * `pipe` iterates anything with a `Symbol.iterator`, plus strings, while the
 * utilities only *type* array-likes, so the kinds below are reachable at
 * runtime and unreachable through the signatures. Each one is produced fresh
 * because a generator is consumed by the pipe that reads it.
 */
const ITERABLE_FACTORIES: readonly (() => Iterable<unknown>)[] = [
  () => INTEGERS,
  () => STRINGS,
  () => INTEGER_SET,
  () => generateIntegers(),
  () => TEXT,
];

function polluteIterableKinds(pipeImplementation: typeof pipe): void {
  for (const createIterable of ITERABLE_FACTORIES) {
    sink.value = pipeImplementation(
      // @ts-expect-error [ts2345] -- An `Iterable` isn't an `IterableContainer`; feeding these through on purpose is the point of this helper, see the comment above.
      createIterable(),
      map((value: unknown) => `${String(value)}!`),
    );
    sink.value = pipeImplementation(
      // @ts-expect-error [ts2345] -- An `Iterable` isn't an `IterableContainer`; feeding these through on purpose is the point of this helper, see the comment above.
      createIterable(),
      filter((value: unknown) => value !== 1),
      take(3),
    );
    sink.value = pipeImplementation(
      createIterable(),
      // @ts-expect-error [ts2345] -- An `Iterable` isn't an `IterableContainer`; feeding these through on purpose is the point of this helper, see the comment above.
      unique(),
    );
  }

  // A non-iterable input takes the plain-function path for every step.
  sink.value = pipeImplementation(
    42,
    (value) => value + 1,
    (value) => value * 2,
    String,
  );
}

/**
 * The data-first form of a `purryFromLazy` utility runs its lazy evaluator too,
 * so it reaches the same machinery from a different entry point.
 */
function polluteObjectShapes(pipeImplementation: typeof pipe): void {
  for (const shape of SHAPES) {
    sink.value = pipeImplementation(
      [shape, shape],
      map((value: object) => Object.keys(value).length),
    );
    sink.value = pipeImplementation(
      [shape, shape],
      filter((value: object) => "id" in value),
      map((value: object) => Object.values(value).length),
    );
  }
  sink.value = pipeImplementation(
    SHAPES,
    map((value) => value),
    filter((value) => Object.keys(value).length > 1),
    map((value) => value),
  );
}

function polluteDataFirst(): void {
  sink.value = unique(INTEGERS);
  sink.value = unique(STRINGS);
  sink.value = uniqueBy(RECORDS, (record) => record.name);
  sink.value = uniqueBy(INTEGERS, (value, index) => value + index);
  sink.value = uniqueWith(RECORDS, (a, b) => a.id === b.id);
  sink.value = difference(INTEGERS, OTHER_INTEGERS);
  sink.value = differenceWith(RECORDS, OTHER_RECORDS, (a, b) => a.id === b.id);
  sink.value = intersection(INTEGERS, OTHER_INTEGERS);
  sink.value = intersectionWith(
    RECORDS,
    OTHER_RECORDS,
    (a, b) => a.id === b.id,
  );
  sink.value = mapWithFeedback(
    DOUBLES,
    (total, value, index) => total + value * index,
    0,
  );
}

// eslint-disable-next-line unicorn/no-top-level-side-effects, vitest/require-hook -- Running on import is the mechanism: as a `setupFiles` entry this module shares its module graph, and therefore its feedback vectors, with the benchmark file, and the pass has to finish before the first benchmark starts.
pollutePipeCallSites(pipe);
