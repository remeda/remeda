import { conditional } from "./conditional";
import { constant } from "./constant";
import { every } from "./every";
import { isNumber } from "./isNumber";
import { pipe } from "./pipe";

describe("every", () => {
  describe("data-first", () => {
    test("returns correct values on simple arrays", () => {
      const trueInput = [1, 2, 3];
      const trueData = every(trueInput, (val) => val < 5);
      expect(trueData).toBe(true);

      const falseInput = ["foo", "bar", "buzz"];
      const falseData = every(falseInput, (val) => val.length > 3);
      expect(falseData).toBe(false);
    });

    // empty set check
    test("returns true on empty arrays regardless of predicate", () => {
      const input = [] as const;
      const data = every(input, () => false);
      expect(data).toBe(true);
    });

    test("narrows types when a type predicate is passed", () => {
      const input: Array<number | string> = [1, 2];
      const data = every(input, isNumber);
      expect(data).toBe(true);
      if (every(input, isNumber)) {
        assertType<Array<number>>(input);
      }
    });
  });

  describe("data-last", () => {
    test("returns correct values on simple arrays", () => {
      const trueInput = [1, 2, 3];
      const trueData = every((val: number) => val < 5)(trueInput);
      expect(trueData).toBe(true);

      const falseInput = ["foo", "bar", "buzz"];
      const falseData = every((val: string) => val.length > 3)(falseInput);
      expect(falseData).toBe(false);
    });

    // empty set check
    test("returns true on empty arrays regardless of predicate", () => {
      const input = [] as const;
      const data = every(() => false)(input);
      expect(data).toBe(true);
    });

    test("narrows types when a type predicate is passed", () => {
      const input: Array<number | string> = [1, 2];
      const data = every(isNumber)(input);
      expect(data).toBe(true);
      if (every(isNumber)(input)) {
        assertType<Array<number>>(input);
      }
    });
  });

  describe("indexed", () => {
    test("works correctly", () => {
      const input = [1, 2, 3];
      const data = every.indexed(input, (_, index) => index > 5);
      expect(data).toBe(false);
    });
  });

  describe("in pipe", () => {
    test("infers types", () => {
      const input: Array<number | string> = [1, 2, 3];
      const data = pipe(
        input,
        every((_val) => {
          assertType<number | string>(_val);
          return true;
        }),
      );
      expect(data).toBe(true);
    });

    const customIsNumber = (val: unknown): val is number =>
      typeof val === "number";

    test("narrows types", () => {
      const input: Array<number | string> = [1, 2, "foo"];

      const checkType = every(customIsNumber);
      //    ^? returns `data is number[]`
      const data = pipe(
        input,
        conditional(
          [
            every(customIsNumber),
            (val) => {
              // but the narrowing here fails
              // it works if I directly use `checkType` instead of `every(customIsNumber)`
              assertType<Array<number>>(val);
              return true;
            },
          ],
          conditional.defaultCase(constant(false)),
        ),
      );
      expect(data).toBe(false);
    });
  });
});
