import { describe, expectTypeOf, test } from "vitest";
import type { IterableContainer } from "./IterableContainer";
import type { TupleSplits } from "./TupleSplits";

declare function tupleSplits<T extends IterableContainer>(x: T): TupleSplits<T>;

describe("all tuple shapes", () => {
  test("empty tuple", () => {
    expectTypeOf(tupleSplits([])).toEqualTypeOf<{ left: []; right: [] }>();

    expectTypeOf(tupleSplits([] as const)).toEqualTypeOf<{
      left: [];
      right: [];
    }>();
  });

  test("fixed tuple", () => {
    expectTypeOf(tupleSplits([1, 2, 3] as [1, 2, 3])).toEqualTypeOf<
      | { left: [1, 2, 3]; right: [] }
      | { left: [1, 2]; right: [3] }
      | { left: [1]; right: [2, 3] }
      | { left: []; right: [1, 2, 3] }
    >();

    expectTypeOf(tupleSplits([1, 2, 3] as const)).toEqualTypeOf<
      | { left: [1, 2, 3]; right: [] }
      | { left: [1, 2]; right: [3] }
      | { left: [1]; right: [2, 3] }
      | { left: []; right: [1, 2, 3] }
    >();
  });

  test("optional tuple", () => {
    expectTypeOf(tupleSplits([] as [1?, 2?, 3?])).toEqualTypeOf<
      | { left: [1?, 2?, 3?]; right: [] }
      | { left: [1?, 2?]; right: [3?] }
      | { left: [1?]; right: [2?, 3?] }
      | { left: []; right: [1?, 2?, 3?] }
    >();

    expectTypeOf(tupleSplits([] as readonly [1?, 2?, 3?])).toEqualTypeOf<
      | { left: [1?, 2?, 3?]; right: [] }
      | { left: [1?, 2?]; right: [3?] }
      | { left: [1?]; right: [2?, 3?] }
      | { left: []; right: [1?, 2?, 3?] }
    >();
  });

  test("mixed tuple", () => {
    expectTypeOf(tupleSplits([1, 2] as [1, 2, 3?, 4?])).toEqualTypeOf<
      | { left: [1, 2, 3?, 4?]; right: [] }
      | { left: [1, 2, 3?]; right: [4?] }
      | { left: [1, 2]; right: [3?, 4?] }
      | { left: [1]; right: [2, 3?, 4?] }
      | { left: []; right: [1, 2, 3?, 4?] }
    >();

    expectTypeOf(tupleSplits([1, 2] as readonly [1, 2, 3?, 4?])).toEqualTypeOf<
      | { left: [1, 2, 3?, 4?]; right: [] }
      | { left: [1, 2, 3?]; right: [4?] }
      | { left: [1, 2]; right: [3?, 4?] }
      | { left: [1]; right: [2, 3?, 4?] }
      | { left: []; right: [1, 2, 3?, 4?] }
    >();
  });

  test("array", () => {
    expectTypeOf(tupleSplits([] as number[])).toEqualTypeOf<
      | { left: number[]; right: [] }
      | { left: number[]; right: number[] }
      | { left: []; right: number[] }
    >();

    expectTypeOf(tupleSplits([] as readonly number[])).toEqualTypeOf<
      | { left: number[]; right: [] }
      | { left: number[]; right: number[] }
      | { left: []; right: number[] }
    >();
  });

  test("fixed-prefix array", () => {
    expectTypeOf(tupleSplits([1, 2] as [1, 2, ...3[]])).toEqualTypeOf<
      | { left: [1, 2, ...3[]]; right: [] }
      | { left: [1, 2, ...3[]]; right: 3[] }
      | { left: [1, 2]; right: 3[] }
      | { left: [1]; right: [2, ...3[]] }
      | { left: []; right: [1, 2, ...3[]] }
    >();

    expectTypeOf(tupleSplits([1, 2] as readonly [1, 2, ...3[]])).toEqualTypeOf<
      | { left: [1, 2, ...3[]]; right: [] }
      | { left: [1, 2, ...3[]]; right: 3[] }
      | { left: [1, 2]; right: 3[] }
      | { left: [1]; right: [2, ...3[]] }
      | { left: []; right: [1, 2, ...3[]] }
    >();
  });

  test("optional-prefix array", () => {
    expectTypeOf(tupleSplits([] as [1?, 2?, ...3[]])).toEqualTypeOf<
      | { left: [1?, 2?, ...3[]]; right: [] }
      | { left: [1?, 2?, ...3[]]; right: 3[] }
      | { left: [1?, 2?]; right: 3[] }
      | { left: [1?]; right: [2?, ...3[]] }
      | { left: []; right: [1?, 2?, ...3[]] }
    >();

    expectTypeOf(tupleSplits([] as readonly [1?, 2?, ...3[]])).toEqualTypeOf<
      | { left: [1?, 2?, ...3[]]; right: [] }
      | { left: [1?, 2?, ...3[]]; right: 3[] }
      | { left: [1?, 2?]; right: 3[] }
      | { left: [1?]; right: [2?, ...3[]] }
      | { left: []; right: [1?, 2?, ...3[]] }
    >();
  });

  test("mixed-prefix array", () => {
    expectTypeOf(tupleSplits([1, 2] as [1, 2, 3?, 4?, ...5[]])).toEqualTypeOf<
      | { left: [1, 2, 3?, 4?, ...5[]]; right: [] }
      | { left: [1, 2, 3?, 4?, ...5[]]; right: 5[] }
      | { left: [1, 2, 3?, 4?]; right: 5[] }
      | { left: [1, 2, 3?]; right: [4?, ...5[]] }
      | { left: [1, 2]; right: [3?, 4?, ...5[]] }
      | { left: [1]; right: [2, 3?, 4?, ...5[]] }
      | { left: []; right: [1, 2, 3?, 4?, ...5[]] }
    >();

    expectTypeOf(
      tupleSplits([1, 2] as readonly [1, 2, 3?, 4?, ...5[]]),
    ).toEqualTypeOf<
      | { left: [1, 2, 3?, 4?, ...5[]]; right: [] }
      | { left: [1, 2, 3?, 4?, ...5[]]; right: 5[] }
      | { left: [1, 2, 3?, 4?]; right: 5[] }
      | { left: [1, 2, 3?]; right: [4?, ...5[]] }
      | { left: [1, 2]; right: [3?, 4?, ...5[]] }
      | { left: [1]; right: [2, 3?, 4?, ...5[]] }
      | { left: []; right: [1, 2, 3?, 4?, ...5[]] }
    >();
  });

  test("fixed-suffix array", () => {
    expectTypeOf(tupleSplits([2, 3] as [...1[], 2, 3])).toEqualTypeOf<
      | { left: [...1[], 2, 3]; right: [] }
      | { left: [...1[], 2]; right: [3] }
      | { left: 1[]; right: [2, 3] }
      | { left: 1[]; right: [...1[], 2, 3] }
      | { left: []; right: [...1[], 2, 3] }
    >();

    expectTypeOf(tupleSplits([2, 3] as readonly [...1[], 2, 3])).toEqualTypeOf<
      | { left: [...1[], 2, 3]; right: [] }
      | { left: [...1[], 2]; right: [3] }
      | { left: 1[]; right: [2, 3] }
      | { left: 1[]; right: [...1[], 2, 3] }
      | { left: []; right: [...1[], 2, 3] }
    >();
  });

  test("fixed-elements array", () => {
    expectTypeOf(
      tupleSplits([1, 2, 4, 5] as [1, 2, ...3[], 4, 5]),
    ).toEqualTypeOf<
      | { left: [1, 2, ...3[], 4, 5]; right: [] }
      | { left: [1, 2, ...3[], 4]; right: [5] }
      | { left: [1, 2, ...3[]]; right: [4, 5] }
      | { left: [1, 2, ...3[]]; right: [...3[], 4, 5] }
      | { left: [1, 2]; right: [...3[], 4, 5] }
      | { left: [1]; right: [2, ...3[], 4, 5] }
      | { left: []; right: [1, 2, ...3[], 4, 5] }
    >();

    expectTypeOf(
      tupleSplits([1, 2, 4, 5] as readonly [1, 2, ...3[], 4, 5]),
    ).toEqualTypeOf<
      | { left: [1, 2, ...3[], 4, 5]; right: [] }
      | { left: [1, 2, ...3[], 4]; right: [5] }
      | { left: [1, 2, ...3[]]; right: [4, 5] }
      | { left: [1, 2, ...3[]]; right: [...3[], 4, 5] }
      | { left: [1, 2]; right: [...3[], 4, 5] }
      | { left: [1]; right: [2, ...3[], 4, 5] }
      | { left: []; right: [1, 2, ...3[], 4, 5] }
    >();
  });
});

describe("unions", () => {
  test("union of arrays", () => {
    expectTypeOf(tupleSplits([] as boolean[] | number[])).toEqualTypeOf<
      | { left: []; right: boolean[] }
      | { left: boolean[]; right: boolean[] }
      | { left: boolean[]; right: [] }
      | { left: []; right: number[] }
      | { left: number[]; right: number[] }
      | { left: number[]; right: [] }
    >();
  });

  test("mixed unions", () => {
    expectTypeOf(tupleSplits([] as boolean[] | [number, string])).toEqualTypeOf<
      | { left: []; right: boolean[] }
      | { left: boolean[]; right: boolean[] }
      | { left: boolean[]; right: [] }
      | { left: []; right: [number, string] }
      | { left: [number]; right: [string] }
      | { left: [number, string]; right: [] }
    >();
  });
});
