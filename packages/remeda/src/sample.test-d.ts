import { describe, expectTypeOf, test } from "vitest";
import { sample } from "./sample";

describe("sampleSize 0", () => {
  test("on arrays", () => {
    const array: Array<number> = [1, 2, 3, 4, 5];
    const result = sample(array, 0);

    expectTypeOf(result).toEqualTypeOf<[]>();
  });

  test("on readonly arrays", () => {
    const array: ReadonlyArray<number> = [1, 2, 3, 4, 5];
    const result = sample(array, 0);

    expectTypeOf(result).toEqualTypeOf<[]>();
  });

  test("on tuples", () => {
    const array: [number, number, number, number, number] = [1, 2, 3, 4, 5];
    const result = sample(array, 0);

    expectTypeOf(result).toEqualTypeOf<[]>();
  });

  test("on readonly tuples", () => {
    const array = [1, 2, 3, 4, 5] as const;
    const result = sample(array, 0);

    expectTypeOf(result).toEqualTypeOf<[]>();
  });

  test("on tuples with rest tail", () => {
    const array: [number, ...Array<number>] = [1, 2, 3, 4, 5];
    const result = sample(array, 0);

    expectTypeOf(result).toEqualTypeOf<[]>();
  });

  test("on tuples with rest head", () => {
    const array: [...Array<number>, number] = [1, 2, 3, 4, 5];
    const result = sample(array, 0);

    expectTypeOf(result).toEqualTypeOf<[]>();
  });

  test("on readonly tuples with rest tail", () => {
    const array: readonly [number, ...Array<number>] = [1, 2, 3, 4, 5];
    const result = sample(array, 0);

    expectTypeOf(result).toEqualTypeOf<[]>();
  });

  test("on readonly tuples with rest head", () => {
    const array: readonly [...Array<number>, number] = [1, 2, 3, 4, 5];
    const result = sample(array, 0);

    expectTypeOf(result).toEqualTypeOf<[]>();
  });
});

describe("sampleSize < n", () => {
  test("on arrays", () => {
    const array: Array<number> = [1, 2, 3, 4, 5];
    const result = sample(array, 4);

    expectTypeOf(result).toEqualTypeOf<
      | []
      | [number, number, number, number]
      | [number, number, number]
      | [number, number]
      | [number]
    >();
  });

  test("on readonly arrays", () => {
    const array: ReadonlyArray<number> = [1, 2, 3, 4, 5];
    const result = sample(array, 4);

    expectTypeOf(result).toEqualTypeOf<
      | []
      | [number, number, number, number]
      | [number, number, number]
      | [number, number]
      | [number]
    >();
  });

  test("on tuples", () => {
    const array: [1, 2, 3, 4, 5] = [1, 2, 3, 4, 5];
    const result = sample(array, 4);

    expectTypeOf(result).toEqualTypeOf<
      [1 | 2 | 3 | 4 | 5, 2 | 3 | 4 | 5, 3 | 4 | 5, 4 | 5]
    >();
  });

  test("on readonly tuples", () => {
    const array = [1, 2, 3, 4, 5] as const;
    const result = sample(array, 4);

    expectTypeOf(result).toEqualTypeOf<
      [1 | 2 | 3 | 4 | 5, 2 | 3 | 4 | 5, 3 | 4 | 5, 4 | 5]
    >();
  });

  test("on tuples with rest tail", () => {
    const array: [number, boolean, ...Array<string>] = [
      1,
      true,
      "hello",
      "world",
      "yey",
    ];
    const result = sample(array, 4);

    expectTypeOf(result).toEqualTypeOf<
      // TODO: This type is OK (it doesn't type things incorrectly) but it's not as narrow as it could be. If the tuple has only 2 elements, the result should be: `[number, boolean]` and similarly for 3 elements. Only when the tuple has 4 elements then the type of the first and second item should be loosened because we don't know how many items are in the input.
      | [boolean | number | string, boolean | string, string, string]
      | [boolean | number | string, boolean | string, string]
      | [boolean | number | string, boolean | string]
    >();
  });

  test("on readonly tuples with rest tail", () => {
    const array: readonly [number, boolean, ...Array<string>] = [
      1,
      true,
      "hello",
      "world",
      "yey",
    ];
    const result = sample(array, 4);

    expectTypeOf(result).toEqualTypeOf<
      // TODO: This type is OK (it doesn't type things incorrectly) but it's not as narrow as it could be. If the tuple has only 2 elements, the result should be: `[number, boolean]` and similarly for 3 elements. Only when the tuple has 4 elements then the type of the first and second item should be loosened because we don't know how many items are in the input.
      | [boolean | number | string, boolean | string, string, string]
      | [boolean | number | string, boolean | string, string]
      | [boolean | number | string, boolean | string]
    >();
  });

  test("on tuples with rest head", () => {
    const array: [...Array<string>, boolean, number] = [
      "yey",
      "hello",
      "world",
      true,
      3,
    ];
    const result = sample(array, 4);

    expectTypeOf(result).toEqualTypeOf<
      | [boolean, number]
      | [string, boolean, number]
      | [string, string, boolean, number]
    >();
  });

  test("on readonly tuples with rest head", () => {
    const array: readonly [...Array<string>, boolean, number] = [
      "yey",
      "hello",
      "world",
      true,
      3,
    ];
    const result = sample(array, 4);

    expectTypeOf(result).toEqualTypeOf<
      | [boolean, number]
      | [string, boolean, number]
      | [string, string, boolean, number]
    >();
  });
});

describe("sampleSize === n", () => {
  test("empty array", () => {
    const array: [] = [];
    const result = sample(array, 0);

    expectTypeOf(result).toEqualTypeOf<[]>();
  });

  test("empty readonly array", () => {
    const array: readonly [] = [];
    const result = sample(array, 0);

    expectTypeOf(result).toEqualTypeOf<typeof array>();
  });

  test("on arrays", () => {
    const array: Array<number> = [1, 2, 3, 4, 5];
    const result = sample(array, 5);

    expectTypeOf(result).toEqualTypeOf<
      | []
      | [number, number, number, number, number]
      | [number, number, number, number]
      | [number, number, number]
      | [number, number]
      | [number]
    >();
  });

  test("on readonly arrays", () => {
    const array: ReadonlyArray<number> = [1, 2, 3, 4, 5];
    const result = sample(array, 5);

    expectTypeOf(result).toEqualTypeOf<
      | []
      | [number, number, number, number, number]
      | [number, number, number, number]
      | [number, number, number]
      | [number, number]
      | [number]
    >();
  });

  test("on tuples", () => {
    const array: [1, 2, 3, 4, 5] = [1, 2, 3, 4, 5];
    const result = sample(array, 5);

    expectTypeOf(result).toEqualTypeOf<typeof array>();
  });

  test("on readonly tuples", () => {
    const array = [1, 2, 3, 4, 5] as const;
    const result = sample(array, 5);

    expectTypeOf(result).toEqualTypeOf<typeof array>();
  });

  test("on tuples with rest tail", () => {
    const array: [number, boolean, ...Array<string>] = [
      1,
      true,
      "hello",
      "world",
      "yey",
    ];
    const result = sample(array, 5);

    expectTypeOf(result).toEqualTypeOf<
      // TODO: This type is OK (it doesn't type things incorrectly) but it's not as narrow as it could be. If the tuple has only 2 elements, the result should be: `[number, boolean]` and similarly for 3 and 4 elements. Only when the return tuple has 5 elements then the type of the first and second item should be loosened because we don't know how many items are in the input.
      | [boolean | number | string, boolean | string, string, string, string]
      | [boolean | number | string, boolean | string, string, string]
      | [boolean | number | string, boolean | string, string]
      | [boolean | number | string, boolean | string]
    >();
  });

  test("on readonly tuples with rest tail", () => {
    const array: readonly [number, boolean, ...Array<string>] = [
      1,
      true,
      "hello",
      "world",
      "yey",
    ];
    const result = sample(array, 5);

    expectTypeOf(result).toEqualTypeOf<
      // TODO: This type is OK (it doesn't type things incorrectly) but it's not as narrow as it could be. If the tuple has only 2 elements, the result should be: `[number, boolean]` and similarly for 3 and 4 elements. Only when the return tuple has 5 elements then the type of the first and second item should be loosened because we don't know how many items are in the input.
      | [boolean | number | string, boolean | string, string, string, string]
      | [boolean | number | string, boolean | string, string, string]
      | [boolean | number | string, boolean | string, string]
      | [boolean | number | string, boolean | string]
    >();
  });

  test("on tuples with rest head", () => {
    const array: [...Array<string>, boolean, number] = [
      "yey",
      "hello",
      "world",
      true,
      3,
    ];
    const result = sample(array, 5);

    expectTypeOf(result).toEqualTypeOf<
      | [boolean, number]
      | [string, boolean, number]
      | [string, string, boolean, number]
      | [string, string, string, boolean, number]
    >();
  });

  test("on readonly tuples with rest head", () => {
    const array: readonly [...Array<string>, boolean, number] = [
      "yey",
      "hello",
      "world",
      true,
      3,
    ];
    const result = sample(array, 5);

    expectTypeOf(result).toEqualTypeOf<
      | [boolean, number]
      | [string, boolean, number]
      | [string, string, boolean, number]
      | [string, string, string, boolean, number]
    >();
  });
});

describe("sampleSize > n", () => {
  test("empty array", () => {
    const array: [] = [];
    const result = sample(array, 10);

    expectTypeOf(result).toEqualTypeOf<[]>();
  });

  test("empty readonly array", () => {
    const array: readonly [] = [];
    const result = sample(array, 10);

    expectTypeOf(result).toEqualTypeOf<typeof array>();
  });

  test("on arrays", () => {
    const array: Array<number> = [1, 2, 3, 4, 5];
    const result = sample(array, 10);

    expectTypeOf(result).toEqualTypeOf<
      | [
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
        ]
      | []
      | [number, number, number, number, number, number, number, number, number]
      | [number, number, number, number, number, number, number, number]
      | [number, number, number, number, number, number, number]
      | [number, number, number, number, number, number]
      | [number, number, number, number, number]
      | [number, number, number, number]
      | [number, number, number]
      | [number, number]
      | [number]
    >();
  });

  test("on readonly arrays", () => {
    const array: ReadonlyArray<number> = [1, 2, 3, 4, 5];
    const result = sample(array, 10);

    expectTypeOf(result).toEqualTypeOf<
      | [
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
        ]
      | []
      | [number, number, number, number, number, number, number, number, number]
      | [number, number, number, number, number, number, number, number]
      | [number, number, number, number, number, number, number]
      | [number, number, number, number, number, number]
      | [number, number, number, number, number]
      | [number, number, number, number]
      | [number, number, number]
      | [number, number]
      | [number]
    >();
  });

  test("on tuples", () => {
    const array: [1, 2, 3, 4, 5] = [1, 2, 3, 4, 5];
    const result = sample(array, 10);

    expectTypeOf(result).toEqualTypeOf<typeof array>();
  });

  test("on readonly tuples", () => {
    const array = [1, 2, 3, 4, 5] as const;
    const result = sample(array, 10);

    expectTypeOf(result).toEqualTypeOf<typeof array>();
  });

  test("on tuples with rest tail", () => {
    const array: [number, boolean, ...Array<string>] = [
      1,
      true,
      "hello",
      "world",
      "yey",
    ];
    const result = sample(array, 10);

    expectTypeOf(result).toEqualTypeOf<
      // TODO: This type is OK (it doesn't type things incorrectly) but it's not as narrow as it could be. If the tuple has only 2 elements, the result should be: `[number, boolean]` and similarly for 3-9 elements. Only when the return tuple has 10 elements then the type of the first and second item should be loosened because we don't know how many items are in the input.
      | [
          boolean | number | string,
          boolean | string,
          string,
          string,
          string,
          string,
          string,
          string,
          string,
          string,
        ]
      | [
          boolean | number | string,
          boolean | string,
          string,
          string,
          string,
          string,
          string,
          string,
          string,
        ]
      | [
          boolean | number | string,
          boolean | string,
          string,
          string,
          string,
          string,
          string,
          string,
        ]
      | [
          boolean | number | string,
          boolean | string,
          string,
          string,
          string,
          string,
          string,
        ]
      | [
          boolean | number | string,
          boolean | string,
          string,
          string,
          string,
          string,
        ]
      | [boolean | number | string, boolean | string, string, string, string]
      | [boolean | number | string, boolean | string, string, string]
      | [boolean | number | string, boolean | string, string]
      | [boolean | number | string, boolean | string]
    >();
  });

  test("on readonly tuples with rest tail", () => {
    const array: readonly [number, boolean, ...Array<string>] = [
      1,
      true,
      "hello",
      "world",
      "yey",
    ];
    const result = sample(array, 10);

    expectTypeOf(result).toEqualTypeOf<
      // TODO: This type is OK (it doesn't type things incorrectly) but it's not as narrow as it could be. If the tuple has only 2 elements, the result should be: `[number, boolean]` and similarly for 3-9 elements. Only when the return tuple has 10 elements then the type of the first and second item should be loosened because we don't know how many items are in the input.
      | [
          boolean | number | string,
          boolean | string,
          string,
          string,
          string,
          string,
          string,
          string,
          string,
          string,
        ]
      | [
          boolean | number | string,
          boolean | string,
          string,
          string,
          string,
          string,
          string,
          string,
          string,
        ]
      | [
          boolean | number | string,
          boolean | string,
          string,
          string,
          string,
          string,
          string,
          string,
        ]
      | [
          boolean | number | string,
          boolean | string,
          string,
          string,
          string,
          string,
          string,
        ]
      | [
          boolean | number | string,
          boolean | string,
          string,
          string,
          string,
          string,
        ]
      | [boolean | number | string, boolean | string, string, string, string]
      | [boolean | number | string, boolean | string, string, string]
      | [boolean | number | string, boolean | string, string]
      | [boolean | number | string, boolean | string]
    >();
  });

  test("on tuples with rest head", () => {
    const array: [...Array<string>, boolean, number] = [
      "yey",
      "hello",
      "world",
      true,
      3,
    ];
    const result = sample(array, 10);

    expectTypeOf(result).toEqualTypeOf<
      | [
          string,
          string,
          string,
          string,
          string,
          string,
          string,
          boolean,
          number,
        ]
      | [
          string,
          string,
          string,
          string,
          string,
          string,
          string,
          string,
          boolean,
          number,
        ]
      | [boolean, number]
      | [string, boolean, number]
      | [string, string, boolean, number]
      | [string, string, string, boolean, number]
      | [string, string, string, string, boolean, number]
      | [string, string, string, string, string, boolean, number]
      | [string, string, string, string, string, string, boolean, number]
    >();
  });

  test("on readonly tuples with rest head", () => {
    const array: readonly [...Array<string>, boolean, number] = [
      "yey",
      "hello",
      "world",
      true,
      3,
    ];
    const result = sample(array, 10);

    expectTypeOf(result).toEqualTypeOf<
      | [
          string,
          string,
          string,
          string,
          string,
          string,
          string,
          boolean,
          number,
        ]
      | [
          string,
          string,
          string,
          string,
          string,
          string,
          string,
          string,
          boolean,
          number,
        ]
      | [boolean, number]
      | [string, boolean, number]
      | [string, string, boolean, number]
      | [string, string, string, boolean, number]
      | [string, string, string, string, boolean, number]
      | [string, string, string, string, string, boolean, number]
      | [string, string, string, string, string, string, boolean, number]
    >();
  });
});

describe("non-const sampleSize", () => {
  test("empty array", () => {
    const array: [] = [];
    const result = sample(array, 5 as number);

    expectTypeOf(result).toEqualTypeOf<[]>();
  });

  test("empty readonly array", () => {
    const array: readonly [] = [];
    const result = sample(array, 5 as number);

    expectTypeOf(result).toEqualTypeOf<typeof array>();
  });

  test("on arrays", () => {
    const array: Array<number> = [1, 2, 3, 4, 5];
    const result = sample(array, 5 as number);

    expectTypeOf(result).toEqualTypeOf<Array<number>>();
  });

  test("on readonly arrays", () => {
    const array: ReadonlyArray<number> = [1, 2, 3, 4, 5];
    const result = sample(array, 5 as number);

    expectTypeOf(result).toEqualTypeOf<Array<number>>();
  });

  test("on tuples", () => {
    const array: [1, 2, 3, 4, 5] = [1, 2, 3, 4, 5];
    const result = sample(array, 5 as number);

    expectTypeOf(result).toEqualTypeOf<
      | []
      | [1, 2, 3, 4, 5]
      | [1, 2, 3, 4]
      | [1, 2, 3, 5]
      | [1, 2, 3]
      | [1, 2, 4, 5]
      | [1, 2, 4]
      | [1, 2, 5]
      | [1, 2]
      | [1, 3, 4, 5]
      | [1, 3, 4]
      | [1, 3, 5]
      | [1, 3]
      | [1, 4, 5]
      | [1, 4]
      | [1, 5]
      | [1]
      | [2, 3, 4, 5]
      | [2, 3, 4]
      | [2, 3, 5]
      | [2, 3]
      | [2, 4, 5]
      | [2, 4]
      | [2, 5]
      | [2]
      | [3, 4, 5]
      | [3, 4]
      | [3, 5]
      | [3]
      | [4, 5]
      | [4]
      | [5]
    >();
  });

  test("on readonly tuples", () => {
    const array = [1, 2, 3, 4, 5] as const;
    const result = sample(array, 5 as number);

    expectTypeOf(result).toEqualTypeOf<
      | []
      | [1, 2, 3, 4, 5]
      | [1, 2, 3, 4]
      | [1, 2, 3, 5]
      | [1, 2, 3]
      | [1, 2, 4, 5]
      | [1, 2, 4]
      | [1, 2, 5]
      | [1, 2]
      | [1, 3, 4, 5]
      | [1, 3, 4]
      | [1, 3, 5]
      | [1, 3]
      | [1, 4, 5]
      | [1, 4]
      | [1, 5]
      | [1]
      | [2, 3, 4, 5]
      | [2, 3, 4]
      | [2, 3, 5]
      | [2, 3]
      | [2, 4, 5]
      | [2, 4]
      | [2, 5]
      | [2]
      | [3, 4, 5]
      | [3, 4]
      | [3, 5]
      | [3]
      | [4, 5]
      | [4]
      | [5]
    >();
  });

  test("on tuples with rest tail", () => {
    const array: [number, boolean, ...Array<string>] = [
      1,
      true,
      "hello",
      "world",
      "yey",
    ];
    const result = sample(array, 5 as number);

    expectTypeOf(result).toEqualTypeOf<
      | Array<string>
      | [boolean, ...Array<string>]
      | [number, ...Array<string>]
      | [number, boolean, ...Array<string>]
    >();
  });

  test("on readonly tuples with rest tail", () => {
    const array: readonly [number, boolean, ...Array<string>] = [
      1,
      true,
      "hello",
      "world",
      "yey",
    ];
    const result = sample(array, 5 as number);

    expectTypeOf(result).toEqualTypeOf<
      | Array<string>
      | [boolean, ...Array<string>]
      | [number, ...Array<string>]
      | [number, boolean, ...Array<string>]
    >();
  });

  test("on tuples with rest head", () => {
    const array: [...Array<string>, boolean, number] = [
      "yey",
      "hello",
      "world",
      true,
      3,
    ];
    const result = sample(array, 5 as number);

    expectTypeOf(result).toEqualTypeOf<
      // TODO: the typing isn't ideal here. I'm not even sure what the type here should be...
      Array<boolean | number | string>
    >();
  });

  test("on readonly tuples with rest head", () => {
    const array: readonly [...Array<string>, boolean, number] = [
      "yey",
      "hello",
      "world",
      true,
      3,
    ];
    const result = sample(array, 5 as number);

    expectTypeOf(result).toEqualTypeOf<
      // TODO: the typing isn't ideal here. I'm not even sure what the type here should be...
      Array<boolean | number | string>
    >();
  });
});
