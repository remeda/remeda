import type { ArraySetRequired } from "./ArraySetRequired";
import type { IterableContainer } from "./IterableContainer";

declare function arraySetRequired<
  T extends IterableContainer,
  Min extends number,
>(data: T, min: Min): ArraySetRequired<T, Min>;

it("synchronizes the tuple readonly modifier", () => {
  expectTypeOf(arraySetRequired([] as Array<string>, 1)).toEqualTypeOf<
    [string, ...Array<string>]
  >();

  expectTypeOf(arraySetRequired([] as ReadonlyArray<string>, 1)).toEqualTypeOf<
    readonly [string, ...Array<string>]
  >();
});

describe("works with all array shapes", () => {
  test("empty array", () => {
    expectTypeOf(arraySetRequired([] as [], 0)).toEqualTypeOf<[]>();

    // Overflow
    expectTypeOf(arraySetRequired([] as [], 1)).toBeNever();
  });

  test("trivial tuples (only required elements)", () => {
    expectTypeOf(
      arraySetRequired(
        [1, "hello", true, new Date()] as [number, string, boolean, Date],
        0,
      ),
    ).toEqualTypeOf<[number, string, boolean, Date]>();

    expectTypeOf(
      arraySetRequired(
        [1, "hello", true, new Date()] as [number, string, boolean, Date],
        1,
      ),
    ).toEqualTypeOf<[number, string, boolean, Date]>();

    expectTypeOf(
      arraySetRequired(
        [1, "hello", true, new Date()] as [number, string, boolean, Date],
        2,
      ),
    ).toEqualTypeOf<[number, string, boolean, Date]>();

    expectTypeOf(
      arraySetRequired(
        [1, "hello", true, new Date()] as [number, string, boolean, Date],
        3,
      ),
    ).toEqualTypeOf<[number, string, boolean, Date]>();

    expectTypeOf(
      arraySetRequired(
        [1, "hello", true, new Date()] as [number, string, boolean, Date],
        4,
      ),
    ).toEqualTypeOf<[number, string, boolean, Date]>();

    // Overflow
    expectTypeOf(
      arraySetRequired(
        [1, "hello", true, new Date()] as [number, string, boolean, Date],
        5,
      ),
    ).toBeNever();
  });

  test("trivial arrays (only rest element)", () => {
    expectTypeOf(arraySetRequired([] as Array<string>, 0)).toEqualTypeOf<
      Array<string>
    >();

    expectTypeOf(arraySetRequired([] as Array<string>, 1)).toEqualTypeOf<
      [string, ...Array<string>]
    >();

    // No overflow
    expectTypeOf(arraySetRequired([] as Array<string>, 2)).toEqualTypeOf<
      [string, string, ...Array<string>]
    >();
  });

  test("optional elements only", () => {
    expectTypeOf(
      arraySetRequired([] as [number?, string?, boolean?, Date?], 0),
    ).toEqualTypeOf<[number?, string?, boolean?, Date?]>();

    expectTypeOf(
      arraySetRequired([] as [number?, string?, boolean?, Date?], 1),
    ).toEqualTypeOf<[number | undefined, string?, boolean?, Date?]>();

    expectTypeOf(
      arraySetRequired([] as [number?, string?, boolean?, Date?], 2),
    ).toEqualTypeOf<
      [number | undefined, string | undefined, boolean?, Date?]
    >();

    expectTypeOf(
      arraySetRequired([] as [number?, string?, boolean?, Date?], 3),
    ).toEqualTypeOf<
      [number | undefined, string | undefined, boolean | undefined, Date?]
    >();

    expectTypeOf(
      arraySetRequired([] as [number?, string?, boolean?, Date?], 4),
    ).toEqualTypeOf<
      [
        number | undefined,
        string | undefined,
        boolean | undefined,
        Date | undefined,
      ]
    >();

    // Overflow
    expectTypeOf(
      arraySetRequired([] as [number?, string?, boolean?, Date?], 5),
    ).toBeNever();
  });

  test("required and optional elements (no rest element)", () => {
    expectTypeOf(
      arraySetRequired([1, "hello"] as [number, string, boolean?, Date?], 0),
    ).toEqualTypeOf<[number, string, boolean?, Date?]>();

    expectTypeOf(
      arraySetRequired([1, "hello"] as [number, string, boolean?, Date?], 1),
    ).toEqualTypeOf<[number, string, boolean?, Date?]>();

    expectTypeOf(
      arraySetRequired([1, "hello"] as [number, string, boolean?, Date?], 2),
    ).toEqualTypeOf<[number, string, boolean?, Date?]>();

    expectTypeOf(
      arraySetRequired([1, "hello"] as [number, string, boolean?, Date?], 3),
    ).toEqualTypeOf<[number, string, boolean | undefined, Date?]>();

    expectTypeOf(
      arraySetRequired([1, "hello"] as [number, string, boolean?, Date?], 4),
    ).toEqualTypeOf<[number, string, boolean | undefined, Date | undefined]>();

    // Overflow
    expectTypeOf(
      arraySetRequired([1, "hello"] as [number, string, boolean?, Date?], 5),
    ).toBeNever();
  });

  test("required and rest element (non-empty array)", () => {
    expectTypeOf(
      arraySetRequired(
        [1, "hello", true] as [number, string, boolean, ...Array<Date>],
        0,
      ),
    ).toEqualTypeOf<[number, string, boolean, ...Array<Date>]>();

    expectTypeOf(
      arraySetRequired(
        [1, "hello", true] as [number, string, boolean, ...Array<Date>],
        1,
      ),
    ).toEqualTypeOf<[number, string, boolean, ...Array<Date>]>();

    expectTypeOf(
      arraySetRequired(
        [1, "hello", true] as [number, string, boolean, ...Array<Date>],
        2,
      ),
    ).toEqualTypeOf<[number, string, boolean, ...Array<Date>]>();

    expectTypeOf(
      arraySetRequired(
        [1, "hello", true] as [number, string, boolean, ...Array<Date>],
        3,
      ),
    ).toEqualTypeOf<[number, string, boolean, ...Array<Date>]>();

    expectTypeOf(
      arraySetRequired(
        [1, "hello", true] as [number, string, boolean, ...Array<Date>],
        4,
      ),
    ).toEqualTypeOf<[number, string, boolean, Date, ...Array<Date>]>();

    // No overflow
    expectTypeOf(
      arraySetRequired(
        [1, "hello", true] as [number, string, boolean, ...Array<Date>],
        5,
      ),
    ).toEqualTypeOf<[number, string, boolean, Date, Date, ...Array<Date>]>();
  });

  test("optional prefix and rest element", () => {
    expectTypeOf(
      arraySetRequired([] as [number?, string?, boolean?, ...Array<Date>], 0),
    ).toEqualTypeOf<[number?, string?, boolean?, ...Array<Date>]>();

    expectTypeOf(
      arraySetRequired([] as [number?, string?, boolean?, ...Array<Date>], 1),
    ).toEqualTypeOf<[number | undefined, string?, boolean?, ...Array<Date>]>();

    expectTypeOf(
      arraySetRequired([] as [number?, string?, boolean?, ...Array<Date>], 2),
    ).toEqualTypeOf<
      [number | undefined, string | undefined, boolean?, ...Array<Date>]
    >();

    expectTypeOf(
      arraySetRequired([] as [number?, string?, boolean?, ...Array<Date>], 3),
    ).toEqualTypeOf<
      [
        number | undefined,
        string | undefined,
        boolean | undefined,
        ...Array<Date>,
      ]
    >();

    expectTypeOf(
      arraySetRequired([] as [number?, string?, boolean?, ...Array<Date>], 4),
    ).toEqualTypeOf<
      [
        number | undefined,
        string | undefined,
        boolean | undefined,
        Date,
        ...Array<Date>,
      ]
    >();

    // No overflow
    expectTypeOf(
      arraySetRequired([] as [number?, string?, boolean?, ...Array<Date>], 5),
    ).toEqualTypeOf<
      [
        number | undefined,
        string | undefined,
        boolean | undefined,
        Date,
        Date,
        ...Array<Date>,
      ]
    >();
  });

  test("rest element and suffix (non-empty array)", () => {
    expectTypeOf(
      arraySetRequired(
        ["hello", true, new Date()] as [
          ...Array<number>,
          string,
          boolean,
          Date,
        ],
        0,
      ),
    ).toEqualTypeOf<[...Array<number>, string, boolean, Date]>();

    expectTypeOf(
      arraySetRequired(
        ["hello", true, new Date()] as [
          ...Array<number>,
          string,
          boolean,
          Date,
        ],
        1,
      ),
    ).toEqualTypeOf<[...Array<number>, string, boolean, Date]>();

    expectTypeOf(
      arraySetRequired(
        ["hello", true, new Date()] as [
          ...Array<number>,
          string,
          boolean,
          Date,
        ],
        2,
      ),
    ).toEqualTypeOf<[...Array<number>, string, boolean, Date]>();

    expectTypeOf(
      arraySetRequired(
        ["hello", true, new Date()] as [
          ...Array<number>,
          string,
          boolean,
          Date,
        ],
        3,
      ),
    ).toEqualTypeOf<[...Array<number>, string, boolean, Date]>();

    expectTypeOf(
      arraySetRequired(
        ["hello", true, new Date()] as [
          ...Array<number>,
          string,
          boolean,
          Date,
        ],
        4,
      ),
    ).toEqualTypeOf<[number, ...Array<number>, string, boolean, Date]>();

    // No overflow
    expectTypeOf(
      arraySetRequired(
        ["hello", true, new Date()] as [
          ...Array<number>,
          string,
          boolean,
          Date,
        ],
        5,
      ),
    ).toEqualTypeOf<
      [number, number, ...Array<number>, string, boolean, Date]
    >();
  });

  test("array with prefix and suffix (non-empty array)", () => {
    expectTypeOf(
      arraySetRequired(
        [1, "hello", new Date()] as [number, string, ...Array<boolean>, Date],
        0,
      ),
    ).toEqualTypeOf<[number, string, ...Array<boolean>, Date]>();

    expectTypeOf(
      arraySetRequired(
        [1, "hello", new Date()] as [number, string, ...Array<boolean>, Date],
        1,
      ),
    ).toEqualTypeOf<[number, string, ...Array<boolean>, Date]>();

    expectTypeOf(
      arraySetRequired(
        [1, "hello", new Date()] as [number, string, ...Array<boolean>, Date],
        2,
      ),
    ).toEqualTypeOf<[number, string, ...Array<boolean>, Date]>();

    expectTypeOf(
      arraySetRequired(
        [1, "hello", new Date()] as [number, string, ...Array<boolean>, Date],
        3,
      ),
    ).toEqualTypeOf<[number, string, ...Array<boolean>, Date]>();

    expectTypeOf(
      arraySetRequired(
        [1, "hello", new Date()] as [number, string, ...Array<boolean>, Date],
        4,
      ),
    ).toEqualTypeOf<[number, string, boolean, ...Array<boolean>, Date]>();

    // No overflow
    expectTypeOf(
      arraySetRequired(
        [1, "hello", new Date()] as [number, string, ...Array<boolean>, Date],
        5,
      ),
    ).toEqualTypeOf<
      [number, string, boolean, boolean, ...Array<boolean>, Date]
    >();
  });

  test("prefix array (no suffix)", () => {
    expectTypeOf(
      arraySetRequired(
        [1, "hello"] as [number, string, boolean?, ...Array<Date>],
        0,
      ),
    ).toEqualTypeOf<[number, string, boolean?, ...Array<Date>]>();

    expectTypeOf(
      arraySetRequired(
        [1, "hello"] as [number, string, boolean?, ...Array<Date>],
        1,
      ),
    ).toEqualTypeOf<[number, string, boolean?, ...Array<Date>]>();

    expectTypeOf(
      arraySetRequired(
        [1, "hello"] as [number, string, boolean?, ...Array<Date>],
        2,
      ),
    ).toEqualTypeOf<[number, string, boolean?, ...Array<Date>]>();

    expectTypeOf(
      arraySetRequired(
        [1, "hello"] as [number, string, boolean?, ...Array<Date>],
        3,
      ),
    ).toEqualTypeOf<[number, string, boolean | undefined, ...Array<Date>]>();

    expectTypeOf(
      arraySetRequired(
        [1, "hello"] as [number, string, boolean?, ...Array<Date>],
        4,
      ),
    ).toEqualTypeOf<
      [number, string, boolean | undefined, Date, ...Array<Date>]
    >();

    // No overflow
    expectTypeOf(
      arraySetRequired(
        [1, "hello"] as [number, string, boolean?, ...Array<Date>],
        5,
      ),
    ).toEqualTypeOf<
      [number, string, boolean | undefined, Date, Date, ...Array<Date>]
    >();
  });
});

test("errs on non-literal param", () => {
  expectTypeOf(
    arraySetRequired([] as Array<string>, 123 as number),
  ).toBeNever();
});

describe("union types", () => {
  test("unions of literal minimums takes the minimum amongst them", () => {
    expectTypeOf(
      arraySetRequired(
        [1, true] as [number, ...Array<string>, boolean],
        3 as 3 | 20,
      ),
    ).toEqualTypeOf<[number, string, ...Array<string>, boolean]>();
  });

  test("unions of item types (simple arrays)", () => {
    expectTypeOf(
      arraySetRequired([] as Array<string | number>, 1),
    ).toEqualTypeOf<[string | number, ...Array<string | number>]>();
  });

  test("unions of array types (simple arrays)", () => {
    expectTypeOf(
      arraySetRequired([] as Array<string> | Array<number>, 1),
    ).toEqualTypeOf<[string, ...Array<string>] | [number, ...Array<number>]>();
  });

  test("union of non-empty array types", () => {
    expectTypeOf(
      arraySetRequired(
        [1, "hello"] as [number, ...Array<string>] | [...Array<boolean>, Date],
        2,
      ),
    ).toEqualTypeOf<
      [number, string, ...Array<string>] | [boolean, ...Array<boolean>, Date]
    >();
  });
});
