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
import { find } from "./find";
import { isArray } from "./isArray";
import { isNot } from "./isNot";
import { isPlainObject } from "./isPlainObject";
import { isString } from "./isString";
import { isTruthy } from "./isTruthy";
import { pipe } from "./pipe";

test("can narrow types", () => {
  expectTypeOf(find([] as (number | string)[], isString)).toEqualTypeOf<
    string | undefined
  >();
});

test("array where every item matches", () => {
  expectTypeOf(find([] as string[], isString)).toEqualTypeOf<
    string | undefined
  >();
});

test("narrows when the predicate is wider than the item", () => {
  expectTypeOf(
    find([[1], "a"] as (number[] | string)[], isArray),
  ).toEqualTypeOf<number[] | undefined>();
});

test("accepts a union of array types", () => {
  expectTypeOf(find([] as string[] | number[], isString)).toEqualTypeOf<
    string | undefined
  >();
});

test("predicate disjoint from the item", () => {
  expectTypeOf(find([] as number[], isArray)).toEqualTypeOf<undefined>();
});

test("readonly tuple", () => {
  expectTypeOf(find([1, "a", true] as const, isString)).toEqualTypeOf<"a">();
});

test("readonly array", () => {
  expectTypeOf(
    find([] as readonly (number | string)[], isString),
  ).toEqualTypeOf<string | undefined>();
});

test("narrows with a guard incomparable to the item", () => {
  expectTypeOf(find([] as Cat[], isLegged)).toEqualTypeOf<
    (Cat & Legged) | undefined
  >();
});

test("guard incomparable to a tuple item", () => {
  expectTypeOf(find($typed<[Cat]>(), isLegged)).toEqualTypeOf<
    (Cat & Legged) | undefined
  >();
});

test("object guard sharing no keys with the item", () => {
  expectTypeOf(find([] as Cat[], isNamed)).toEqualTypeOf<
    (Cat & Named) | undefined
  >();
});

test("isPlainObject guard on interface items", () => {
  expectTypeOf(find([] as Cat[], isPlainObject)).toEqualTypeOf<
    (Cat & Record<PropertyKey, unknown>) | undefined
  >();
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

describe("guaranteed match", () => {
  test("tuple", () => {
    expectTypeOf(
      find([1, "a", true] as [number, string, boolean], isString),
    ).toEqualTypeOf<string>();
  });

  test("after a possible match", () => {
    expectTypeOf(
      find([1, "a"] as [number | string, string], isString),
    ).toEqualTypeOf<string>();
  });

  test("non-empty array", () => {
    expectTypeOf(
      find(["a"] as [string, ...number[]], isString),
    ).toEqualTypeOf<string>();
  });

  test("suffix", () => {
    expectTypeOf(
      find(["a"] as [...number[], string], isString),
    ).toEqualTypeOf<string>();
  });

  test("stops at the first guaranteed match", () => {
    expectTypeOf(
      find(["a", "b", "c"] as [1 | "a", "b", "c"], isString),
    ).toEqualTypeOf<"a" | "b">();
  });

  test("before an optional item", () => {
    expectTypeOf(
      find(["a"] as [string, number?], isString),
    ).toEqualTypeOf<string>();
  });

  test("before a rest item", () => {
    expectTypeOf(
      find(["a", true] as [string, ...number[], boolean], isString),
    ).toEqualTypeOf<string>();
  });

  test("predicate wider than the item", () => {
    expectTypeOf(find([[1], "a"] as [number[], string], isArray)).toEqualTypeOf<
      number[]
    >();
  });

  test("only in some members of a union of arrays", () => {
    expectTypeOf(find([] as [string] | number[], isString)).toEqualTypeOf<
      string | undefined
    >();
  });
});

describe("possible match", () => {
  test("union item", () => {
    expectTypeOf(
      find([1, true] as [number | string, boolean], isString),
    ).toEqualTypeOf<string | undefined>();
  });

  test("optional item", () => {
    expectTypeOf(find([] as [string?], isString)).toEqualTypeOf<
      string | undefined
    >();
  });

  test("rest item", () => {
    expectTypeOf(find([1] as [number, ...string[]], isString)).toEqualTypeOf<
      string | undefined
    >();
  });

  test("union of tuples", () => {
    expectTypeOf(find(["a"] as [string] | [number], isString)).toEqualTypeOf<
      string | undefined
    >();
  });

  test("optional item before a rest item", () => {
    expectTypeOf(find([] as [number?, ...string[]], isString)).toEqualTypeOf<
      string | undefined
    >();
  });

  test("suffix item", () => {
    expectTypeOf(
      find(["a"] as [...number[], number | string], isString),
    ).toEqualTypeOf<string | undefined>();
  });

  test("rest and suffix items", () => {
    expectTypeOf(
      find([true] as [...(number | string)[], boolean | string], isString),
    ).toEqualTypeOf<string | undefined>();
  });
});

describe("no match", () => {
  test("empty tuple", () => {
    expectTypeOf(find([] as [], isString)).toEqualTypeOf<undefined>();
  });

  test("tuple", () => {
    expectTypeOf(
      find([1, true] as [number, boolean], isString),
    ).toEqualTypeOf<undefined>();
  });

  test("optional item", () => {
    expectTypeOf(find([] as [number?], isString)).toEqualTypeOf<undefined>();
  });
});

describe("non-guard predicate", () => {
  test("array", () => {
    expectTypeOf(
      find([] as (number | string)[], constant($typed<boolean>())),
    ).toEqualTypeOf<number | string | undefined>();
  });

  test("tuple", () => {
    expectTypeOf(
      find([1, "a"] as [number, string], constant($typed<boolean>())),
    ).toEqualTypeOf<number | string | undefined>();
  });

  test("trivial acceptor on an array", () => {
    expectTypeOf(find([] as number[], constant(true))).toEqualTypeOf<
      number | undefined
    >();
  });

  test("trivial acceptor on a tuple", () => {
    expectTypeOf(
      find([1, "a"] as [number, string], constant(true)),
    ).toEqualTypeOf<number>();
  });

  test("trivial acceptor on a non-empty array", () => {
    expectTypeOf(
      find(["a"] as [string, ...number[]], constant(true)),
    ).toEqualTypeOf<string>();
  });

  test("trivial acceptor on a union of arrays", () => {
    expectTypeOf(find([] as [string] | number[], constant(true))).toEqualTypeOf<
      string | number | undefined
    >();
  });

  test("trivial rejector", () => {
    expectTypeOf(
      find([1, "a"] as [number, string], constant(false)),
    ).toEqualTypeOf<undefined>();
  });
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
    expectTypeOf(
      pipe([1, "a"] as [number, string], find(constant($typed<boolean>()))),
    ).toEqualTypeOf<number | string | undefined>();
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

  test("readonly tuple", () => {
    expectTypeOf(
      pipe([1, "a", true] as const, find(isString)),
    ).toEqualTypeOf<"a">();
  });

  test("guaranteed match", () => {
    expectTypeOf(
      pipe([1, "a", true] as [number, string, boolean], find(isString)),
    ).toEqualTypeOf<string>();
  });

  test("possible match", () => {
    expectTypeOf(
      pipe([1, true] as [number | string, boolean], find(isString)),
    ).toEqualTypeOf<string | undefined>();
  });

  test("no match", () => {
    expectTypeOf(
      pipe([1, true] as [number, boolean], find(isString)),
    ).toEqualTypeOf<undefined>();
  });

  test("trivial acceptor on a tuple", () => {
    expectTypeOf(
      pipe([1, "a"] as [number, string], find(constant(true))),
    ).toEqualTypeOf<number>();
  });

  test("trivial rejector", () => {
    expectTypeOf(
      pipe([1, "a"] as [number, string], find(constant(false))),
    ).toEqualTypeOf<undefined>();
  });

  test("guard incomparable to the item", () => {
    expectTypeOf(pipe([] as Cat[], find(isLegged))).toEqualTypeOf<
      (Cat & Legged) | undefined
    >();
  });

  test("object guard sharing no keys with the item", () => {
    expectTypeOf(pipe([] as Cat[], find(isNamed))).toEqualTypeOf<
      (Cat & Named) | undefined
    >();
  });

  test("predicate is typed correctly", () => {
    pipe(
      [] as (number | string)[],
      find((value, index, data) => {
        expectTypeOf(value).toEqualTypeOf<number | string>();
        expectTypeOf(index).toEqualTypeOf<number>();
        expectTypeOf(data).toEqualTypeOf<
          readonly [number | string, ...(number | string)[]]
        >();

        return true;
      }),
    );
  });
});

describe("data param", () => {
  test("lazily reconstructed in data-last", () => {
    pipe(
      [1, 2, 3] as const,
      find((_value, _index, data) => {
        expectTypeOf(data).toEqualTypeOf<readonly [1, 2?, 3?]>();

        return true;
      }),
    );
  });

  test("lazily reconstructed in data-last with a type predicate", () => {
    pipe(
      [1, 2, 3] as const,
      find((value, _index, data): value is 2 => {
        expectTypeOf(data).toEqualTypeOf<readonly [1, 2?, 3?]>();

        return value === 2;
      }),
    );
  });
});
