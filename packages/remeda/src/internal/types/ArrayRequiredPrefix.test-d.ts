import { describe, expectTypeOf, test } from "vitest";
import type { ArrayRequiredPrefix } from "./ArrayRequiredPrefix";
import type { IterableContainer } from "./IterableContainer";

declare function arrayRequiredPrefix<
  T extends IterableContainer,
  Min extends number,
>(data: T, min: Min): ArrayRequiredPrefix<T, Min>;

test("synchronizes the tuple readonly modifier", () => {
  expectTypeOf(arrayRequiredPrefix([] as string[], 1)).toEqualTypeOf<
    [string, ...string[]]
  >();

  expectTypeOf(arrayRequiredPrefix([] as readonly string[], 1)).toEqualTypeOf<
    readonly [string, ...string[]]
  >();
});

describe("works with all array shapes", () => {
  test("empty tuple", () => {
    expectTypeOf(arrayRequiredPrefix([] as [], 0)).toEqualTypeOf<[]>();

    // Overflow
    expectTypeOf(arrayRequiredPrefix([] as [], 1)).toBeNever();
  });

  test("fixed tuples", () => {
    expectTypeOf(
      arrayRequiredPrefix(
        [1, "hello", true, new Date()] as [number, string, boolean, Date],
        0,
      ),
    ).toEqualTypeOf<[number, string, boolean, Date]>();

    expectTypeOf(
      arrayRequiredPrefix(
        [1, "hello", true, new Date()] as [number, string, boolean, Date],
        1,
      ),
    ).toEqualTypeOf<[number, string, boolean, Date]>();

    expectTypeOf(
      arrayRequiredPrefix(
        [1, "hello", true, new Date()] as [number, string, boolean, Date],
        2,
      ),
    ).toEqualTypeOf<[number, string, boolean, Date]>();

    expectTypeOf(
      arrayRequiredPrefix(
        [1, "hello", true, new Date()] as [number, string, boolean, Date],
        3,
      ),
    ).toEqualTypeOf<[number, string, boolean, Date]>();

    expectTypeOf(
      arrayRequiredPrefix(
        [1, "hello", true, new Date()] as [number, string, boolean, Date],
        4,
      ),
    ).toEqualTypeOf<[number, string, boolean, Date]>();

    // Overflow
    expectTypeOf(
      arrayRequiredPrefix(
        [1, "hello", true, new Date()] as [number, string, boolean, Date],
        5,
      ),
    ).toBeNever();
  });

  test("arrays", () => {
    expectTypeOf(arrayRequiredPrefix([] as string[], 0)).toEqualTypeOf<
      string[]
    >();

    expectTypeOf(arrayRequiredPrefix([] as string[], 1)).toEqualTypeOf<
      [string, ...string[]]
    >();

    // No overflow
    expectTypeOf(arrayRequiredPrefix([] as string[], 2)).toEqualTypeOf<
      [string, string, ...string[]]
    >();
  });

  test("optional tuples", () => {
    expectTypeOf(
      arrayRequiredPrefix([] as [number?, string?, boolean?, Date?], 0),
    ).toEqualTypeOf<[number?, string?, boolean?, Date?]>();

    expectTypeOf(
      arrayRequiredPrefix([] as [number?, string?, boolean?, Date?], 1),
    ).toEqualTypeOf<[number, string?, boolean?, Date?]>();

    expectTypeOf(
      arrayRequiredPrefix([] as [number?, string?, boolean?, Date?], 2),
    ).toEqualTypeOf<[number, string, boolean?, Date?]>();

    expectTypeOf(
      arrayRequiredPrefix([] as [number?, string?, boolean?, Date?], 3),
    ).toEqualTypeOf<[number, string, boolean, Date?]>();

    expectTypeOf(
      arrayRequiredPrefix([] as [number?, string?, boolean?, Date?], 4),
    ).toEqualTypeOf<[number, string, boolean, Date]>();

    // Overflow
    expectTypeOf(
      arrayRequiredPrefix([] as [number?, string?, boolean?, Date?], 5),
    ).toBeNever();
  });

  test("mixed tuples", () => {
    expectTypeOf(
      arrayRequiredPrefix([1, "hello"] as [number, string, boolean?, Date?], 0),
    ).toEqualTypeOf<[number, string, boolean?, Date?]>();

    expectTypeOf(
      arrayRequiredPrefix([1, "hello"] as [number, string, boolean?, Date?], 1),
    ).toEqualTypeOf<[number, string, boolean?, Date?]>();

    expectTypeOf(
      arrayRequiredPrefix([1, "hello"] as [number, string, boolean?, Date?], 2),
    ).toEqualTypeOf<[number, string, boolean?, Date?]>();

    expectTypeOf(
      arrayRequiredPrefix([1, "hello"] as [number, string, boolean?, Date?], 3),
    ).toEqualTypeOf<[number, string, boolean, Date?]>();

    expectTypeOf(
      arrayRequiredPrefix([1, "hello"] as [number, string, boolean?, Date?], 4),
    ).toEqualTypeOf<[number, string, boolean, Date]>();

    // Overflow
    expectTypeOf(
      arrayRequiredPrefix([1, "hello"] as [number, string, boolean?, Date?], 5),
    ).toBeNever();
  });

  test("fixed-prefix arrays", () => {
    expectTypeOf(
      arrayRequiredPrefix(
        [1, "hello", true] as [number, string, boolean, ...Date[]],
        0,
      ),
    ).toEqualTypeOf<[number, string, boolean, ...Date[]]>();

    expectTypeOf(
      arrayRequiredPrefix(
        [1, "hello", true] as [number, string, boolean, ...Date[]],
        1,
      ),
    ).toEqualTypeOf<[number, string, boolean, ...Date[]]>();

    expectTypeOf(
      arrayRequiredPrefix(
        [1, "hello", true] as [number, string, boolean, ...Date[]],
        2,
      ),
    ).toEqualTypeOf<[number, string, boolean, ...Date[]]>();

    expectTypeOf(
      arrayRequiredPrefix(
        [1, "hello", true] as [number, string, boolean, ...Date[]],
        3,
      ),
    ).toEqualTypeOf<[number, string, boolean, ...Date[]]>();

    expectTypeOf(
      arrayRequiredPrefix(
        [1, "hello", true] as [number, string, boolean, ...Date[]],
        4,
      ),
    ).toEqualTypeOf<[number, string, boolean, Date, ...Date[]]>();

    // No overflow
    expectTypeOf(
      arrayRequiredPrefix(
        [1, "hello", true] as [number, string, boolean, ...Date[]],
        5,
      ),
    ).toEqualTypeOf<[number, string, boolean, Date, Date, ...Date[]]>();
  });

  test("optional-prefix arrays", () => {
    expectTypeOf(
      arrayRequiredPrefix([] as [number?, string?, boolean?, ...Date[]], 0),
    ).toEqualTypeOf<[number?, string?, boolean?, ...Date[]]>();

    expectTypeOf(
      arrayRequiredPrefix([] as [number?, string?, boolean?, ...Date[]], 1),
    ).toEqualTypeOf<[number, string?, boolean?, ...Date[]]>();

    expectTypeOf(
      arrayRequiredPrefix([] as [number?, string?, boolean?, ...Date[]], 2),
    ).toEqualTypeOf<[number, string, boolean?, ...Date[]]>();

    expectTypeOf(
      arrayRequiredPrefix([] as [number?, string?, boolean?, ...Date[]], 3),
    ).toEqualTypeOf<[number, string, boolean, ...Date[]]>();

    expectTypeOf(
      arrayRequiredPrefix([] as [number?, string?, boolean?, ...Date[]], 4),
    ).toEqualTypeOf<[number, string, boolean, Date, ...Date[]]>();

    // No overflow
    expectTypeOf(
      arrayRequiredPrefix([] as [number?, string?, boolean?, ...Date[]], 5),
    ).toEqualTypeOf<[number, string, boolean, Date, Date, ...Date[]]>();
  });

  test("fixed-suffix arrays", () => {
    expectTypeOf(
      arrayRequiredPrefix(
        ["hello", true, new Date()] as [...number[], string, boolean, Date],
        0,
      ),
    ).toEqualTypeOf<[...number[], string, boolean, Date]>();

    expectTypeOf(
      arrayRequiredPrefix(
        ["hello", true, new Date()] as [...number[], string, boolean, Date],
        1,
      ),
    ).toEqualTypeOf<[...number[], string, boolean, Date]>();

    expectTypeOf(
      arrayRequiredPrefix(
        ["hello", true, new Date()] as [...number[], string, boolean, Date],
        2,
      ),
    ).toEqualTypeOf<[...number[], string, boolean, Date]>();

    expectTypeOf(
      arrayRequiredPrefix(
        ["hello", true, new Date()] as [...number[], string, boolean, Date],
        3,
      ),
    ).toEqualTypeOf<[...number[], string, boolean, Date]>();

    expectTypeOf(
      arrayRequiredPrefix(
        ["hello", true, new Date()] as [...number[], string, boolean, Date],
        4,
      ),
    ).toEqualTypeOf<[number, ...number[], string, boolean, Date]>();

    // No overflow
    expectTypeOf(
      arrayRequiredPrefix(
        ["hello", true, new Date()] as [...number[], string, boolean, Date],
        5,
      ),
    ).toEqualTypeOf<[number, number, ...number[], string, boolean, Date]>();
  });

  test("fixed-elements array", () => {
    expectTypeOf(
      arrayRequiredPrefix(
        [1, "hello", new Date()] as [number, string, ...boolean[], Date],
        0,
      ),
    ).toEqualTypeOf<[number, string, ...boolean[], Date]>();

    expectTypeOf(
      arrayRequiredPrefix(
        [1, "hello", new Date()] as [number, string, ...boolean[], Date],
        1,
      ),
    ).toEqualTypeOf<[number, string, ...boolean[], Date]>();

    expectTypeOf(
      arrayRequiredPrefix(
        [1, "hello", new Date()] as [number, string, ...boolean[], Date],
        2,
      ),
    ).toEqualTypeOf<[number, string, ...boolean[], Date]>();

    expectTypeOf(
      arrayRequiredPrefix(
        [1, "hello", new Date()] as [number, string, ...boolean[], Date],
        3,
      ),
    ).toEqualTypeOf<[number, string, ...boolean[], Date]>();

    expectTypeOf(
      arrayRequiredPrefix(
        [1, "hello", new Date()] as [number, string, ...boolean[], Date],
        4,
      ),
    ).toEqualTypeOf<[number, string, boolean, ...boolean[], Date]>();

    // No overflow
    expectTypeOf(
      arrayRequiredPrefix(
        [1, "hello", new Date()] as [number, string, ...boolean[], Date],
        5,
      ),
    ).toEqualTypeOf<[number, string, boolean, boolean, ...boolean[], Date]>();
  });

  test("mixed-prefix array", () => {
    expectTypeOf(
      arrayRequiredPrefix(
        [1, "hello"] as [number, string, boolean?, ...Date[]],
        0,
      ),
    ).toEqualTypeOf<[number, string, boolean?, ...Date[]]>();

    expectTypeOf(
      arrayRequiredPrefix(
        [1, "hello"] as [number, string, boolean?, ...Date[]],
        1,
      ),
    ).toEqualTypeOf<[number, string, boolean?, ...Date[]]>();

    expectTypeOf(
      arrayRequiredPrefix(
        [1, "hello"] as [number, string, boolean?, ...Date[]],
        2,
      ),
    ).toEqualTypeOf<[number, string, boolean?, ...Date[]]>();

    expectTypeOf(
      arrayRequiredPrefix(
        [1, "hello"] as [number, string, boolean?, ...Date[]],
        3,
      ),
    ).toEqualTypeOf<[number, string, boolean, ...Date[]]>();

    expectTypeOf(
      arrayRequiredPrefix(
        [1, "hello"] as [number, string, boolean?, ...Date[]],
        4,
      ),
    ).toEqualTypeOf<[number, string, boolean, Date, ...Date[]]>();

    // No overflow
    expectTypeOf(
      arrayRequiredPrefix(
        [1, "hello"] as [number, string, boolean?, ...Date[]],
        5,
      ),
    ).toEqualTypeOf<[number, string, boolean, Date, Date, ...Date[]]>();
  });
});

test("errs on non-literal param", () => {
  expectTypeOf(arrayRequiredPrefix([] as string[], 123 as number)).toBeNever();
});

describe("union types", () => {
  test("unions of literal minimums takes the minimum amongst them", () => {
    expectTypeOf(
      arrayRequiredPrefix(
        [1, true] as [number, ...string[], boolean],
        3 as 3 | 20,
      ),
    ).toEqualTypeOf<[number, string, ...string[], boolean]>();
  });

  test("unions of item types (simple arrays)", () => {
    expectTypeOf(
      arrayRequiredPrefix([] as (string | number)[], 1),
    ).toEqualTypeOf<[string | number, ...(string | number)[]]>();
  });

  test("unions of array types (simple arrays)", () => {
    expectTypeOf(
      arrayRequiredPrefix([] as string[] | number[], 1),
    ).toEqualTypeOf<[string, ...string[]] | [number, ...number[]]>();
  });

  test("union of non-empty array types", () => {
    expectTypeOf(
      arrayRequiredPrefix(
        [1, "hello"] as [number, ...string[]] | [...boolean[], Date],
        2,
      ),
    ).toEqualTypeOf<
      [number, string, ...string[]] | [boolean, ...boolean[], Date]
    >();
  });
});
