import { describe, expectTypeOf, test } from "vitest";
import { $typed } from "../test/$typed";
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
import { isPlainObject } from "./isPlainObject";
import { isString } from "./isString";
import { isTruthy } from "./isTruthy";
import { pipe } from "./pipe";

test("can narrow types", () => {
  expectTypeOf(findLast([] as (number | string)[], isString)).toEqualTypeOf<
    string | undefined
  >();
});

test("array where every item matches", () => {
  expectTypeOf(findLast([] as string[], isString)).toEqualTypeOf<
    string | undefined
  >();
});

test("narrows when the predicate is wider than the item", () => {
  expectTypeOf(
    findLast([[1], "a"] as (number[] | string)[], isArray),
  ).toEqualTypeOf<number[] | undefined>();
});

test("accepts a union of array types", () => {
  expectTypeOf(findLast([] as string[] | number[], isString)).toEqualTypeOf<
    string | undefined
  >();
});

test("predicate disjoint from the item", () => {
  expectTypeOf(findLast([] as number[], isArray)).toEqualTypeOf<undefined>();
});

test("readonly tuple", () => {
  expectTypeOf(
    findLast([1, "a", true] as const, isString),
  ).toEqualTypeOf<"a">();
});

test("readonly array", () => {
  expectTypeOf(
    findLast([] as readonly (number | string)[], isString),
  ).toEqualTypeOf<string | undefined>();
});

test("narrows with a guard incomparable to the item", () => {
  expectTypeOf(findLast([] as Cat[], isLegged)).toEqualTypeOf<
    (Cat & Legged) | undefined
  >();
});

test("guard incomparable to a tuple item", () => {
  expectTypeOf(findLast($typed<[Cat]>(), isLegged)).toEqualTypeOf<
    (Cat & Legged) | undefined
  >();
});

test("object guard sharing no keys with the item", () => {
  expectTypeOf(findLast([] as Cat[], isNamed)).toEqualTypeOf<
    (Cat & Named) | undefined
  >();
});

test("isPlainObject guard on interface items", () => {
  expectTypeOf(findLast([] as Cat[], isPlainObject)).toEqualTypeOf<
    (Cat & Record<PropertyKey, unknown>) | undefined
  >();
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

describe("guaranteed match", () => {
  test("tuple", () => {
    expectTypeOf(
      findLast([1, "a", true] as [number, string, boolean], isString),
    ).toEqualTypeOf<string>();
  });

  test("before a possible match", () => {
    expectTypeOf(
      findLast(["a", 1] as [string, number | string], isString),
    ).toEqualTypeOf<string>();
  });

  test("non-empty array", () => {
    expectTypeOf(
      findLast(["a"] as [string, ...number[]], isString),
    ).toEqualTypeOf<string>();
  });

  test("suffix", () => {
    expectTypeOf(
      findLast(["a"] as [...number[], string], isString),
    ).toEqualTypeOf<string>();
  });

  test("stops at the last guaranteed match", () => {
    expectTypeOf(
      findLast(["a", "b", "c"] as ["a", "b", 1 | "c"], isString),
    ).toEqualTypeOf<"b" | "c">();
  });

  test("before an optional item", () => {
    expectTypeOf(
      findLast(["a"] as [string, number?], isString),
    ).toEqualTypeOf<string>();
  });

  test("after a rest item", () => {
    expectTypeOf(
      findLast([true, "a"] as [boolean, ...number[], string], isString),
    ).toEqualTypeOf<string>();
  });

  test("predicate wider than the item", () => {
    expectTypeOf(
      findLast(["a", [1]] as [string, number[]], isArray),
    ).toEqualTypeOf<number[]>();
  });

  test("only in some members of a union of arrays", () => {
    expectTypeOf(findLast([] as [string] | number[], isString)).toEqualTypeOf<
      string | undefined
    >();
  });
});

describe("possible match", () => {
  test("union item", () => {
    expectTypeOf(
      findLast([true, 1] as [boolean, number | string], isString),
    ).toEqualTypeOf<string | undefined>();
  });

  test("optional item", () => {
    expectTypeOf(findLast([] as [string?], isString)).toEqualTypeOf<
      string | undefined
    >();
  });

  test("rest item", () => {
    expectTypeOf(
      findLast([1] as [number, ...string[]], isString),
    ).toEqualTypeOf<string | undefined>();
  });

  test("union of tuples", () => {
    expectTypeOf(
      findLast(["a"] as [string] | [number], isString),
    ).toEqualTypeOf<string | undefined>();
  });

  test("optional item before a rest item", () => {
    expectTypeOf(
      findLast([] as [number?, ...string[]], isString),
    ).toEqualTypeOf<string | undefined>();
  });

  test("suffix item", () => {
    expectTypeOf(
      findLast(["a"] as [...number[], number | string], isString),
    ).toEqualTypeOf<string | undefined>();
  });

  test("prefix and rest items", () => {
    expectTypeOf(
      findLast([true] as [boolean | string, ...(number | string)[]], isString),
    ).toEqualTypeOf<string | undefined>();
  });
});

describe("no match", () => {
  test("empty tuple", () => {
    expectTypeOf(findLast([] as [], isString)).toEqualTypeOf<undefined>();
  });

  test("tuple", () => {
    expectTypeOf(
      findLast([1, true] as [number, boolean], isString),
    ).toEqualTypeOf<undefined>();
  });

  test("optional item", () => {
    expectTypeOf(
      findLast([] as [number?], isString),
    ).toEqualTypeOf<undefined>();
  });
});

describe("non-guard predicate", () => {
  test("array", () => {
    expectTypeOf(
      findLast([] as (number | string)[], constant($typed<boolean>())),
    ).toEqualTypeOf<number | string | undefined>();
  });

  test("tuple", () => {
    expectTypeOf(
      findLast([1, "a"] as [number, string], constant($typed<boolean>())),
    ).toEqualTypeOf<number | string | undefined>();
  });

  test("trivial acceptor on an array", () => {
    expectTypeOf(findLast([] as number[], constant(true))).toEqualTypeOf<
      number | undefined
    >();
  });

  test("trivial acceptor on a tuple", () => {
    expectTypeOf(
      findLast([1, "a"] as [number, string], constant(true)),
    ).toEqualTypeOf<string>();
  });

  test("trivial acceptor on an array with a suffix", () => {
    expectTypeOf(
      findLast(["a"] as [...number[], string], constant(true)),
    ).toEqualTypeOf<string>();
  });

  test("trivial rejector", () => {
    expectTypeOf(
      findLast([1, "a"] as [number, string], constant(false)),
    ).toEqualTypeOf<undefined>();
  });
});

test("predicate is typed correctly", () => {
  findLast([] as (number | string)[], (value, index, data) => {
    expectTypeOf(value).toEqualTypeOf<number | string>();
    expectTypeOf(index).toEqualTypeOf<number>();
    expectTypeOf(data).toEqualTypeOf<(number | string)[]>();

    return true;
  });
});

test("predicate is typed correctly for tuples", () => {
  findLast([1, "a"] as [number, string], (value, index, data) => {
    expectTypeOf(value).toEqualTypeOf<number | string>();
    expectTypeOf(index).toEqualTypeOf<number>();
    expectTypeOf(data).toEqualTypeOf<[number, string]>();

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
    expectTypeOf(
      pipe([1, "a"] as [number, string], findLast(constant($typed<boolean>()))),
    ).toEqualTypeOf<number | string | undefined>();
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

  test("readonly tuple", () => {
    expectTypeOf(
      pipe([1, "a", true] as const, findLast(isString)),
    ).toEqualTypeOf<"a">();
  });

  test("guaranteed match", () => {
    expectTypeOf(
      pipe([1, "a", true] as [number, string, boolean], findLast(isString)),
    ).toEqualTypeOf<string>();
  });

  test("possible match", () => {
    expectTypeOf(
      pipe([true, 1] as [boolean, number | string], findLast(isString)),
    ).toEqualTypeOf<string | undefined>();
  });

  test("no match", () => {
    expectTypeOf(
      pipe([1, true] as [number, boolean], findLast(isString)),
    ).toEqualTypeOf<undefined>();
  });

  test("trivial acceptor on a tuple", () => {
    expectTypeOf(
      pipe([1, "a"] as [number, string], findLast(constant(true))),
    ).toEqualTypeOf<string>();
  });

  test("trivial rejector", () => {
    expectTypeOf(
      pipe([1, "a"] as [number, string], findLast(constant(false))),
    ).toEqualTypeOf<undefined>();
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
