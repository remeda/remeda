import { conditional } from "./conditional";
import { equals } from "./equals";
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
      `[Error: conditional: data failed for all cases]`,
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
    const data = 3 as string | number;
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
});
