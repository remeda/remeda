import { describe, expectTypeOf, test } from "vitest";
import { sample } from "./sample";

describe("literal sampleSize === 0", () => {
  const SAMPLE_SIZE = 0;

  test("on arrays", () => {
    expectTypeOf(sample([] as Array<1>, SAMPLE_SIZE)).toEqualTypeOf<[]>();
  });

  test("on readonly arrays", () => {
    expectTypeOf(sample([] as ReadonlyArray<1>, SAMPLE_SIZE)).toEqualTypeOf<
      []
    >();
  });

  test("on fixed-tuples", () => {
    expectTypeOf(
      sample([1, 2, 3, 4, 5] as [1, 2, 3, 4, 5], SAMPLE_SIZE),
    ).toEqualTypeOf<[]>();
  });

  test("on fixed readonly tuples", () => {
    expectTypeOf(sample([1, 2, 3, 4, 5], SAMPLE_SIZE)).toEqualTypeOf<[]>();
  });

  test("on fixed-prefix arrays", () => {
    expectTypeOf(sample([1] as [1, ...Array<2>], SAMPLE_SIZE)).toEqualTypeOf<
      []
    >();
  });

  test("on fixed-suffix arrays", () => {
    expectTypeOf(sample([2] as [...Array<1>, 2], SAMPLE_SIZE)).toEqualTypeOf<
      []
    >();
  });

  test("on fixed-prefix readonly array", () => {
    expectTypeOf(
      sample([1] as readonly [1, ...Array<2>], SAMPLE_SIZE),
    ).toEqualTypeOf<[]>();
  });

  test("on fixed-suffix readonly array", () => {
    expectTypeOf(
      sample([2] as readonly [...Array<1>, 2], SAMPLE_SIZE),
    ).toEqualTypeOf<[]>();
  });
});

describe("literal sampleSize < n", () => {
  const SAMPLE_SIZE = 4;

  test("on arrays", () => {
    expectTypeOf(sample([] as Array<number>, SAMPLE_SIZE)).toEqualTypeOf<
      | []
      | [number, number, number, number]
      | [number, number, number]
      | [number, number]
      | [number]
    >();
  });

  test("on readonly arrays", () => {
    expectTypeOf(
      sample([] as ReadonlyArray<number>, SAMPLE_SIZE),
    ).toEqualTypeOf<
      | []
      | [number, number, number, number]
      | [number, number, number]
      | [number, number]
      | [number]
    >();
  });

  test("on tuples", () => {
    expectTypeOf(
      sample([1, 2, 3, 4, 5] as [1, 2, 3, 4, 5], SAMPLE_SIZE),
    ).toEqualTypeOf<[1 | 2 | 3 | 4 | 5, 2 | 3 | 4 | 5, 3 | 4 | 5, 4 | 5]>();
  });

  test("on readonly tuples", () => {
    expectTypeOf(sample([1, 2, 3, 4, 5], SAMPLE_SIZE)).toEqualTypeOf<
      [1 | 2 | 3 | 4 | 5, 2 | 3 | 4 | 5, 3 | 4 | 5, 4 | 5]
    >();
  });

  test("on tuples with rest tail", () => {
    expectTypeOf(
      sample([1, true] as [number, boolean, ...Array<string>], SAMPLE_SIZE),
    ).toEqualTypeOf<
      // TODO: This type is OK (it doesn't type things incorrectly) but it's not as narrow as it could be. If the tuple has only 2 elements, the result should be: `[number, boolean]` and similarly for 3 elements. Only when the tuple has 4 elements then the type of the first and second item should be loosened because we don't know how many items are in the input.
      | [boolean | number | string, boolean | string, string, string]
      | [boolean | number | string, boolean | string, string]
      | [boolean | number | string, boolean | string]
    >();
  });

  test("on readonly tuples with rest tail", () => {
    expectTypeOf(
      sample(
        [1, true] as readonly [number, boolean, ...Array<string>],
        SAMPLE_SIZE,
      ),
    ).toEqualTypeOf<
      // TODO: This type is OK (it doesn't type things incorrectly) but it's not as narrow as it could be. If the tuple has only 2 elements, the result should be: `[number, boolean]` and similarly for 3 elements. Only when the tuple has 4 elements then the type of the first and second item should be loosened because we don't know how many items are in the input.
      | [boolean | number | string, boolean | string, string, string]
      | [boolean | number | string, boolean | string, string]
      | [boolean | number | string, boolean | string]
    >();
  });

  test("on tuples with rest head", () => {
    expectTypeOf(
      sample([true, 3] as [...Array<string>, boolean, number], SAMPLE_SIZE),
    ).toEqualTypeOf<
      | [boolean, number]
      | [string, boolean, number]
      | [string, string, boolean, number]
    >();
  });

  test("on readonly tuples with rest head", () => {
    expectTypeOf(
      sample(
        [true, 3] as readonly [...Array<string>, boolean, number],
        SAMPLE_SIZE,
      ),
    ).toEqualTypeOf<
      | [boolean, number]
      | [string, boolean, number]
      | [string, string, boolean, number]
    >();
  });
});

describe("literal sampleSize === n", () => {
  const SAMPLE_SIZE = 5;

  test("empty array", () => {
    expectTypeOf(sample([] as [], SAMPLE_SIZE)).toEqualTypeOf<[]>();
  });

  test("empty readonly array", () => {
    expectTypeOf(sample([], SAMPLE_SIZE)).toEqualTypeOf<[]>();
  });

  test("on arrays", () => {
    expectTypeOf(sample([] as Array<number>, SAMPLE_SIZE)).toEqualTypeOf<
      | []
      | [number, number, number, number, number]
      | [number, number, number, number]
      | [number, number, number]
      | [number, number]
      | [number]
    >();
  });

  test("on readonly arrays", () => {
    expectTypeOf(
      sample([] as ReadonlyArray<number>, SAMPLE_SIZE),
    ).toEqualTypeOf<
      | []
      | [number, number, number, number, number]
      | [number, number, number, number]
      | [number, number, number]
      | [number, number]
      | [number]
    >();
  });

  test("on tuples", () => {
    expectTypeOf(
      sample([1, 2, 3, 4, 5] as [1, 2, 3, 4, 5], SAMPLE_SIZE),
    ).toEqualTypeOf<[1, 2, 3, 4, 5]>();
  });

  test("on readonly tuples", () => {
    expectTypeOf(sample([1, 2, 3, 4, 5], SAMPLE_SIZE)).toEqualTypeOf<
      [1, 2, 3, 4, 5]
    >();
  });

  test("on tuples with rest tail", () => {
    expectTypeOf(
      sample([1, true] as [number, boolean, ...Array<string>], SAMPLE_SIZE),
    ).toEqualTypeOf<
      // TODO: This type is OK (it doesn't type things incorrectly) but it's not as narrow as it could be. If the tuple has only 2 elements, the result should be: `[number, boolean]` and similarly for 3 and 4 elements. Only when the return tuple has 5 elements then the type of the first and second item should be loosened because we don't know how many items are in the input.
      | [boolean | number | string, boolean | string, string, string, string]
      | [boolean | number | string, boolean | string, string, string]
      | [boolean | number | string, boolean | string, string]
      | [boolean | number | string, boolean | string]
    >();
  });

  test("on readonly tuples with rest tail", () => {
    expectTypeOf(
      sample([1, true] as [number, boolean, ...Array<string>], SAMPLE_SIZE),
    ).toEqualTypeOf<
      // TODO: This type is OK (it doesn't type things incorrectly) but it's not as narrow as it could be. If the tuple has only 2 elements, the result should be: `[number, boolean]` and similarly for 3 and 4 elements. Only when the return tuple has 5 elements then the type of the first and second item should be loosened because we don't know how many items are in the input.
      | [boolean | number | string, boolean | string, string, string, string]
      | [boolean | number | string, boolean | string, string, string]
      | [boolean | number | string, boolean | string, string]
      | [boolean | number | string, boolean | string]
    >();
  });

  test("on tuples with rest head", () => {
    expectTypeOf(
      sample([true, 3] as [...Array<string>, boolean, number], SAMPLE_SIZE),
    ).toEqualTypeOf<
      | [boolean, number]
      | [string, boolean, number]
      | [string, string, boolean, number]
      | [string, string, string, boolean, number]
    >();
  });

  test("on readonly tuples with rest head", () => {
    expectTypeOf(
      sample(
        [true, 3] as readonly [...Array<string>, boolean, number],
        SAMPLE_SIZE,
      ),
    ).toEqualTypeOf<
      | [boolean, number]
      | [string, boolean, number]
      | [string, string, boolean, number]
      | [string, string, string, boolean, number]
    >();
  });
});

describe("literal sampleSize > n", () => {
  const SAMPLE_SIZE = 10;

  test("empty array", () => {
    expectTypeOf(sample([] as [], SAMPLE_SIZE)).toEqualTypeOf<[]>();
  });

  test("empty readonly array", () => {
    expectTypeOf(sample([], SAMPLE_SIZE)).toEqualTypeOf<[]>();
  });

  test("on arrays", () => {
    expectTypeOf(sample([] as Array<number>, SAMPLE_SIZE)).toEqualTypeOf<
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
    expectTypeOf(
      sample([] as ReadonlyArray<number>, SAMPLE_SIZE),
    ).toEqualTypeOf<
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
    expectTypeOf(
      sample([1, 2, 3, 4, 5] as [1, 2, 3, 4, 5], SAMPLE_SIZE),
    ).toEqualTypeOf<[1, 2, 3, 4, 5]>();
  });

  test("on readonly tuples", () => {
    expectTypeOf(sample([1, 2, 3, 4, 5], SAMPLE_SIZE)).toEqualTypeOf<
      [1, 2, 3, 4, 5]
    >();
  });

  test("on tuples with rest tail", () => {
    expectTypeOf(
      sample([1, true] as [number, boolean, ...Array<string>], SAMPLE_SIZE),
    ).toEqualTypeOf<
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
    expectTypeOf(
      sample([1, true] as [number, boolean, ...Array<string>], SAMPLE_SIZE),
    ).toEqualTypeOf<
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
    expectTypeOf(
      sample([true, 3] as [...Array<string>, boolean, number], SAMPLE_SIZE),
    ).toEqualTypeOf<
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
    expectTypeOf(
      sample(
        [true, 3] as readonly [...Array<string>, boolean, number],
        SAMPLE_SIZE,
      ),
    ).toEqualTypeOf<
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
  const SAMPLE_SIZE = 1 as number;

  test("empty array", () => {
    expectTypeOf(sample([] as [], SAMPLE_SIZE)).toEqualTypeOf<[]>();
  });

  test("empty readonly array", () => {
    expectTypeOf(sample([], SAMPLE_SIZE)).toEqualTypeOf<[]>();
  });

  test("on arrays", () => {
    expectTypeOf(sample([] as Array<number>, SAMPLE_SIZE)).toEqualTypeOf<
      Array<number>
    >();
  });

  test("on readonly arrays", () => {
    expectTypeOf(
      sample([] as ReadonlyArray<number>, SAMPLE_SIZE),
    ).toEqualTypeOf<Array<number>>();
  });

  test("on tuples", () => {
    expectTypeOf(
      sample([1, 2, 3, 4, 5] as [1, 2, 3, 4, 5], SAMPLE_SIZE),
    ).toEqualTypeOf<
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
    expectTypeOf(sample([1, 2, 3, 4, 5], SAMPLE_SIZE)).toEqualTypeOf<
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
    expectTypeOf(
      sample([1, true] as [number, boolean, ...Array<string>], SAMPLE_SIZE),
    ).toEqualTypeOf<
      | Array<string>
      | [boolean, ...Array<string>]
      | [number, ...Array<string>]
      | [number, boolean, ...Array<string>]
    >();
  });

  test("on readonly tuples with rest tail", () => {
    expectTypeOf(
      sample(
        [1, true] as readonly [number, boolean, ...Array<string>],
        SAMPLE_SIZE,
      ),
    ).toEqualTypeOf<
      | Array<string>
      | [boolean, ...Array<string>]
      | [number, ...Array<string>]
      | [number, boolean, ...Array<string>]
    >();
  });

  test("on tuples with rest head", () => {
    expectTypeOf(
      sample([true, 3] as [...Array<string>, boolean, number], SAMPLE_SIZE),
    ).toEqualTypeOf<
      // TODO: the typing isn't ideal here. I'm not even sure what the type here should be...
      Array<boolean | number | string>
    >();
  });

  test("on readonly tuples with rest head", () => {
    expectTypeOf(
      sample([true, 3] as [...Array<string>, boolean, number], SAMPLE_SIZE),
    ).toEqualTypeOf<
      // TODO: the typing isn't ideal here. I'm not even sure what the type here should be...
      Array<boolean | number | string>
    >();
  });
});
