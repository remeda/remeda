import { constant } from "./constant";
import { isString } from "./isString";
import { map } from "./map";
import { pipe } from "./pipe";
import { when } from "./when";

describe("dataFirst", () => {
  describe("no else", () => {
    describe("simple predicates", () => {
      test("mapper param is not narrowed", () => {
        const data = "hello" as number | string;
        when(data, constant(true), (x) => {
          expectTypeOf(x).toEqualTypeOf(data);
        });
      });

      it("return type is not narrowed", () => {
        const data = "hello" as number | string;
        const result = when(data, constant(true), constant({ a: 1 }));
        // The result contains both the input type, and the result of the
        // branch.
        expectTypeOf(result).toEqualTypeOf<typeof data | { a: number }>();
      });

      it("passes extra args to the functions", () => {
        const data = "hello" as number | string;
        when(
          data,
          constant(true),
          (x, a, b, c) => {
            expectTypeOf(x).toEqualTypeOf(data);
            expectTypeOf(a).toEqualTypeOf<1>();
            expectTypeOf(b).toEqualTypeOf<"cat">();
            expectTypeOf(c).toEqualTypeOf<{ readonly a: 123 }>();
          },
          // Extra args:
          1 as const,
          "cat" as const,
          { a: 123 } as const,
        );
      });
    });

    describe("type-guards", () => {
      it("narrows the mapper's param", () => {
        const data = "hello" as number | string;
        when(data, isString, (x) => {
          expectTypeOf(x).toEqualTypeOf<string>();
        });
      });

      it("removes narrowed types from the output", () => {
        const data = "hello" as number | string;
        const result = when(data, isString, constant("cat" as const));
        // The result doesn't contain the input type that was narrowed against
        // (string), but does contain the input type that wasn't (number).
        expectTypeOf(result).toEqualTypeOf<number | "cat">();
      });

      it("passes extra args to the functions (workaround)", () => {
        const data = "hello" as number | string;
        when(
          data,
          isString,
          (x, a, b, c) => {
            expectTypeOf(x).toEqualTypeOf<string>();
            expectTypeOf(a).toEqualTypeOf<1>();
            expectTypeOf(b).toEqualTypeOf<"cat">();
            expectTypeOf(c).toEqualTypeOf<{ readonly a: 123 }>();
          },
          // Extra args:
          1 as const,
          "cat" as const,
          { a: 123 } as const,
        );
      });
    });
  });

  describe("with else", () => {
    describe("simple predicates", () => {
      test("mapper's param is not narrowed", () => {
        const data = "hello" as number | string;
        when(data, constant(true), {
          onTrue: (x) => {
            expectTypeOf(x).toEqualTypeOf(data);
          },
          onFalse: (x) => {
            expectTypeOf(x).toEqualTypeOf(data);
          },
        });
      });

      it("returns the union of the branch return types", () => {
        const data = "hello" as number | string;
        const result = when(data, constant(true), {
          onTrue: constant("cat" as const),
          onFalse: constant("dog" as const),
        });
        expectTypeOf(result).toEqualTypeOf<"cat" | "dog">();
      });

      it("passes extra args to the functions (workaround)", () => {
        const data = "hello" as number | string;
        when(
          data,
          constant(true),
          {
            onTrue: (x, a, b, c) => {
              expectTypeOf(x).toEqualTypeOf(data);
              expectTypeOf(a).toEqualTypeOf<1>();
              expectTypeOf(b).toEqualTypeOf<"cat">();
              expectTypeOf(c).toEqualTypeOf<{ readonly a: 123 }>();
            },
            onFalse: (x, a, b, c) => {
              expectTypeOf(x).toEqualTypeOf(data);
              expectTypeOf(a).toEqualTypeOf<1>();
              expectTypeOf(b).toEqualTypeOf<"cat">();
              expectTypeOf(c).toEqualTypeOf<{ readonly a: 123 }>();
            },
          },
          // Extra args:
          1 as const,
          "cat" as const,
          { a: 123 } as const,
        );
      });
    });

    describe("type-guards", () => {
      it("narrows the mapper's param", () => {
        const data = "hello" as number | string;
        when(data, isString, {
          onTrue: (x) => {
            // Narrowed
            expectTypeOf(x).toEqualTypeOf<string>();
          },
          onFalse: (x) => {
            // Also narrowed!
            expectTypeOf(x).toEqualTypeOf<number>();
          },
        });
      });

      it("returns the union of the branch return types", () => {
        const data = "hello" as number | string;
        const result = when(data, isString, {
          onTrue: constant("cat" as const),
          onFalse: constant("dog" as const),
        });
        expectTypeOf(result).toEqualTypeOf<"cat" | "dog">();
      });

      it("passes extra args to the functions (workaround)", () => {
        const data = "hello" as number | string;
        when(
          data,
          isString,
          {
            onTrue: (x, a, b, c) => {
              // Narrowed
              expectTypeOf(x).toEqualTypeOf<string>();
              expectTypeOf(a).toEqualTypeOf<1>();
              expectTypeOf(b).toEqualTypeOf<"cat">();
              expectTypeOf(c).toEqualTypeOf<{ readonly a: 123 }>();
            },
            onFalse: (x, a, b, c) => {
              // Also narrowed!
              expectTypeOf(x).toEqualTypeOf<number>();
              expectTypeOf(a).toEqualTypeOf<1>();
              expectTypeOf(b).toEqualTypeOf<"cat">();
              expectTypeOf(c).toEqualTypeOf<{ readonly a: 123 }>();
            },
          },
          // Extra args:
          1 as const,
          "cat" as const,
          { a: 123 } as const,
        );
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
          when(constant(true), (x) => {
            expectTypeOf(x).toEqualTypeOf(data);
          }),
        );
      });

      it("return type is not narrowed", () => {
        const data = "hello" as number | string;
        const result = pipe(data, when(constant(true), constant({ a: 1 })));
        // The result contains both the input type, and the result of the
        // branch.
        expectTypeOf(result).toEqualTypeOf<typeof data | { a: number }>();
      });

      it("passes extra args to the functions", () => {
        const data = [] as Array<number | string>;
        map(
          data,
          when(constant(true), (x, index, array) => {
            expectTypeOf(x).toEqualTypeOf<number | string>();
            expectTypeOf(index).toEqualTypeOf<number>();
            expectTypeOf(array).toEqualTypeOf<typeof data>();
          }),
        );
      });
    });

    describe("type-guards", () => {
      it("narrows the mapper's param", () => {
        const data = "hello" as number | string;
        pipe(
          data,
          when(isString, (x) => {
            expectTypeOf(x).toEqualTypeOf<string>();
          }),
        );
      });

      it("removes narrowed types from the output", () => {
        const data = "hello" as number | string;
        const result = pipe(data, when(isString, constant("cat" as const)));
        // The result doesn't contain the input type that was narrowed against
        // (string), but does contain the input type that wasn't (number).
        expectTypeOf(result).toEqualTypeOf<number | "cat">();
      });
    });

    it("passes extra args to the functions", () => {
      const data = [] as Array<number | string>;
      map(
        data,
        when(isString, (x, index, array) => {
          expectTypeOf(x).toEqualTypeOf<string>();
          expectTypeOf(index).toEqualTypeOf<number>();
          expectTypeOf(array).toEqualTypeOf<typeof data>();
        }),
      );
    });
  });

  describe("with else", () => {
    describe("simple predicates", () => {
      test("mapper's param is not narrowed", () => {
        const data = "hello" as number | string;
        pipe(
          data,
          when(constant(true), {
            onTrue: (x) => {
              expectTypeOf(x).toEqualTypeOf(data);
            },
            onFalse: (x) => {
              expectTypeOf(x).toEqualTypeOf(data);
            },
          }),
        );
      });

      it("returns the union of the branch return types", () => {
        const data = "hello" as number | string;
        const result = pipe(
          data,
          when(constant(true), {
            onTrue: constant("cat" as const),
            onFalse: constant("dog" as const),
          }),
        );
        expectTypeOf(result).toEqualTypeOf<"cat" | "dog">();
      });

      it("passes extra args to the functions", () => {
        const data = [] as Array<number | string>;
        map(
          data,
          when(constant(true), {
            onTrue: (x, index, array) => {
              expectTypeOf(x).toEqualTypeOf<number | string>();
              expectTypeOf(index).toEqualTypeOf<number>();
              expectTypeOf(array).toEqualTypeOf<typeof data>();
            },
            onFalse: (x, index, array) => {
              expectTypeOf(x).toEqualTypeOf<number | string>();
              expectTypeOf(index).toEqualTypeOf<number>();
              expectTypeOf(array).toEqualTypeOf<typeof data>();
            },
          }),
        );
      });
    });

    describe("type-guards", () => {
      it("narrows the mapper's param", () => {
        const data = "hello" as number | string;
        pipe(
          data,
          when(isString, {
            onTrue: (x) => {
              // Narrowed
              expectTypeOf(x).toEqualTypeOf<string>();
            },
            onFalse: (x) => {
              // Also narrowed!
              expectTypeOf(x).toEqualTypeOf<number>();
            },
          }),
        );
      });

      it("returns the union of the branch return types", () => {
        const data = "hello" as number | string;
        const result = pipe(
          data,
          when(isString, {
            onTrue: constant("cat" as const),
            onFalse: constant("dog" as const),
          }),
        );
        expectTypeOf(result).toEqualTypeOf<"cat" | "dog">();
      });

      it("passes extra args to the functions", () => {
        const data = [] as Array<number | string>;
        map(
          data,
          when(isString, {
            onTrue: (x, index, array) => {
              // Narrowed!
              expectTypeOf(x).toEqualTypeOf<string>();
              expectTypeOf(index).toEqualTypeOf<number>();
              expectTypeOf(array).toEqualTypeOf<typeof data>();
            },
            onFalse: (x, index, array) => {
              // Also narrowed!
              expectTypeOf(x).toEqualTypeOf<number>();
              expectTypeOf(index).toEqualTypeOf<number>();
              expectTypeOf(array).toEqualTypeOf<typeof data>();
            },
          }),
        );
      });
    });
  });
});

describe("typing mismatches", () => {
  test("Predicate enforces data param when explicitly stated", () => {
    // @ts-expect-error [ts2769] -- The predicate can't take an undefined value
    when(1 as number | undefined, (x: number) => x > 3, constant(3));
  });

  test("Mappers enforce data param when explicitly stated", () => {
    // @ts-expect-error [ts2769] -- The mapper can't take an undefined value
    when(1 as number | undefined, constant(true), (x: number) => x + 1);
  });

  test("Type of extra args enforced (data-first)", () => {
    when(
      1,
      constant(true),
      // @ts-expect-error [ts2345] -- The extra arg is not a boolean
      (x: number, _: boolean) => x,
      (x: number, _: boolean) => x,
      "hello",
    );
  });

  test("Number of extra args enforced (data-first)", () => {
    when(
      1,
      constant(true),
      // @ts-expect-error [ts2345] -- Not enough extra args
      (x: number, _a: boolean, _b: boolean, _c: boolean) => x,
      (x: number, _a: boolean, _b: boolean, _c: boolean) => x,
      true,
      false,
    );
  });

  test("Type of extra args enforced (data-last)", () => {
    map(
      [] as Array<string>,
      when(
        constant(true),
        // @ts-expect-error [ts2345] -- The extra arg is not a boolean
        (x: string, _: boolean) => x,
      ),
    );
  });

  test("Number of extra args enforced (data-last)", () => {
    map(
      [] as Array<string>,
      when(
        constant(true),
        // @ts-expect-error [ts2345] -- Not enough extra args
        (
          x: string,
          _index: number,
          _data: ReadonlyArray<string>,
          _isSomething: boolean,
        ) => x,
      ),
    );
  });
});

describe("recipes", () => {
  it("handles api response union response objects", () => {
    someApi({
      onFoo: when(isErrorPayload, {
        onTrue: ({ error }) => handleError(error),
        onFalse: ({ data }) => handleSuccess(data),
      }),
    });
  });
});

// Some API that returns a union of objects for different response states
declare function someApi(options: {
  readonly onFoo: (payload: Payload) => void;
}): void;
type Payload =
  | ErrorPayload
  | {
      readonly status: "ok";
      readonly data: string;
    };
type ErrorPayload = {
  readonly status: "error";
  readonly error: Error;
};

// A pivoting function, in TypeScript 5.5 these might be inferred for a lot of
// cases and could be inlined.
declare function isErrorPayload(payload: Payload): payload is ErrorPayload;

// Our handlers for the different states
declare function handleError(error: Error): void;
declare function handleSuccess(data: string): void;
