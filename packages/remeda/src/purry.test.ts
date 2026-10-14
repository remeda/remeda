import { expect, test, describe } from "vitest";
import { purry } from "./purry";

// A regular arrow function would only return these keys when inspected via
// `Reflect.ownKeys`. Any other key on the function means it was augmented after
// creation.
const ARROW_FUNCTION_OWN_PROPS = ["length", "name"];

type RestArgsFunction = (...args: readonly unknown[]) => unknown;

describe("data-first (delegated)", () => {
  test("exact number of arguments", () => {
    expect(purriedFn(13, 37)).toBe("1337");
  });

  test("excess arguments are passed through", () => {
    expect(purriedFn(1, 33, 7)).toBe("1337");
  });

  test("as a callback, the extra arguments run it data-first", () => {
    expect([13, 37].map(purriedFn)).toStrictEqual(["130<NaN>", "371<NaN>"]);
  });
});

describe("data-last (curried)", () => {
  describe("missing a single argument", () => {
    // @ts-expect-error [ts2322] -- purry returns `unknown` by design; the tests in this block assert the runtime shape this type describes.
    const curried: RestArgsFunction = purriedFn(37);

    test("returns a function", () => {
      expect(curried).toBeTypeOf("function");
    });

    test("curried function declares a single parameter", () => {
      expect(curried).toHaveLength(1);
    });

    test("exact number of arguments to curried function", () => {
      expect(curried(13)).toBe("1337");
    });

    test("excess arguments to curried function are ignored", () => {
      expect(curried(1, 3)).toBe("137");
    });

    test("curried function carries no metadata", () => {
      expect(Reflect.ownKeys(curried)).toStrictEqual(ARROW_FUNCTION_OWN_PROPS);
    });
  });

  describe("missing more than one argument", () => {
    // @ts-expect-error [ts2322] -- purry returns `unknown` by design; the tests in this block assert the runtime shape this type describes.
    const curried: RestArgsFunction = purriedFn();

    test("returns a function", () => {
      expect(curried).toBeTypeOf("function");
    });

    test("curried function declares a single parameter", () => {
      expect(curried).toHaveLength(1);
    });

    test("exact number of arguments to curried function", () => {
      expect(curried(1337)).toBe("1337");
    });

    test("excess arguments to curried function are ignored", () => {
      expect(curried(13, 37)).toBe("13");
    });

    test("curried function carries no metadata", () => {
      expect(Reflect.ownKeys(curried)).toStrictEqual(ARROW_FUNCTION_OWN_PROPS);
    });
  });
});

const purriedFn = (...args: readonly unknown[]): unknown =>
  purry(concatenateNumberArgs, args);

function concatenateNumberArgs(_a: number, _b: number): string {
  // eslint-disable-next-line prefer-rest-params -- Intentional, we want to bypass the function shape (which is observable at runtime via `Function.length`) to lock in how excess arguments are passed through.
  return [...arguments]
    .map((x) => (typeof x === "number" ? x.toString() : "<NaN>"))
    .join("");
}
