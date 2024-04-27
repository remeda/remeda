import { every } from "./every";
import { isNumber } from "./isNumber";
import { pipe } from "./pipe";

describe("runtime", () => {
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

    test("works with indexed predicate", () => {
      const input = [1, 2, 3];
      const data = every(input, (_, index) => index < 5);
      expect(data).toBe(true);
    });
  });

  describe("data-last", () => {
    test("returns correct values on simple arrays", () => {
      const trueData = pipe(
        [1, 2, 3],
        every((val: number) => val < 5),
      );
      expect(trueData).toBe(true);

      const falseData = pipe(
        ["foo", "bar", "buzz"],
        every((val: string) => val.length > 3),
      );
      expect(falseData).toBe(false);
    });

    // empty set check
    test("returns true on empty arrays regardless of predicate", () => {
      const data = pipe(
        [] as const,
        every(() => false),
      );
      expect(data).toBe(true);
    });

    test("works with indexed predicate", () => {
      const input = [1, 2, 3];
      const data = pipe(
        input,
        every((_, index) => index < 5),
      );
      expect(data).toBe(true);
    });
  });
});

describe("typing", () => {
  test("narrows types when a type predicate is passed", () => {
    const input: Array<number | string> = [1, 2];
    if (every(input, isNumber)) {
      expectTypeOf(input).toEqualTypeOf<Array<number>>();
    }
  });

  test("works with indexed predicate", () => {
    const input = [1, 2, 3];
    const data = every(input, (val, index, arr) => {
      expectTypeOf(val).toEqualTypeOf<number>();
      expectTypeOf(index).toEqualTypeOf<number>();
      expectTypeOf(arr).toEqualTypeOf<ReadonlyArray<number>>();
      return index < 5;
    });

    const dataPipe = pipe(
      input,
      every((val, index, arr) => {
        expectTypeOf(val).toEqualTypeOf<number>();
        expectTypeOf(index).toEqualTypeOf<number>();
        expectTypeOf(arr).toEqualTypeOf<ReadonlyArray<number>>();
        return index < 5;
      }),
    );
    expect(data).toBe(true);
    expect(dataPipe).toBe(true);
  });

  test("infers types when used in pipe", () => {
    const input = [1, 2, 3] as Array<number | string>;
    const data = pipe(
      input,
      every((val) => {
        expectTypeOf(val).toEqualTypeOf<number | string>();
        return true;
      }),
    );
    expect(data).toBe(true);
  });
});
