import { describe, expectTypeOf, test } from "vitest";
import { hasAtLeast } from "./hasAtLeast";

describe("dataFirst", () => {
  test("narrows on empty checks", () => {
    const array = [] as Array<number>;
    if (hasAtLeast(array, 0)) {
      expectTypeOf(array).toEqualTypeOf<Array<number>>();
    }
  });

  test("narrows on non-empty checks", () => {
    const array = [] as Array<number>;
    if (hasAtLeast(array, 1)) {
      expectTypeOf(array).toEqualTypeOf<[number, ...Array<number>]>();
    }
  });

  test("narrows on large numbers", () => {
    const array = [] as Array<number>;
    if (hasAtLeast(array, 10)) {
      expectTypeOf(array).toEqualTypeOf<
        [
          number,
          number,
          number,
          number,
          number,
          number,
          number,
          number,
          number,
          number,
          ...Array<number>,
        ]
      >();
    }
  });
});

describe("dataLast", () => {
  test("narrows on empty checks", () => {
    const array = [] as Array<number>;
    if (hasAtLeast(0)(array)) {
      expectTypeOf(array).toEqualTypeOf<Array<number>>();
    }
  });

  test("narrows on non-empty checks", () => {
    const array = [] as Array<number>;
    if (hasAtLeast(1)(array)) {
      expectTypeOf(array).toEqualTypeOf<[number, ...Array<number>]>();
    }
  });

  test("narrows on large numbers", () => {
    const array = [] as Array<number>;
    if (hasAtLeast(10)(array)) {
      expectTypeOf(array).toEqualTypeOf<
        [
          number,
          number,
          number,
          number,
          number,
          number,
          number,
          number,
          number,
          number,
          ...Array<number>,
        ]
      >();
    }
  });

  test("creates narrowing utility functions", () => {
    const hasADozen = hasAtLeast(12);
    const numbersArray = [] as Array<number>;
    if (hasADozen(numbersArray)) {
      expectTypeOf(numbersArray).toEqualTypeOf<
        [
          number,
          number,
          number,
          number,
          number,
          number,
          number,
          number,
          number,
          number,
          number,
          number,
          ...Array<number>,
        ]
      >();
    }

    const stringsArray = [] as Array<string>;
    if (hasADozen(stringsArray)) {
      expectTypeOf(stringsArray).toEqualTypeOf<
        [
          string,
          string,
          string,
          string,
          string,
          string,
          string,
          string,
          string,
          string,
          string,
          string,
          ...Array<string>,
        ]
      >();
    }
  });
});

test("fails on N > array length", () => {
  const array = ["hello", "world"] as const;
  if (hasAtLeast(array, 3)) {
    expectTypeOf(array).toBeNever();
  }
});

test("works with interesting tuples", () => {
  const array = ["hello", "world", true, 456, 123, "cat"] as [
    "hello",
    string,
    boolean,
    number,
    123,
    ...Array<"cat" | "dog">,
  ];
  if (hasAtLeast(array, 8)) {
    expectTypeOf(array).toEqualTypeOf<
      [
        "hello",
        string,
        boolean,
        number,
        123,
        "cat" | "dog",
        "cat" | "dog",
        "cat" | "dog",
        ...Array<"cat" | "dog">,
      ]
    >();
  }
});

test("maintains readonly-ness", () => {
  const array = [] as ReadonlyArray<string>;
  if (hasAtLeast(array, 3)) {
    expectTypeOf(array).toEqualTypeOf<
      readonly [string, string, string, ...Array<string>]
    >();
  }
});

test("only narrows on literal numbers", () => {
  const array = [] as Array<number>;
  if (hasAtLeast(array, 3 as number)) {
    expectTypeOf(array).toEqualTypeOf<Array<number>>();
  } else {
    expectTypeOf(array).toEqualTypeOf<Array<number>>();
  }
});

test("can narrow on a literal union", () => {
  const array = [] as Array<number>;
  if (hasAtLeast(array, 3 as 3 | 4)) {
    // The narrowing would result in taking the minimum
    expectTypeOf(array).toEqualTypeOf<
      [number, number, number, ...Array<number>]
    >();
  } else {
    expectTypeOf(array).toEqualTypeOf<Array<number>>();
  }
});
