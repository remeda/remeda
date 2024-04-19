import { isNumber } from "./isNumber";
import { isString } from "./isString";
import { pipe } from "./pipe";
import { some } from "./some";

describe("data-first", () => {
  test("returns correct values on simple arrays", () => {
    const trueInput = [1, "2", 3];
    const trueData = some(trueInput, isString);
    expect(trueData).toBe(true);

    const falseInput = ["foo", "bar", "buzz"];
    const falseData = some(falseInput, isNumber);
    expect(falseData).toBe(false);
  });

  // empty set check
  test("returns false on empty arrays regardless of predicate", () => {
    const input = [] as const;
    const data = some(input, () => true);
    expect(data).toBe(false);
  });
});

describe("data-last", () => {
  test("returns correct values on simple arrays", () => {
    const trueInput = [1, "2", 3];
    const trueData = some(isString)(trueInput);
    expect(trueData).toBe(true);

    const falseInput = ["foo", "bar", "buzz"];
    const falseData = some(isNumber)(falseInput);
    expect(falseData).toBe(false);
  });

  // empty set check
  test("returns false on empty arrays regardless of predicate", () => {
    const input = [] as const;
    const data = some(() => true)(input);
    expect(data).toBe(false);
  });
});

describe("indexed", () => {
  test("works correctly", () => {
    const input = [1, "2", 3];
    const data = some.indexed(input, (_, index) => index > 5);
    expect(data).toBe(false);
  });
});

describe("in pipe", () => {
  test("infers types", () => {
    const input: Array<number | string> = [1, 2, 3];
    const data = pipe(
      input,
      some((val) => {
        expectTypeOf(val).toEqualTypeOf<number | string>();
        return true;
      }),
    );
    expect(data).toBe(true);
  });
});
