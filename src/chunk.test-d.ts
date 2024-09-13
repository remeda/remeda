import { chunk } from "./chunk";
import type { NonEmptyArray } from "./internal/types";

describe("edge-cases", () => {
  test("0 chunk size", () => {
    const result = chunk([1, 2, 3], 0);
    expectTypeOf(result).toEqualTypeOf<never>();
  });

  test("negative chunk size", () => {
    const result = chunk([1, 2, 3], -10);
    expectTypeOf(result).toEqualTypeOf<never>();
  });
});

describe("regular (non-literal) size", () => {
  describe("mutable", () => {
    test("empty tuple", () => {
      const result = chunk([] as [], 2 as number);
      expectTypeOf(result).toEqualTypeOf<[]>();
    });

    test("array", () => {
      const result = chunk([] as Array<number>, 2 as number);
      expectTypeOf(result).toEqualTypeOf<Array<NonEmptyArray<number>>>();
    });

    test("tuple", () => {
      const result = chunk(
        [123, 456, 789] as [number, number, number],
        2 as number,
      );
      expectTypeOf(result).toEqualTypeOf<
        NonEmptyArray<NonEmptyArray<number>>
      >();
    });

    test("tuple with rest tail", () => {
      const result = chunk(
        [123, 456] as [number, ...Array<number>],
        2 as number,
      );
      expectTypeOf(result).toEqualTypeOf<
        NonEmptyArray<NonEmptyArray<number>>
      >();
    });

    test("tuple with rest middle", () => {
      const result = chunk(
        [123, 456] as [number, ...Array<number>, number],
        2 as number,
      );
      expectTypeOf(result).toEqualTypeOf<
        NonEmptyArray<NonEmptyArray<number>>
      >();
    });

    test("tuple with rest head", () => {
      const result = chunk(
        [123, 456] as [...Array<number>, number],
        2 as number,
      );
      expectTypeOf(result).toEqualTypeOf<
        NonEmptyArray<NonEmptyArray<number>>
      >();
    });
  });

  describe("readonly", () => {
    test("empty tuple", () => {
      const result = chunk([] as const, 2 as number);
      expectTypeOf(result).toEqualTypeOf<[]>();
    });

    test("array", () => {
      const result = chunk([] as ReadonlyArray<number>, 2 as number);
      expectTypeOf(result).toEqualTypeOf<Array<NonEmptyArray<number>>>();
    });

    test("tuple", () => {
      const result = chunk(
        [123, 456, 789] as readonly [number, number, number],
        2 as number,
      );
      expectTypeOf(result).toEqualTypeOf<
        NonEmptyArray<NonEmptyArray<number>>
      >();
    });

    test("tuple with rest tail", () => {
      const result = chunk(
        [123, 456] as readonly [number, ...Array<number>],
        2 as number,
      );
      expectTypeOf(result).toEqualTypeOf<
        NonEmptyArray<NonEmptyArray<number>>
      >();
    });

    test("tuple with rest middle", () => {
      const result = chunk(
        [123, 456] as readonly [number, ...Array<number>, number],
        2 as number,
      );
      expectTypeOf(result).toEqualTypeOf<
        NonEmptyArray<NonEmptyArray<number>>
      >();
    });

    test("tuple with rest head", () => {
      const result = chunk(
        [123, 456] as readonly [...Array<number>, number],
        2 as number,
      );
      expectTypeOf(result).toEqualTypeOf<
        NonEmptyArray<NonEmptyArray<number>>
      >();
    });
  });
});

describe("literal size", () => {
  describe("mutable", () => {
    test("empty tuple", () => {
      const result = chunk([] as [], 2);
      expectTypeOf(result).toEqualTypeOf<[]>();
    });

    test("array", () => {
      const result = chunk([] as Array<number>, 2);
      expectTypeOf(result).toEqualTypeOf<
        [...Array<[number, number]>, [number, number] | [number]] | []
      >();
    });

    test("tuple", () => {
      const result = chunk([123, 456, 789] as [number, number, number], 2);
      expectTypeOf(result).toEqualTypeOf<[[number, number], [number]]>();
    });

    describe("infinite tuples (rest/spread item)", () => {
      describe("prefix arrays", () => {
        test("prefix is shorter than chunk size", () => {
          const result = chunk([1] as [number, ...Array<boolean>], 2);
          expectTypeOf(result).toEqualTypeOf<
            | [
                [number, boolean],
                ...Array<[boolean, boolean]>,
                [boolean, boolean] | [boolean],
              ]
            // TODO: Ideally the following two lines should be folded into a
            // single line: `[[number] | [number, boolean]]`
            | [[number, boolean]]
            | [[number]]
          >();
        });

        test("prefix is same size as chunk size", () => {
          const result = chunk(
            [1, 2] as [number, number, ...Array<boolean>],
            2,
          );
          expectTypeOf(result).toEqualTypeOf<
            | [
                [number, number],
                ...Array<[boolean, boolean]>,
                [boolean, boolean] | [boolean],
              ]
            | [[number, number]]
          >();
        });

        test("prefix is longer than chunk size", () => {
          const result = chunk(
            [1, 2, 3] as [number, number, number, ...Array<boolean>],
            2,
          );
          expectTypeOf(result).toEqualTypeOf<
            | [
                [number, number],
                [number, boolean],
                ...Array<[boolean, boolean]>,
                [boolean, boolean] | [boolean],
              ]
            // TODO: Ideally the following two lines should be folded into a
            // single line: `[[number, number], [number] | [number, boolean]]`
            | [[number, number], [number, boolean]]
            | [[number, number], [number]]
          >();
        });
      });

      describe("suffix arrays", () => {
        test("suffix is shorter than chunk size", () => {
          const result = chunk([1] as [...Array<boolean>, number], 2);
          expectTypeOf(result).toEqualTypeOf<
            | [...Array<[boolean, boolean]>, [boolean, number]]
            | [...Array<[boolean, boolean]>, [number]]
          >();
        });

        test("suffix is same size as chunk size", () => {
          const result = chunk(
            [1, 2] as [...Array<boolean>, number, number],
            2,
          );
          expectTypeOf(result).toEqualTypeOf<
            | [...Array<[boolean, boolean]>, [boolean, number], [number]]
            | [...Array<[boolean, boolean]>, [number, number]]
          >();
        });

        test("suffix is larger than chunk size", () => {
          const result = chunk(
            [1, 2, 3] as [...Array<boolean>, number, number, number],
            2,
          );
          expectTypeOf(result).toEqualTypeOf<
            | [
                ...Array<[boolean, boolean]>,
                [boolean, number],
                [number, number],
              ]
            | [...Array<[boolean, boolean]>, [number, number], [number]]
          >();
        });
      });

      test("both prefix and suffix", () => {
        const result = chunk(
          [123, "abc"] as [number, ...Array<boolean>, string],
          2,
        );
        expectTypeOf(result).toEqualTypeOf<
          | [[number, boolean], ...Array<[boolean, boolean]>, [boolean, string]]
          | [[number, boolean], ...Array<[boolean, boolean]>, [string]]
          // TODO: This is the same type as the previous line (for an empty
          // array), but it's hard to build the types to be aware of it because
          // they come from different branches of the type.
          | [[number, boolean], [string]]
          | [[number, string]]
        >();
      });
    });
  });

  describe("readonly", () => {
    test("empty tuple", () => {
      const result = chunk([] as const, 2);
      expectTypeOf(result).toEqualTypeOf<[]>();
    });

    test("array", () => {
      const result = chunk([] as ReadonlyArray<number>, 2);
      expectTypeOf(result).toEqualTypeOf<
        [...Array<[number, number]>, [number, number] | [number]] | []
      >();
    });

    test("tuple", () => {
      const result = chunk(
        [123, 456, 789] as readonly [number, number, number],
        2,
      );
      expectTypeOf(result).toEqualTypeOf<[[number, number], [number]]>();
    });

    test("const", () => {
      const result = chunk([123, 456, 789] as const, 2);
      expectTypeOf(result).toEqualTypeOf<[[123, 456], [789]]>();
    });

    describe("infinite tuples (rest/spread item)", () => {
      describe("prefix arrays", () => {
        test("prefix is shorter than chunk size", () => {
          const result = chunk([1] as readonly [number, ...Array<boolean>], 2);
          expectTypeOf(result).toEqualTypeOf<
            | [
                [number, boolean],
                ...Array<[boolean, boolean]>,
                [boolean, boolean] | [boolean],
              ]
            // TODO: Ideally the following two lines should be folded into a
            // single line: `[[number] | [number, boolean]]`
            | [[number, boolean]]
            | [[number]]
          >();
        });

        test("prefix is same size as chunk size", () => {
          const result = chunk(
            [1, 2] as readonly [number, number, ...Array<boolean>],
            2,
          );
          expectTypeOf(result).toEqualTypeOf<
            | [
                [number, number],
                ...Array<[boolean, boolean]>,
                [boolean, boolean] | [boolean],
              ]
            | [[number, number]]
          >();
        });

        test("prefix is longer than chunk size", () => {
          const result = chunk(
            [1, 2, 3] as readonly [number, number, number, ...Array<boolean>],
            2,
          );
          expectTypeOf(result).toEqualTypeOf<
            | [
                [number, number],
                [number, boolean],
                ...Array<[boolean, boolean]>,
                [boolean, boolean] | [boolean],
              ]
            // TODO: Ideally the following two lines should be folded into a
            // single line: `[[number, number], [number] | [number, boolean]]`
            | [[number, number], [number, boolean]]
            | [[number, number], [number]]
          >();
        });
      });

      describe("suffix arrays", () => {
        test("suffix is shorter than chunk size", () => {
          const result = chunk([1] as readonly [...Array<boolean>, number], 2);
          expectTypeOf(result).toEqualTypeOf<
            | [...Array<[boolean, boolean]>, [boolean, number]]
            | [...Array<[boolean, boolean]>, [number]]
          >();
        });

        test("suffix is same size as chunk size", () => {
          const result = chunk(
            [1, 2] as readonly [...Array<boolean>, number, number],
            2,
          );
          expectTypeOf(result).toEqualTypeOf<
            | [...Array<[boolean, boolean]>, [boolean, number], [number]]
            | [...Array<[boolean, boolean]>, [number, number]]
          >();
        });

        test("suffix is larger than chunk size", () => {
          const result = chunk(
            [1, 2, 3] as readonly [...Array<boolean>, number, number, number],
            2,
          );
          expectTypeOf(result).toEqualTypeOf<
            | [
                ...Array<[boolean, boolean]>,
                [boolean, number],
                [number, number],
              ]
            | [...Array<[boolean, boolean]>, [number, number], [number]]
          >();
        });
      });

      test("both prefix and suffix", () => {
        const result = chunk(
          [123, "abc"] as readonly [number, ...Array<boolean>, string],
          2,
        );
        expectTypeOf(result).toEqualTypeOf<
          | [[number, boolean], ...Array<[boolean, boolean]>, [boolean, string]]
          | [[number, boolean], ...Array<[boolean, boolean]>, [string]]
          // TODO: This is the same type as the previous line (for an empty
          // array), but it's hard to build the types to be aware of it because
          // they come from different branches of the type.
          | [[number, boolean], [string]]
          | [[number, string]]
        >();
      });
    });
  });

  describe("max literal chunk size", () => {
    test("below max", () => {
      const [[firstItem, secondItem, ...otherItems]] = chunk(
        ["abc", true] as [string, ...Array<number>, boolean],
        200,
      );
      expectTypeOf(firstItem).toEqualTypeOf<string>();
      expectTypeOf(secondItem).toEqualTypeOf<boolean | number>();
      expectTypeOf(otherItems[197]).toEqualTypeOf<
        boolean | number | undefined
      >();
      // @ts-expect-error [ts2339] - This item doesn't exist!
      expectTypeOf(otherItems[198]).toEqualTypeOf<undefined>();
    });
  });

  test("above max", () => {
    const result = chunk(
      ["abc", true] as [string, ...Array<number>, boolean],
      1000,
    );
    expectTypeOf(result).toEqualTypeOf<
      // These are simple non-empty arrays
      [
        [boolean | number | string, ...Array<boolean | number | string>],
        ...Array<
          [boolean | number | string, ...Array<boolean | number | string>]
        >,
      ]
    >();
  });
});
