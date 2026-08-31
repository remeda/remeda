import { describe, expectTypeOf, test } from "vitest";
import { constant } from "./constant";
import { isDefined } from "./isDefined";
import { isNot } from "./isNot";
import { isNullish } from "./isNullish";
import { isNumber } from "./isNumber";
import { isString } from "./isString";
import { partition } from "./partition";
import { pipe } from "./pipe";

interface Cat {
  readonly type: "cat";
  readonly legs: number;
}

interface Legged {
  readonly legs: number;
  readonly tail: boolean;
}

interface Named {
  readonly name: string;
}

declare function isLegged(x: unknown): x is Legged;

declare function isNamed(x: unknown): x is Named;

test("partition with type guard", () => {
  expectTypeOf(partition([1, "a", 2, "b"], isNumber)).toEqualTypeOf<
    [number[], string[]]
  >();
});

test("narrows both sides when the predicate is wider than the item", () => {
  expectTypeOf(
    partition(["a", null] as (string | null)[], isNullish),
  ).toEqualTypeOf<[null[], string[]]>();
});

test("narrows tuples down to the matching items", () => {
  expectTypeOf(
    partition([1, "a", true] as [1, "a", true], isString),
  ).toEqualTypeOf<["a"[], (true | 1)[]]>();
});

test("readonly tuple", () => {
  expectTypeOf(partition([1, "a", true] as const, isString)).toEqualTypeOf<
    ["a"[], (true | 1)[]]
  >();
});

test("narrows with a guard incomparable to the item", () => {
  expectTypeOf(partition([] as Cat[], isLegged)).toEqualTypeOf<
    [(Cat & Legged)[], Cat[]]
  >();
});

test("object guard sharing no keys with the item", () => {
  expectTypeOf(partition([] as Cat[], isNamed)).toEqualTypeOf<
    [(Cat & Named)[], Cat[]]
  >();
});

test("narrows with a generic guard", () => {
  expectTypeOf(
    partition([1, undefined] as (number | undefined)[], isDefined),
  ).toEqualTypeOf<[number[], undefined[]]>();
});

test("narrows with a negated guard", () => {
  expectTypeOf(
    partition([1, "a"] as (number | string)[], isNot(isString)),
  ).toEqualTypeOf<[number[], string[]]>();
});

test("predicate is typed correctly", () => {
  partition([] as (number | string)[], (value, index, data) => {
    expectTypeOf(value).toEqualTypeOf<number | string>();
    expectTypeOf(index).toEqualTypeOf<number>();
    expectTypeOf(data).toEqualTypeOf<(number | string)[]>();

    return true;
  });
});

test("predicate disjoint from the item", () => {
  expectTypeOf(partition([] as string[], isNullish)).toEqualTypeOf<
    [never[], string[]]
  >();
});

test("`any` data", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Testing how the type reacts to `any` is the point of this test.
  expectTypeOf(partition([] as any[], isString)).toEqualTypeOf<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Testing how the type reacts to `any` is the point of this test.
    [string[], any[]]
  >();
});

test("`unknown` data", () => {
  expectTypeOf(partition([] as unknown[], isString)).toEqualTypeOf<
    [string[], unknown[]]
  >();
});

test("predicate with a mismatched param is an error", () => {
  // @ts-expect-error [ts2769] -- The predicate must accept the item type.
  partition([] as number[], (x: string) => x.length > 0);
});

test("non-guard predicate keeps both sides unnarrowed", () => {
  expectTypeOf(partition([1, "a"], constant(true))).toEqualTypeOf<
    [(number | string)[], (number | string)[]]
  >();
});

describe("data-last", () => {
  test("non-guard predicate", () => {
    expectTypeOf(pipe([1, "a"], partition(constant(true)))).toEqualTypeOf<
      [(number | string)[], (number | string)[]]
    >();
  });

  test("partition with type guard", () => {
    expectTypeOf(pipe([1, "a", 2, "b"], partition(isNumber))).toEqualTypeOf<
      [number[], string[]]
    >();
  });

  test("narrows both sides when the predicate is wider than the item", () => {
    expectTypeOf(
      pipe(["a", null] as (string | null)[], partition(isNullish)),
    ).toEqualTypeOf<[null[], string[]]>();
  });

  test("predicate disjoint from the item", () => {
    expectTypeOf(pipe([] as string[], partition(isNullish))).toEqualTypeOf<
      [never[], string[]]
    >();
  });

  test("generic guard", () => {
    expectTypeOf(
      pipe([1, undefined] as (number | undefined)[], partition(isDefined)),
    ).toEqualTypeOf<[number[], undefined[]]>();
  });

  test("negated guard", () => {
    expectTypeOf(
      pipe([1, "a"] as (number | string)[], partition(isNot(isString))),
    ).toEqualTypeOf<[number[], string[]]>();
  });

  test("narrows tuples down to the matching items", () => {
    expectTypeOf(
      pipe([1, "a", true] as const, partition(isString)),
    ).toEqualTypeOf<["a"[], (true | 1)[]]>();
  });

  test("narrows with a guard incomparable to the item", () => {
    expectTypeOf(pipe([] as Cat[], partition(isLegged))).toEqualTypeOf<
      [(Cat & Legged)[], Cat[]]
    >();
  });

  test("object guard sharing no keys with the item", () => {
    expectTypeOf(pipe([] as Cat[], partition(isNamed))).toEqualTypeOf<
      [(Cat & Named)[], Cat[]]
    >();
  });

  test("`any` data", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Testing how the type reacts to `any` is the point of this test.
    expectTypeOf(pipe([] as any[], partition(isString))).toEqualTypeOf<
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Testing how the type reacts to `any` is the point of this test.
      [string[], any[]]
    >();
  });

  test("predicate is typed correctly", () => {
    pipe(
      [] as (number | string)[],
      partition((value, index, data) => {
        expectTypeOf(value).toEqualTypeOf<number | string>();
        expectTypeOf(index).toEqualTypeOf<number>();
        expectTypeOf(data).toEqualTypeOf<(number | string)[]>();

        return true;
      }),
    );
  });
});
