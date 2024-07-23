import { chunk } from "./chunk";
import { type NonEmptyArray } from "./internal/types";

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
      const input = [] as [];
      const result = chunk(input, 2 as number);
      expectTypeOf(result).toEqualTypeOf<[]>();
    });

    test("array", () => {
      const input = [] as Array<number>;
      const result = chunk(input, 2 as number);
      expectTypeOf(result).toEqualTypeOf<Array<NonEmptyArray<number>>>();
    });

    test("tuple", () => {
      const input = [123, 456, 789] as [number, number, number];
      const result = chunk(input, 2 as number);
      expectTypeOf(result).toEqualTypeOf<
        NonEmptyArray<NonEmptyArray<number>>
      >();
    });

    test("tuple with rest tail", () => {
      const input = [123, 456] as [number, ...Array<number>];
      const result = chunk(input, 2 as number);
      expectTypeOf(result).toEqualTypeOf<
        NonEmptyArray<NonEmptyArray<number>>
      >();
    });

    test("tuple with rest middle", () => {
      const input = [123, 456] as [number, ...Array<number>, number];
      const result = chunk(input, 2 as number);
      expectTypeOf(result).toEqualTypeOf<
        NonEmptyArray<NonEmptyArray<number>>
      >();
    });

    test("tuple with rest head", () => {
      const input = [123, 456] as [...Array<number>, number];
      const result = chunk(input, 2 as number);
      expectTypeOf(result).toEqualTypeOf<
        NonEmptyArray<NonEmptyArray<number>>
      >();
    });
  });

  describe("readonly", () => {
    test("empty tuple", () => {
      const input = [] as const;
      const result = chunk(input, 2 as number);
      expectTypeOf(result).toEqualTypeOf<[]>();
    });

    test("array", () => {
      const input = [] as ReadonlyArray<number>;
      const result = chunk(input, 2 as number);
      expectTypeOf(result).toEqualTypeOf<Array<NonEmptyArray<number>>>();
    });

    test("tuple", () => {
      const input = [123, 456, 789] as readonly [number, number, number];
      const result = chunk(input, 2 as number);
      expectTypeOf(result).toEqualTypeOf<
        NonEmptyArray<NonEmptyArray<number>>
      >();
    });

    test("tuple with rest tail", () => {
      const input = [123, 456] as readonly [number, ...Array<number>];
      const result = chunk(input, 2 as number);
      expectTypeOf(result).toEqualTypeOf<
        NonEmptyArray<NonEmptyArray<number>>
      >();
    });

    test("tuple with rest middle", () => {
      const input = [123, 456] as readonly [number, ...Array<number>, number];
      const result = chunk(input, 2 as number);
      expectTypeOf(result).toEqualTypeOf<
        NonEmptyArray<NonEmptyArray<number>>
      >();
    });

    test("tuple with rest head", () => {
      const input = [123, 456] as readonly [...Array<number>, number];
      const result = chunk(input, 2 as number);
      expectTypeOf(result).toEqualTypeOf<
        NonEmptyArray<NonEmptyArray<number>>
      >();
    });
  });
});

describe("literal size", () => {
  describe("mutable", () => {
    test("empty tuple", () => {
      const input = [] as [];
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

    test("tuple", () => {
      const input = [123, 456, 789] as [number, number, number];
      const result = chunk(input, 2);
      expectTypeOf(result).toEqualTypeOf<[[number, number], [number]]>();
    });

    describe("infinite tuples (rest/spread item)", () => {
      describe("prefix arrays", () => {
        test("prefix is shorter than chunk size", () => {
          const data = [1] as [number, ...Array<boolean>];
          const result = chunk(data, 2);
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
          const data = [1, 2] as [number, number, ...Array<boolean>];
          const result = chunk(data, 2);
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
          const data = [1, 2, 3] as [number, number, number, ...Array<boolean>];
          const result = chunk(data, 2);
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
          const input = [1] as [...Array<boolean>, number];
          const result = chunk(input, 2);
          expectTypeOf(result).toEqualTypeOf<
            | [...Array<[boolean, boolean]>, [boolean, number]]
            | [...Array<[boolean, boolean]>, [number]]
          >();
        });

        test("suffix is same size as chunk size", () => {
          const input = [1, 2] as [...Array<boolean>, number, number];
          const result = chunk(input, 2);
          expectTypeOf(result).toEqualTypeOf<
            | [...Array<[boolean, boolean]>, [boolean, number], [number]]
            | [...Array<[boolean, boolean]>, [number, number]]
          >();
        });

        test("suffix is larger than chunk size", () => {
          const input = [1, 2, 3] as [
            ...Array<boolean>,
            number,
            number,
            number,
          ];
          const result = chunk(input, 2);
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
        const input = [123, "abc"] as [number, ...Array<boolean>, string];
        const result = chunk(input, 2);
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
      const input = [] as const;
      const result = chunk(input, 2);
      expectTypeOf(result).toEqualTypeOf<[]>();
    });

    test("array", () => {
      const input = [] as ReadonlyArray<number>;
      const result = chunk(input, 2);
      expectTypeOf(result).toEqualTypeOf<
        [...Array<[number, number]>, [number, number] | [number]] | []
      >();
    });

    test("tuple", () => {
      const input = [123, 456, 789] as readonly [number, number, number];
      const result = chunk(input, 2);
      expectTypeOf(result).toEqualTypeOf<[[number, number], [number]]>();
    });

    test("const", () => {
      const input = [123, 456, 789] as const;
      const result = chunk(input, 2);
      expectTypeOf(result).toEqualTypeOf<[[123, 456], [789]]>();
    });

    describe("infinite tuples (rest/spread item)", () => {
      describe("prefix arrays", () => {
        test("prefix is shorter than chunk size", () => {
          const data = [1] as readonly [number, ...Array<boolean>];
          const result = chunk(data, 2);
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
          const data = [1, 2] as readonly [number, number, ...Array<boolean>];
          const result = chunk(data, 2);
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
          const data = [1, 2, 3] as readonly [
            number,
            number,
            number,
            ...Array<boolean>,
          ];
          const result = chunk(data, 2);
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
          const input = [1] as readonly [...Array<boolean>, number];
          const result = chunk(input, 2);
          expectTypeOf(result).toEqualTypeOf<
            | [...Array<[boolean, boolean]>, [boolean, number]]
            | [...Array<[boolean, boolean]>, [number]]
          >();
        });

        test("suffix is same size as chunk size", () => {
          const input = [1, 2] as readonly [...Array<boolean>, number, number];
          const result = chunk(input, 2);
          expectTypeOf(result).toEqualTypeOf<
            | [...Array<[boolean, boolean]>, [boolean, number], [number]]
            | [...Array<[boolean, boolean]>, [number, number]]
          >();
        });

        test("suffix is larger than chunk size", () => {
          const input = [1, 2, 3] as readonly [
            ...Array<boolean>,
            number,
            number,
            number,
          ];
          const result = chunk(input, 2);
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
        const input = [123, "abc"] as readonly [
          number,
          ...Array<boolean>,
          string,
        ];
        const result = chunk(input, 2);
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
});
