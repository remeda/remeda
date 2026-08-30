import { describe, expectTypeOf, test } from "vitest";
import { constant } from "./constant";
import { find } from "./find";
import { isArray } from "./isArray";
import { isNot } from "./isNot";
import { isPlainObject } from "./isPlainObject";
import { isString } from "./isString";
import { isTruthy } from "./isTruthy";
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

test("can narrow types", () => {
  expectTypeOf(find([1, "a"], isString)).toEqualTypeOf<string | undefined>();
});

test("narrows when the predicate is wider than the item", () => {
  expectTypeOf(
    find([[1], "a"] as (number[] | string)[], isArray),
  ).toEqualTypeOf<number[] | undefined>();
});

test("narrows tuples down to the matching item", () => {
  expectTypeOf(find([1, "a", true] as [1, "a", true], isString)).toEqualTypeOf<
    "a" | undefined
  >();
});

test("accepts a union of array types", () => {
  expectTypeOf(find([] as string[] | number[], isString)).toEqualTypeOf<
    string | undefined
  >();
});

test("predicate disjoint from the item", () => {
  expectTypeOf(find([] as number[], isArray)).toEqualTypeOf<undefined>();
});

test("non-guard predicate", () => {
  expectTypeOf(find([1, "a"], constant(true))).toEqualTypeOf<
    number | string | undefined
  >();
});

test("readonly tuple", () => {
  expectTypeOf(find([1, "a", true] as const, isString)).toEqualTypeOf<
    "a" | undefined
  >();
});

test("narrows with a guard incomparable to the item", () => {
  expectTypeOf(find([] as Cat[], isLegged)).toEqualTypeOf<
    (Cat & Legged) | undefined
  >();
});

test("object guard sharing no keys with the item", () => {
  expectTypeOf(find([] as Cat[], isNamed)).toEqualTypeOf<undefined>();
});

test("isPlainObject guard on interface items", () => {
  expectTypeOf(find([] as Cat[], isPlainObject)).toEqualTypeOf<
    (Cat & Record<PropertyKey, unknown>) | undefined
  >();
});

test("`any` data", () => {
  expectTypeOf(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Testing how the type reacts to `any` is the point of this test.
    find([] as any[], isString),
  ).toEqualTypeOf<string | undefined>();
});

test("`unknown` data", () => {
  expectTypeOf(find([] as unknown[], isString)).toEqualTypeOf<
    string | undefined
  >();
});

test("narrows with a generic guard", () => {
  expectTypeOf(find(["a", 0] as (string | 0)[], isTruthy)).toEqualTypeOf<
    string | undefined
  >();
});

test("narrows with a negated guard", () => {
  expectTypeOf(
    find([1, "a"] as (number | string)[], isNot(isString)),
  ).toEqualTypeOf<number | undefined>();
});

test("predicate is typed correctly", () => {
  find([] as (number | string)[], (value, index, data) => {
    expectTypeOf(value).toEqualTypeOf<number | string>();
    expectTypeOf(index).toEqualTypeOf<number>();
    expectTypeOf(data).toEqualTypeOf<(number | string)[]>();

    return true;
  });
});

test("predicate is typed correctly for tuples", () => {
  find([1, "a"] as [number, string], (value, index, data) => {
    expectTypeOf(value).toEqualTypeOf<number | string>();
    expectTypeOf(index).toEqualTypeOf<number>();
    expectTypeOf(data).toEqualTypeOf<[number, string]>();

    return true;
  });
});

test("predicate with a mismatched param is an error", () => {
  // @ts-expect-error [ts2769] -- The predicate must accept the item type.
  find([] as number[], (x: string) => x.length > 0);
});

describe("data-last", () => {
  test("narrowing predicate", () => {
    expectTypeOf(pipe([1, "a"], find(isString))).toEqualTypeOf<
      string | undefined
    >();
  });

  test("predicate is wider than the item", () => {
    expectTypeOf(
      pipe([[1], "a"] as (number[] | string)[], find(isArray)),
    ).toEqualTypeOf<number[] | undefined>();
  });

  test("non-guard predicate", () => {
    expectTypeOf(pipe([1, "a"], find(constant(true)))).toEqualTypeOf<
      number | string | undefined
    >();
  });

  test("predicate disjoint from the item", () => {
    expectTypeOf(
      pipe([] as number[], find(isArray)),
    ).toEqualTypeOf<undefined>();
  });

  test("generic guard", () => {
    expectTypeOf(
      pipe(["a", 0] as (string | 0)[], find(isTruthy)),
    ).toEqualTypeOf<string | undefined>();
  });

  test("negated guard", () => {
    expectTypeOf(
      pipe([1, "a"] as (number | string)[], find(isNot(isString))),
    ).toEqualTypeOf<number | undefined>();
  });

  test("narrows tuples down to the matching item", () => {
    expectTypeOf(pipe([1, "a", true] as const, find(isString))).toEqualTypeOf<
      "a" | undefined
    >();
  });

  test("guard incomparable to the item", () => {
    expectTypeOf(pipe([] as Cat[], find(isLegged))).toEqualTypeOf<
      (Cat & Legged) | undefined
    >();
  });

  test("object guard sharing no keys with the item", () => {
    expectTypeOf(pipe([] as Cat[], find(isNamed))).toEqualTypeOf<undefined>();
  });

  test("`any` data", () => {
    expectTypeOf(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Testing how the type reacts to `any` is the point of this test.
      pipe([] as any[], find(isString)),
    ).toEqualTypeOf<string | undefined>();
  });

  test("predicate is typed correctly", () => {
    pipe(
      [] as (number | string)[],
      find((value, index, data) => {
        expectTypeOf(value).toEqualTypeOf<number | string>();
        expectTypeOf(index).toEqualTypeOf<number>();
        expectTypeOf(data).toEqualTypeOf<(number | string)[]>();

        return true;
      }),
    );
  });
});
