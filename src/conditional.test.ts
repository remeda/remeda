import { conditional } from "./conditional";
import { firstBy } from "./firstBy";
import { isDeepEqual } from "./isDeepEqual";
import { isNonNullish } from "./isNonNullish";
import { isNullish } from "./isNullish";
import { isNumber } from "./isNumber";
import { isString } from "./isString";
import { pipe } from "./pipe";
import { prop } from "./prop";

describe("runtime (dataFirst)", () => {
  it("falls back to trivial default", () => {
    expect(conditional("Jokic", conditional.defaultCase())).toBeUndefined();
  });

  it("falls back to our default", () => {
    expect(
      conditional(
        "Jokic",
        conditional.defaultCase(() => "hello"),
      ),
    ).toEqual("hello");
  });

  it("works with a single case", () => {
    expect(conditional("Jokic", [isDeepEqual("Jokic"), () => "center"])).toBe(
      "center",
    );
  });

  it("works with two cases", () => {
    expect(
      conditional(
        "Jokic",
        [isDeepEqual("Murray"), () => "point guard"],
        [isDeepEqual("Jokic"), () => "center"],
      ),
    ).toBe("center");
  });

  it("picks the first matching case", () => {
    expect(
      conditional(
        "Jokic",
        [isDeepEqual("Jokic"), () => "center"],
        [isDeepEqual("Jokic"), () => "mvp"],
      ),
    ).toBe("center");
  });

  it("throws when no matching case", () => {
    expect(() =>
      conditional("Jokic", [() => false, () => "world"]),
    ).toThrowErrorMatchingInlineSnapshot(
      "[Error: conditional: data failed for all cases]",
    );
  });
});

describe("runtime (dataLast)", () => {
  test("should return value of first pair", () => {
    const value = pipe(
      "Jokic",
      conditional(
        [isDeepEqual("Murray"), () => "point guard"],
        [isDeepEqual("Jokic"), () => "center"],
        [isDeepEqual("Jokic"), () => "mvp"],
      ),
    );
    expect(value).toBe("center");
  });
});

describe("typing", () => {
  describe("data-first", () => {
    it("narrows types in the transformers", () => {
      const data = 3 as number | string;

      conditional(
        data,
        [
          isString,
          (str) => {
            expectTypeOf(str).toEqualTypeOf<string>();
          },
        ],
        [
          isNumber,
          (num) => {
            expectTypeOf(num).toEqualTypeOf<number>();
          },
        ],
        [
          isNullish,
          (impossible) => {
            expectTypeOf(impossible).toEqualTypeOf<never>();
          },
        ],
        [
          isNonNullish,
          (x) => {
            expectTypeOf(x).toEqualTypeOf<number | string>();
          },
        ],
        [
          (x): x is 3 => x === 3,
          (x) => {
            expectTypeOf(x).toEqualTypeOf<3>();
          },
        ],
      );
    });

    // https://github.com/remeda/remeda/issues/675
    it("narrows types when using `isNullish`/`isNonNullish` with complex data", () => {
      const data = firstBy(
        [{ x: 10 }, { x: 20 }] as Array<{ x: number }>,
        prop("x"),
      );

      conditional(
        data,
        [
          isNullish,
          (x) => {
            expectTypeOf(x).toEqualTypeOf<undefined>();
          },
        ],
        [
          isNonNullish,
          (x) => {
            expectTypeOf(x).toEqualTypeOf<{
              x: number;
            }>();
          },
        ],
      );
    });

    it("passes the trivial defaultCase's type to the output", () => {
      const result = conditional(
        "Jokic",
        [isString, () => "hello" as const],
        conditional.defaultCase(),
      );
      expectTypeOf(result).toEqualTypeOf<"hello" | undefined>();
    });

    it("passes the defaultCase's type to the output", () => {
      const result = conditional(
        "Jokic",
        [isString, () => "hello" as const],
        conditional.defaultCase(() => 123 as const),
      );
      expectTypeOf(result).toEqualTypeOf<"hello" | 123>();
    });
  });

  describe("data-last", () => {
    it("narrows types in the transformers", () => {
      const data = 3 as number | string;

      pipe(
        data,
        conditional(
          [
            isString,
            (str) => {
              expectTypeOf(str).toEqualTypeOf<string>();
            },
          ],
          [
            isNumber,
            (num) => {
              expectTypeOf(num).toEqualTypeOf<number>();
            },
          ],
          [
            isNullish,
            (impossible) => {
              expectTypeOf(impossible).toEqualTypeOf<never>();
            },
          ],
          [
            isNonNullish,
            (x) => {
              expectTypeOf(x).toEqualTypeOf<number | string>();
            },
          ],
          [
            (x): x is 3 => x === 3,
            (x) => {
              expectTypeOf(x).toEqualTypeOf<3>();
            },
          ],
        ),
      );
    });

    // https://github.com/remeda/remeda/issues/675
    it("narrows types when using `isNullish`/`isNonNullish` with complex data", () => {
      pipe(
        [{ x: 10 }, { x: 20 }],
        firstBy(prop("x")),
        conditional(
          [
            isNullish,
            (x) => {
              expectTypeOf(x).toEqualTypeOf<undefined>();
            },
          ],
          [
            isNonNullish,
            (x) => {
              expectTypeOf(x).toEqualTypeOf<{
                x: number;
              }>();
            },
          ],
        ),
      );
    });

    it("passes the trivial defaultCase's type to the output", () => {
      const result = pipe(
        "Jokic",
        conditional(
          [isString, () => "hello" as const],
          conditional.defaultCase(),
        ),
      );

      expectTypeOf(result).toEqualTypeOf<"hello" | undefined>();
    });

    it("passes the defaultCase's type to the output", () => {
      const result = pipe(
        "Jokic",
        conditional(
          [isString, () => "hello" as const],
          conditional.defaultCase(() => 123 as const),
        ),
      );

      expectTypeOf(result).toEqualTypeOf<"hello" | 123>();
    });
  });
});
