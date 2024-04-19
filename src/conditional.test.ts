import { conditional } from "./conditional";
import { equals } from "./equals";
import { every } from "./every";
import { isNumber } from "./isNumber";
import { isString } from "./isString";
import { pipe } from "./pipe";

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
    expect(conditional("Jokic", [equals("Jokic"), () => "center"])).toBe(
      "center",
    );
  });

  it("works with two cases", () => {
    expect(
      conditional(
        "Jokic",
        [equals("Murray"), () => "point guard"],
        [equals("Jokic"), () => "center"],
      ),
    ).toBe("center");
  });

  it("picks the first matching case", () => {
    expect(
      conditional(
        "Jokic",
        [equals("Jokic"), () => "center"],
        [equals("Jokic"), () => "mvp"],
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
        [equals("Murray"), () => "point guard"],
        [equals("Jokic"), () => "center"],
        [equals("Jokic"), () => "mvp"],
      ),
    );
    expect(value).toBe("center");
  });
});

describe("typing", () => {
  it("can narrow types in the transformers", () => {
    const data = 3 as number | string;
    conditional(
      data,
      [
        isString,
        (str) => {
          expectTypeOf(str).toBeString();
          expectTypeOf(str).not.toBeNumber();
        },
      ],
      [
        isNumber,
        (num) => {
          expectTypeOf(num).toBeNumber();
          expectTypeOf(num).not.toBeString();
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

  // Known issue: using `every(typeGuard)` within `conditional` in `pipe` currently cannot narrow
  // types correctly
  // This test is passing like this and if the issue ever gets resolved, we'll find out because it gets
  // broken. See discussion in https://github.com/remeda/remeda/issues/624 for details
  it("can only infer types from `every` when type guard is defined separately", () => {
    const input = [1, 2, 3] as Array<number | string>;

    // incorrect narrowing when using `every` directly
    const resultBroken = pipe(
      input,
      conditional([
        every(isNumber),
        (arr) => {
          expectTypeOf(arr).toEqualTypeOf<Array<number | string>>();
          return true;
        },
      ]),
    );

    expect(resultBroken).toBe(true);

    const allNumbers = every(isNumber);
    // correct narrowing when defining guard explicitly
    const resultCorrect = pipe(
      input,
      conditional([
        allNumbers,
        (arr) => {
          expectTypeOf(arr).toEqualTypeOf<Array<number>>();
          return true;
        },
      ]),
    );

    expect(resultCorrect).toBe(true);
  });
});
