import { branch } from "./branch";
import { constant } from "./constant";
import { isString } from "./isString";
import { pipe } from "./pipe";

describe("dataFirst", () => {
  describe("no else", () => {
    describe("simple predicates", () => {
      test("mapper param is not narrowed", () => {
        const data = "hello" as number | string;
        branch(data, constant(true), (x) => {
          expectTypeOf(x).toEqualTypeOf(data);
        });
      });

      it("return type is not narrowed ", () => {
        const data = "hello" as number | string;
        const result = branch(data, constant(true), constant({ a: 1 }));
        // The result contains both the input type, and the result of the
        // branch.
        expectTypeOf(result).toEqualTypeOf<typeof data | { a: number }>();
      });
    });

    describe("type-guards", () => {
      it("narrows the mapper's param", () => {
        const data = "hello" as number | string;
        branch(data, isString, (x) => {
          expectTypeOf(x).toEqualTypeOf<string>();
        });
      });

      it("removes narrowed types from the output", () => {
        const data = "hello" as number | string;
        const result = branch(data, isString, constant("cat" as const));
        // The result doesn't contain the input type that was narrowed against
        // (string), but does contain the input type that wasn't (number).
        expectTypeOf(result).toEqualTypeOf<number | "cat">();
      });
    });
  });

  describe("with else", () => {
    describe("simple predicates", () => {
      test("mapper's param is not narrowed", () => {
        const data = "hello" as number | string;
        branch(
          data,
          constant(true),
          (x) => {
            expectTypeOf(x).toEqualTypeOf(data);
          },
          (x) => {
            expectTypeOf(x).toEqualTypeOf(data);
          },
        );
      });

      it("returns the union of the branch return types", () => {
        const data = "hello" as number | string;
        const result = branch(
          data,
          constant(true),
          constant("cat" as const),
          constant("dog" as const),
        );
        expectTypeOf(result).toEqualTypeOf<"cat" | "dog">();
      });
    });

    describe("type-guards", () => {
      it("narrows the mapper's param", () => {
        const data = "hello" as number | string;
        branch(
          data,
          isString,
          (x) => {
            // Narrowed
            expectTypeOf(x).toEqualTypeOf<string>();
          },
          (x) => {
            // Also narrowed!
            expectTypeOf(x).toEqualTypeOf<number>();
          },
        );
      });

      it("returns the union of the branch return types", () => {
        const data = "hello" as number | string;
        const result = branch(
          data,
          isString,
          constant("cat" as const),
          constant("dog" as const),
        );
        expectTypeOf(result).toEqualTypeOf<"cat" | "dog">();
      });
    });
  });
});

describe("dataLast", () => {
  describe("no else", () => {
    describe("simple predicates", () => {
      test("mapper param is not narrowed", () => {
        const data = "hello" as number | string;
        pipe(
          data,
          branch(constant(true), (x) => {
            expectTypeOf(x).toEqualTypeOf(data);
          }),
        );
      });

      it("return type is not narrowed ", () => {
        const data = "hello" as number | string;
        const result = pipe(data, branch(constant(true), constant({ a: 1 })));
        // The result contains both the input type, and the result of the
        // branch.
        expectTypeOf(result).toEqualTypeOf<typeof data | { a: number }>();
      });
    });

    describe("type-guards", () => {
      it("narrows the mapper's param", () => {
        const data = "hello" as number | string;
        pipe(
          data,
          branch(isString, (x) => {
            expectTypeOf(x).toEqualTypeOf<string>();
          }),
        );
      });

      it("removes narrowed types from the output", () => {
        const data = "hello" as number | string;
        const result = pipe(data, branch(isString, constant("cat" as const)));
        // The result doesn't contain the input type that was narrowed against
        // (string), but does contain the input type that wasn't (number).
        expectTypeOf(result).toEqualTypeOf<number | "cat">();
      });
    });
  });

  describe("with else", () => {
    describe("simple predicates", () => {
      test("mapper's param is not narrowed", () => {
        const data = "hello" as number | string;
        pipe(
          data,
          branch(
            constant(true),
            (x) => {
              expectTypeOf(x).toEqualTypeOf(data);
            },
            (x) => {
              expectTypeOf(x).toEqualTypeOf(data);
            },
          ),
        );
      });

      it("returns the union of the branch return types", () => {
        const data = "hello" as number | string;
        const result = pipe(
          data,
          branch(
            constant(true),
            constant("cat" as const),
            constant("dog" as const),
          ),
        );
        expectTypeOf(result).toEqualTypeOf<"cat" | "dog">();
      });
    });

    describe("type-guards", () => {
      it("narrows the mapper's param", () => {
        const data = "hello" as number | string;
        pipe(
          data,
          branch(
            isString,
            (x) => {
              // Narrowed
              expectTypeOf(x).toEqualTypeOf<string>();
            },
            (x) => {
              // Also narrowed!
              expectTypeOf(x).toEqualTypeOf<number>();
            },
          ),
        );
      });

      it("returns the union of the branch return types", () => {
        const data = "hello" as number | string;
        const result = pipe(
          data,
          branch(isString, constant("cat" as const), constant("dog" as const)),
        );
        expectTypeOf(result).toEqualTypeOf<"cat" | "dog">();
      });
    });
  });
});

describe("typing mismatches", () => {
  test("predicate enforces data param when explicitly stated", () => {
    // @ts-expect-error [ts2769] -- The predicate can't take an undefined value
    branch(1 as number | undefined, (x: number) => x > 3, constant(3));
  });

  test("mappers enforce data param when explicitly stated", () => {
    // @ts-expect-error [ts2769] -- The mapper can't take an undefined value
    branch(1 as number | undefined, constant(true), (x: number) => x + 1);
  });
});
