import { chunk } from "./chunk";
import { type NonEmptyArray } from "./internal/types";

describe("regular (non-literal) size", () => {
  test("empty tuple", () => {
    const input = [] as [];
    const result = chunk(input, 2 as number);
    expectTypeOf(result).toEqualTypeOf<[]>();
  });

  test("readonly empty tuple", () => {
    const input = [] as const;
    const result = chunk(input, 2 as number);
    expectTypeOf(result).toEqualTypeOf<[]>();
  });

  test("array", () => {
    const input = [] as Array<number>;
    const result = chunk(input, 2 as number);
    expectTypeOf(result).toEqualTypeOf<Array<NonEmptyArray<number>>>();
  });

  test("readonly array", () => {
    const input = [] as ReadonlyArray<number>;
    const result = chunk(input, 2 as number);
    expectTypeOf(result).toEqualTypeOf<Array<NonEmptyArray<number>>>();
  });

  test("tuple", () => {
    const input = [123, 456, 789] as [number, number, number];
    const result = chunk(input, 2 as number);
    expectTypeOf(result).toEqualTypeOf<NonEmptyArray<NonEmptyArray<number>>>();
  });

  test("readonly tuple", () => {
    const input = [123, 456, 789] as readonly [number, number, number];
    const result = chunk(input, 2 as number);
    expectTypeOf(result).toEqualTypeOf<NonEmptyArray<NonEmptyArray<number>>>();
  });

  test("tuple with rest tail", () => {
    const input = [123, 456] as [number, ...Array<number>];
    const result = chunk(input, 2 as number);
    expectTypeOf(result).toEqualTypeOf<NonEmptyArray<NonEmptyArray<number>>>();
  });

  test("readonly tuple with rest tail", () => {
    const input = [123, 456] as readonly [number, ...Array<number>];
    const result = chunk(input, 2 as number);
    expectTypeOf(result).toEqualTypeOf<NonEmptyArray<NonEmptyArray<number>>>();
  });

  test("tuple with rest middle", () => {
    const input = [123, 456] as [number, ...Array<number>, number];
    const result = chunk(input, 2 as number);
    expectTypeOf(result).toEqualTypeOf<NonEmptyArray<NonEmptyArray<number>>>();
  });

  test("readonly tuple with rest middle", () => {
    const input = [123, 456] as readonly [number, ...Array<number>, number];
    const result = chunk(input, 2 as number);
    expectTypeOf(result).toEqualTypeOf<NonEmptyArray<NonEmptyArray<number>>>();
  });

  test("tuple with rest head", () => {
    const input = [123, 456] as [...Array<number>, number];
    const result = chunk(input, 2 as number);
    expectTypeOf(result).toEqualTypeOf<NonEmptyArray<NonEmptyArray<number>>>();
  });

  test("readonly tuple with rest head", () => {
    const input = [123, 456] as readonly [...Array<number>, number];
    const result = chunk(input, 2 as number);
    expectTypeOf(result).toEqualTypeOf<NonEmptyArray<NonEmptyArray<number>>>();
  });
});

describe("literal size", () => {
  test("empty tuple", () => {
    const input = [] as [];
    const result = chunk(input, 2);
    expectTypeOf(result).toEqualTypeOf<[]>();
  });

  test("readonly empty tuple", () => {
    const input = [] as const;
    const result = chunk(input, 2);
    expectTypeOf(result).toEqualTypeOf<[]>();
  });

  test("array", () => {
    const input = [] as Array<number>;
    const result = chunk(input, 2);
    expectTypeOf(result).toEqualTypeOf<
      [...Array<[number, number]>, [number, number] | [number]] | []
    >();
  });

  test("readonly array", () => {
    const input = [] as ReadonlyArray<number>;
    const result = chunk(input, 2);
    expectTypeOf(result).toEqualTypeOf<
      [...Array<[number, number]>, [number, number] | [number]] | []
    >();
  });

  test("tuple", () => {
    const input = [123, 456, 789] as [number, number, number];
    const result = chunk(input, 2);
    expectTypeOf(result).toEqualTypeOf<[[number, number], [number]]>();
  });

  test("readonly tuple", () => {
    const input = [123, 456, 789] as readonly [number, number, number];
    const result = chunk(input, 2);
    expectTypeOf(result).toEqualTypeOf<[[number, number], [number]]>();
  });

  test("const", () => {
    const input = [123, 456, 789] as const;
    const result = chunk(input, 2);
    expectTypeOf(result).toEqualTypeOf<[[123, 456], [789]]>();
  });

  describe("mixed type prefix arrays", () => {
    describe("mutable array", () => {
      test("prefix is shorter than chunk size", () => {
        const data = [1] as [number, ...Array<boolean>];
        const result = chunk(data, 2);
        expectTypeOf(result).toEqualTypeOf<
          | [
              [number, boolean],
              ...Array<[boolean, boolean]>,
              [boolean, boolean] | [boolean],
            ]
          | [[number, boolean] | [number]]
        >();
      });

      test("prefix is same size as chunk size", () => {
        const data = [1, 2] as [number, number, ...Array<boolean>];
        const result = chunk(data, 2);
        expectTypeOf(result).toEqualTypeOf<
          [
            [number, number],
            ...Array<[boolean, boolean]>,
            [boolean, boolean] | [boolean],
          ]
        >();
      });

      test("prefix is longer than chunk size", () => {
        const data = [1, 2, 3] as [number, number, number, ...Array<boolean>];
        const result = chunk(data, 2);
        expectTypeOf(result).toEqualTypeOf<
          | [
              [number, number],
              [number, boolean],
              ...Array<[boolean, boolean]>,
              [boolean, boolean] | [boolean],
            ]
          | [[number, number], [number, boolean] | [number]]
        >();
      });
    });
  });
});

describe("KNOWN ISSUES", () => {
  test("tuple with rest middle", () => {
    const input = [123, 456] as [number, ...Array<boolean>, number];
    const result = chunk(input, 2);
    expectTypeOf(result).toEqualTypeOf<
      // @ts-expect-error [ts2344] - We don't return the correct type for this case!
      | [
          [number, boolean],
          ...Array<[boolean, boolean]>,
          [boolean, number] | [number],
        ]
      | [[number, number]]
    >();
  });

  test("tuple with rest head", () => {
    const input = [456] as [...Array<boolean>, number];
    const result = chunk(input, 2);
    expectTypeOf(result).toEqualTypeOf<
      // @ts-expect-error [ts2344] - We don't return the correct type for this case!
      [...Array<[boolean, boolean]>, [boolean, number] | [number]]
    >();
  });
});
