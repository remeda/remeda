import { conditional } from "./conditional";
import { constant } from "./constant";
import { isDeepEqual } from "./isDeepEqual";
import { pipe } from "./pipe";

describe("runtime (dataFirst)", () => {
  it("falls back to trivial default", () => {
    expect(
      conditional("Jokic", [constant(true), constant(undefined)]),
    ).toBeUndefined();

    expect(
      conditional(
        "Jokic",
        // eslint-disable-next-line @typescript-eslint/no-deprecated -- Its safe to delete this check once defaultCase is removed, the check above does the same thing.
        conditional.defaultCase(),
      ),
    ).toBeUndefined();
  });

  it("falls back to our default", () => {
    expect(conditional("Jokic", [constant(true), constant("hello")])).toBe(
      "hello",
    );

    expect(
      conditional(
        "Jokic",
        // eslint-disable-next-line @typescript-eslint/no-deprecated -- Its safe to delete this check once defaultCase is removed, the check above does the same thing.
        conditional.defaultCase(() => "hello"),
      ),
    ).toBe("hello");
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
