import { describe, expect, test } from "vitest";
import { identity } from "../identity";
import {
  lazyDataLastImplementation,
  type LazyEvaluatorFactory,
  type LazyUnaryFunction,
} from "./lazyDataLastImplementation";
import { makeReducing } from "./makeReducing";
import { makeStoppable } from "./makeStoppable";
import { findSequentialSequenceEnd } from "./sequentialSequence";

describe("no function can stop", () => {
  test("ends with the functions", () => {
    expect(findSequentialSequenceEnd([lazy(), lazy()], 0)).toBe(2);
  });

  test("ends at a non-lazy function", () => {
    expect(findSequentialSequenceEnd([lazy(), identity(), lazy()], 0)).toBe(1);
  });

  test("ends after a reducing function", () => {
    expect(findSequentialSequenceEnd([lazy(), reducing(), lazy()], 0)).toBe(2);
  });

  test("starts at `startIndex`", () => {
    expect(findSequentialSequenceEnd([identity(), lazy(), lazy()], 1)).toBe(3);
  });
});

describe("a function can stop", () => {
  test("first in the sequence", () => {
    expect(findSequentialSequenceEnd([stoppable(), lazy()], 0)).toBe(0);
  });

  test("later in the sequence", () => {
    expect(findSequentialSequenceEnd([lazy(), stoppable()], 0)).toBe(0);
  });

  test("while reducing", () => {
    expect(findSequentialSequenceEnd([lazy(), stoppableReducing()], 0)).toBe(0);
  });

  test("in a sequence that isn't first", () => {
    expect(
      findSequentialSequenceEnd([identity(), lazy(), stoppable()], 1),
    ).toBe(1);
  });
});

describe("a function that can stop outside the sequence", () => {
  test("before `startIndex`", () => {
    expect(
      findSequentialSequenceEnd([stoppable(), identity(), lazy()], 2),
    ).toBe(3);
  });

  test("after a non-lazy function", () => {
    expect(
      findSequentialSequenceEnd([lazy(), identity(), stoppable()], 0),
    ).toBe(1);
  });

  test("after a reducing function", () => {
    expect(
      findSequentialSequenceEnd([lazy(), reducing(), stoppable()], 0),
    ).toBe(2);
  });
});

const lazy = (): LazyUnaryFunction => lazyFunction(neverBuilt);

const stoppable = (): LazyUnaryFunction =>
  lazyFunction(makeStoppable(() => neverBuilt()));

const reducing = (): LazyUnaryFunction =>
  lazyFunction(makeReducing(() => neverBuilt()));

const stoppableReducing = (): LazyUnaryFunction =>
  lazyFunction(makeReducing(makeStoppable(() => neverBuilt())));

const lazyFunction = (
  lazyImplementation: LazyEvaluatorFactory<readonly unknown[], never>,
): LazyUnaryFunction =>
  lazyDataLastImplementation(
    () => {
      throw new Error("Intentional! planning doesn't run the functions");
    },
    // @ts-expect-error [ts2322] -- The helper never reads `lazyArgs` when planning, so the empty arguments can stand in for the `never` of the default `LazyUnaryFunction`, which is what lets it hold any lazy function.
    [],
    lazyImplementation,
  );

function neverBuilt(): never {
  throw new Error("Intentional! planning doesn't build the evaluators");
}
