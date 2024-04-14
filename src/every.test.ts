import { every } from "./every";
import { filter } from "./filter";
import { isNumber } from "./isNumber";
import { pipe } from "./pipe";

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
      expectTypeOf(input).toEqualTypeOf<Array<number>>();
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
      expectTypeOf(input).toEqualTypeOf<Array<number>>();
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
      every((val) => {
        expectTypeOf(val).toEqualTypeOf<number | string>();
        return true;
      }),
    );
    expect(data).toBe(true);
  });

  test("narrows types when used with filter", () => {
    const input = [
      [1, 2],
      [1, "a"],
      ["foo", "bar"],
    ] as Array<Array<number | string>>;
    pipe(input, filter(every(isNumber)), (val) => {
      expectTypeOf(val).toEqualTypeOf<Array<Array<number>>>();
    });
  });
});
