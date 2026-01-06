import { describe, expectTypeOf, test } from "vitest";
import { constant } from "./constant";
import { filter } from "./filter";
import { isDefined } from "./isDefined";
import { isNonNull } from "./isNonNull";
import { isNonNullish } from "./isNonNullish";
import { isStrictEqual } from "./isStrictEqual";
import { pipe } from "./pipe";

// TODO [>2]: Our type-narrowing utilities aren't narrowing our types correctly in these tests due to them inferring the types "too soon" (because they are invoked "headless"ly). This is also a problem with TypeScript before version 5.5 because we can't use a simple arrow function too without being explicit about it's return type, which makes the whole code messy. In Remeda v3 we plan to bump the minimum TypeScript version so this wouldn't be an issue any way, but we also plan to deprecate headless type predicates.
declare function isNumber<T>(x: T): x is Extract<T, number>;
declare function isString<T>(x: T): x is Extract<T, string>;

describe("primitives arrays", () => {
  test("predicate", () => {
    expectTypeOf(filter([] as string[], constant(true))).toEqualTypeOf<
      string[]
    >();
  });

  test("trivial acceptor", () => {
    expectTypeOf(filter([] as string[], constant(true))).toEqualTypeOf<
      string[]
    >();
  });

  test("trivial rejector", () => {
    expectTypeOf(filter([] as string[], constant(false))).toEqualTypeOf<[]>();
  });

  test("type predicate", () => {
    expectTypeOf(
      filter([] as string[], isStrictEqual("hello" as const)),
    ).toEqualTypeOf<"hello"[]>();
  });

  test("type predicate of the same type as the array", () => {
    expectTypeOf(filter([] as string[], isString)).toEqualTypeOf<string[]>();
  });
});

describe("arrays with literal unions", () => {
  test("predicate", () => {
    expectTypeOf(
      filter([] as ("cat" | "dog")[], constant(true as boolean)),
    ).toEqualTypeOf<("cat" | "dog")[]>();
  });

  test("trivial acceptor", () => {
    expectTypeOf(filter([] as ("cat" | "dog")[], constant(true))).toEqualTypeOf<
      ("cat" | "dog")[]
    >();
  });

  test("trivial rejector", () => {
    expectTypeOf(
      filter([] as ("cat" | "dog")[], constant(false)),
    ).toEqualTypeOf<[]>();
  });

  test("type predicate", () => {
    expectTypeOf(
      filter([] as ("cat" | "dog")[], isStrictEqual("cat" as const)),
    ).toEqualTypeOf<"cat"[]>();
  });
});

describe("fixed tuple", () => {
  test("predicate", () => {
    expectTypeOf(
      filter(
        ["hello", "world", 1, 2, 3, true, "world", 3, "hello"] as const,
        constant(true as boolean),
      ),
    ).toEqualTypeOf<(true | 1 | 2 | 3 | "hello" | "world")[]>();
  });

  test("trivial acceptor", () => {
    expectTypeOf(
      filter(
        ["hello", "world", 1, 2, 3, true, "world", 3, "hello"] as const,
        constant(true),
      ),
    ).toEqualTypeOf<["hello", "world", 1, 2, 3, true, "world", 3, "hello"]>();
  });

  test("trivial rejector", () => {
    expectTypeOf(
      filter(
        ["hello", "world", 1, 2, 3, true, "world", 3, "hello"] as const,
        constant(false),
      ),
    ).toEqualTypeOf<[]>();
  });

  test("type predicate", () => {
    expectTypeOf(
      filter(
        ["hello", "world", 1, 2, 3, true, "world", 3, "hello"] as const,
        isString,
      ),
    ).toEqualTypeOf<["hello", "world", "world", "hello"]>();
  });

  test("type predicate with union type", () => {
    const result = filter(
      ["hello", "world", 1, 2, 3, true, "world", 3, "hello"] as const,
      // TODO [>2]: We don't need the return type here once the minimum TypeScript version is 5.5 or higher.
      ($): $ is 1 | "world" => $ === 1 || $ === "world",
    );

    expectTypeOf(result).toEqualTypeOf<["world", 1, "world"]>();
  });
});

describe("special tuple shapes", () => {
  test("optional elements", () => {
    const data = ["hello"] as [string, number?];

    expectTypeOf(filter(data, isStrictEqual("world" as const))).toEqualTypeOf<
      [] | ["world"]
    >();
    expectTypeOf(filter(data, isStrictEqual(123 as const))).toEqualTypeOf<
      [] | [123?]
    >();
  });

  test("non-empty array", () => {
    const data = ["hello"] as [string, ...string[]];

    expectTypeOf(filter(data, isStrictEqual("world" as const))).toEqualTypeOf<
      "world"[] | ["world", ..."world"[]]
    >();
    expectTypeOf(filter(data, isString)).toEqualTypeOf<[string, ...string[]]>();
    expectTypeOf(filter(data, constant(true as boolean))).toEqualTypeOf<
      string[]
    >();
  });

  test("rest element is filtered out", () => {
    const data = ["hello", "world"] as [string, ...number[], string];

    expectTypeOf(filter(data, isString)).toEqualTypeOf<[string, string]>();
  });

  test("rest element is kept", () => {
    const data = ["hello", "world"] as [string, ...number[], string];

    expectTypeOf(filter(data, isNumber)).toEqualTypeOf<number[]>();
  });

  test("non-empty array filtered with regular predicate", () => {
    const data = ["hello", "world"] as [string, ...number[], string];

    expectTypeOf(filter(data, constant(true as boolean))).toEqualTypeOf<
      (string | number)[]
    >();
  });

  test("non-empty array with union of types and type-predicate on those types", () => {
    expectTypeOf(
      filter(
        ["hello", true] as [string, ...number[], boolean],
        isStrictEqual("hello" as "hello" | 123 | true),
      ),
    ).toEqualTypeOf<
      123[] | [...123[], true] | ["hello", ...123[]] | ["hello", ...123[], true]
    >();
  });
});

test("discriminated union filtering", () => {
  const data = [] as (
    | { type: "cat"; hates: string }
    | { type: "dog"; numFriends: number }
  )[];

  expectTypeOf(
    filter(
      data,
      // TODO [>2]: We don't need the return type here once the minimum TypeScript version is 5.5 or higher.
      ($): $ is { type: "cat" } & (typeof data)[number] => $.type === "cat",
    ),
  ).toEqualTypeOf<{ type: "cat"; hates: string }[]>();
  expectTypeOf(
    filter(
      data,
      // TODO [>2]: We don't need the return type here once the minimum TypeScript version is 5.5 or higher.
      ($): $ is { type: "dog" } & (typeof data)[number] => $.type === "dog",
    ),
  ).toEqualTypeOf<{ type: "dog"; numFriends: number }[]>();
});

describe("accepts readonly arrays, returns mutable ones", () => {
  // We trust FilteredArray to return a mutable array, but we need to make sure
  // that we also remove any readonly modifiers when handling trivial predicates
  // too

  test("predicate", () => {
    expectTypeOf(filter([] as readonly string[], constant(true))).toEqualTypeOf<
      string[]
    >();
  });

  test("trivial acceptor", () => {
    expectTypeOf(filter([] as readonly string[], constant(true))).toEqualTypeOf<
      string[]
    >();
  });

  test("trivial rejector", () => {
    expectTypeOf(
      filter([] as readonly string[], constant(false)),
    ).toEqualTypeOf<[]>();
  });

  test("type predicate", () => {
    expectTypeOf(
      filter([] as readonly string[], isStrictEqual("hello" as const)),
    ).toEqualTypeOf<"hello"[]>();
  });
});

test("null filtering", () => {
  expectTypeOf(
    filter([] as (string | undefined)[], isNonNullish),
  ).toEqualTypeOf<string[]>();

  expectTypeOf(filter([] as (string | null)[], isNonNullish)).toEqualTypeOf<
    string[]
  >();

  expectTypeOf(
    filter([] as (string | null | undefined)[], isDefined),
  ).toEqualTypeOf<(string | null)[]>();

  expectTypeOf(
    filter([] as (string | null | undefined)[], isNonNull),
  ).toEqualTypeOf<(string | undefined)[]>();

  expectTypeOf(
    filter([] as (string | null | undefined)[], isNonNullish),
  ).toEqualTypeOf<string[]>();
});

describe("data last", () => {
  test("regular predicate", () => {
    const result = pipe(
      [1, 2, 3] as const,
      filter((x) => x % 2 === 1),
    );

    expectTypeOf(result).toEqualTypeOf<(1 | 2 | 3)[]>();
  });

  test("type-guard", () => {
    const result = pipe([1, 2, 3, false, "text"] as const, filter(isNumber));

    expectTypeOf(result).toEqualTypeOf<[1, 2, 3]>();
  });
});

describe("union of array types", () => {
  test("arrays", () => {
    expectTypeOf(
      filter([] as (string | undefined)[] | (number | undefined)[], isDefined),
    ).toEqualTypeOf<string[] | number[]>();
  });

  test("disjoint conditions", () => {
    expectTypeOf(filter([] as string[] | number[], isString)).toEqualTypeOf<
      [] | string[]
    >();
  });

  test("fixed tuples", () => {
    expectTypeOf(
      filter(
        ["hello", 0] as ["hello", 0] | [1, 2, "world", true, 3, "hello", 4],
        isNumber,
      ),
    ).toEqualTypeOf<[0] | [1, 2, 3, 4]>();
  });
});
