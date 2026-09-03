import { describe, expectTypeOf, test } from "vitest";
import {
  isLegged,
  isNamed,
  type Cat,
  type Legged,
  type Named,
} from "../test/interfaces";
import { constant } from "./constant";
import { findLast } from "./findLast";
import { isArray } from "./isArray";
import { isNot } from "./isNot";
import { isString } from "./isString";
import { isTruthy } from "./isTruthy";
import { pipe } from "./pipe";

test("can narrow types", () => {
  expectTypeOf(findLast([1, "a"], isString)).toEqualTypeOf<
    string | undefined
  >();
});

test("narrows when the predicate is wider than the item", () => {
  expectTypeOf(
    findLast([[1], "a"] as (number[] | string)[], isArray),
  ).toEqualTypeOf<number[] | undefined>();
});

test("predicate disjoint from the item", () => {
  expectTypeOf(findLast([] as number[], isArray)).toEqualTypeOf<undefined>();
});

test("non-guard predicate", () => {
  expectTypeOf(findLast([1, "a"], constant(true))).toEqualTypeOf<
    number | string | undefined
  >();
});

test("narrows tuples down to the matching item", () => {
  expectTypeOf(
    findLast([1, "a", true] as [1, "a", true], isString),
  ).toEqualTypeOf<"a" | undefined>();
});

test("accepts a union of array types", () => {
  expectTypeOf(findLast([] as string[] | number[], isString)).toEqualTypeOf<
    string | undefined
  >();
});

test("readonly tuple", () => {
  expectTypeOf(findLast([1, "a", true] as const, isString)).toEqualTypeOf<
    "a" | undefined
  >();
});

test("narrows with a guard incomparable to the item", () => {
  expectTypeOf(findLast([] as Cat[], isLegged)).toEqualTypeOf<
    (Cat & Legged) | undefined
  >();
});

test("object guard sharing no keys with the item", () => {
  expectTypeOf(findLast([] as Cat[], isNamed)).toEqualTypeOf<
    (Cat & Named) | undefined
  >();
});

test("`any` data", () => {
  expectTypeOf(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Testing how the type reacts to `any` is the point of this test.
    findLast([] as any[], isString),
  ).toEqualTypeOf<string | undefined>();
});

test("`unknown` data", () => {
  expectTypeOf(findLast([] as unknown[], isString)).toEqualTypeOf<
    string | undefined
  >();
});

test("narrows with a generic guard", () => {
  expectTypeOf(findLast(["a", 0] as (string | 0)[], isTruthy)).toEqualTypeOf<
    string | undefined
  >();
});

test("narrows with a negated guard", () => {
  expectTypeOf(
    findLast([1, "a"] as (number | string)[], isNot(isString)),
  ).toEqualTypeOf<number | undefined>();
});

test("predicate is typed correctly", () => {
  findLast([] as (number | string)[], (value, index, data) => {
    expectTypeOf(value).toEqualTypeOf<number | string>();
    expectTypeOf(index).toEqualTypeOf<number>();
    expectTypeOf(data).toEqualTypeOf<(number | string)[]>();

    return true;
  });
});

test("predicate with a mismatched param is an error", () => {
  // @ts-expect-error [ts2769] -- The predicate must accept the item type.
  findLast([] as number[], (x: string) => x.length > 0);
});

describe("data-last", () => {
  test("narrowing predicate", () => {
    expectTypeOf(pipe([1, "a"], findLast(isString))).toEqualTypeOf<
      string | undefined
    >();
  });

  test("predicate is wider than the item", () => {
    expectTypeOf(
      pipe([[1], "a"] as (number[] | string)[], findLast(isArray)),
    ).toEqualTypeOf<number[] | undefined>();
  });

  test("non-guard predicate", () => {
    expectTypeOf(pipe([1, "a"], findLast(constant(true)))).toEqualTypeOf<
      number | string | undefined
    >();
  });

  test("predicate disjoint from the item", () => {
    expectTypeOf(
      pipe([] as number[], findLast(isArray)),
    ).toEqualTypeOf<undefined>();
  });

  test("generic guard", () => {
    expectTypeOf(
      pipe(["a", 0] as (string | 0)[], findLast(isTruthy)),
    ).toEqualTypeOf<string | undefined>();
  });

  test("negated guard", () => {
    expectTypeOf(
      pipe([1, "a"] as (number | string)[], findLast(isNot(isString))),
    ).toEqualTypeOf<number | undefined>();
  });

  test("narrows tuples down to the matching item", () => {
    expectTypeOf(
      pipe([1, "a", true] as const, findLast(isString)),
    ).toEqualTypeOf<"a" | undefined>();
  });

  test("guard incomparable to the item", () => {
    expectTypeOf(pipe([] as Cat[], findLast(isLegged))).toEqualTypeOf<
      (Cat & Legged) | undefined
    >();
  });

  test("object guard sharing no keys with the item", () => {
    expectTypeOf(pipe([] as Cat[], findLast(isNamed))).toEqualTypeOf<
      (Cat & Named) | undefined
    >();
  });

  test("`any` data", () => {
    expectTypeOf(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Testing how the type reacts to `any` is the point of this test.
      pipe([] as any[], findLast(isString)),
    ).toEqualTypeOf<string | undefined>();
  });

  test("predicate is typed correctly", () => {
    pipe(
      [] as (number | string)[],
      findLast((value, index, data) => {
        expectTypeOf(value).toEqualTypeOf<number | string>();
        expectTypeOf(index).toEqualTypeOf<number>();
        expectTypeOf(data).toEqualTypeOf<(number | string)[]>();

        return true;
      }),
    );
  });
});
