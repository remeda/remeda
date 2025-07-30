import { describe, expectTypeOf, test } from "vitest";
import { sample } from "./sample";

describe("literal sampleSize === 0", () => {
  test("on arrays", () => {
    expectTypeOf(sample([] as Array<1>, 0)).toEqualTypeOf<[]>();
  });

  test("on readonly arrays", () => {
    expectTypeOf(sample([] as ReadonlyArray<1>, 0)).toEqualTypeOf<[]>();
  });

  test("on fixed-tuples", () => {
    expectTypeOf(sample([1, 2, 3, 4, 5] as [1, 2, 3, 4, 5], 0)).toEqualTypeOf<
      []
    >();
  });

  test("on fixed readonly tuples", () => {
    expectTypeOf(sample([1, 2, 3, 4, 5], 0)).toEqualTypeOf<[]>();
  });

  test("on fixed-prefix arrays", () => {
    expectTypeOf(sample([1] as [1, ...Array<2>], 0)).toEqualTypeOf<[]>();
  });

  test("on fixed-suffix arrays", () => {
    expectTypeOf(sample([2] as [...Array<1>, 2], 0)).toEqualTypeOf<[]>();
  });

  test("on fixed-prefix readonly array", () => {
    expectTypeOf(sample([1] as readonly [1, ...Array<2>], 0)).toEqualTypeOf<
      []
    >();
  });

  test("on fixed-suffix readonly array", () => {
    expectTypeOf(sample([2] as readonly [...Array<1>, 2], 0)).toEqualTypeOf<
      []
    >();
  });
});

describe("literal sampleSize < n", () => {
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
    expectTypeOf(sample([1, 2, 3, 4, 5], 4)).toEqualTypeOf<
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

describe("literal sampleSize === n", () => {
  test("empty array", () => {
    const array: [] = [];
    const result = sample(array, 0);

    expectTypeOf(result).toEqualTypeOf<[]>();
  });

  test("empty readonly array", () => {
    expectTypeOf(sample([], 0)).toEqualTypeOf<[]>();
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
    expectTypeOf(sample([1, 2, 3, 4, 5], 5)).toEqualTypeOf<[1, 2, 3, 4, 5]>();
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

describe("literal sampleSize > n", () => {
  test("empty array", () => {
    const array: [] = [];
    const result = sample(array, 10);

    expectTypeOf(result).toEqualTypeOf<[]>();
  });

  test("empty readonly array", () => {
    expectTypeOf(sample([], 10)).toEqualTypeOf<[]>();
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
    expectTypeOf(sample([1, 2, 3, 4, 5], 10)).toEqualTypeOf<[1, 2, 3, 4, 5]>();
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

describe("primitive sampleSize", () => {
  test("empty array", () => {
    const array: [] = [];
    const result = sample(array, 5 as number);

    expectTypeOf(result).toEqualTypeOf<[]>();
  });

  test("empty readonly array", () => {
    expectTypeOf(sample([], 5 as number)).toEqualTypeOf<[]>();
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
    expectTypeOf(sample([1, 2, 3, 4, 5], 5 as number)).toEqualTypeOf<
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
