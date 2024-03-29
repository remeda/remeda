import { hasAtLeast } from "./hasAtLeast";

describe("runtime behavior", () => {
  describe("dataFirst", () => {
    it("works on empty arrays", () => {
      expect(hasAtLeast([], 0)).toBe(true);
      expect(hasAtLeast([], 10)).toBe(false);
    });

    it("works on single item arrays", () => {
      expect(hasAtLeast([1], 0)).toBe(true);
      expect(hasAtLeast([1], 1)).toBe(true);
      expect(hasAtLeast([1], 2)).toBe(false);
    });

    it("works on large arrays", () => {
      const array = Array.from({ length: 1000 }, (_, i) => i);
      expect(hasAtLeast(array, 0)).toBe(true);
      expect(hasAtLeast(array, 1)).toBe(true);
      expect(hasAtLeast(array, 1000)).toBe(true);
      expect(hasAtLeast(array, 1001)).toBe(false);
    });

    it("works on sparse arrays", () => {
      const array = Array.from({ length: 1000 });
      expect(hasAtLeast(array, 0)).toBe(true);
      expect(hasAtLeast(array, 1)).toBe(true);
      expect(hasAtLeast(array, 1000)).toBe(true);
      expect(hasAtLeast(array, 1001)).toBe(false);
    });
  });

  describe("dataLast", () => {
    it("works on empty arrays", () => {
      expect(hasAtLeast(0)([])).toBe(true);
      expect(hasAtLeast(10)([])).toBe(false);
    });

    it("works on single item arrays", () => {
      expect(hasAtLeast(0)([1])).toBe(true);
      expect(hasAtLeast(1)([1])).toBe(true);
      expect(hasAtLeast(2)([1])).toBe(false);
    });

    it("works on large arrays", () => {
      const array = Array.from({ length: 1000 }, (_, i) => i);
      expect(hasAtLeast(0)(array)).toBe(true);
      expect(hasAtLeast(1)(array)).toBe(true);
      expect(hasAtLeast(1000)(array)).toBe(true);
      expect(hasAtLeast(1001)(array)).toBe(false);
    });

    it("works on sparse arrays", () => {
      const array = Array.from({ length: 1000 });
      expect(hasAtLeast(0)(array)).toBe(true);
      expect(hasAtLeast(1)(array)).toBe(true);
      expect(hasAtLeast(1000)(array)).toBe(true);
      expect(hasAtLeast(1001)(array)).toBe(false);
    });
  });
});

describe("typing", () => {
  describe("dataFirst", () => {
    it("narrows on empty checks", () => {
      const array = [] as Array<number>;
      if (hasAtLeast(array, 0)) {
        expectTypeOf(array).toEqualTypeOf<Array<number>>();
      }
    });

    it("narrows on non-empty checks", () => {
      const array = [] as Array<number>;
      if (hasAtLeast(array, 1)) {
        expectTypeOf(array).toEqualTypeOf<[number, ...Array<number>]>();
      }
    });

    it("narrows on large numbers", () => {
      const array = [] as Array<number>;
      if (hasAtLeast(array, 10)) {
        expectTypeOf(array).toEqualTypeOf<
          [
            number,
            number,
            number,
            number,
            number,
            number,
            number,
            number,
            number,
            number,
            ...Array<number>,
          ]
        >();
      }
    });
  });

  describe("dataLast", () => {
    it("narrows on empty checks", () => {
      const array = [] as Array<number>;
      if (hasAtLeast(0)(array)) {
        expectTypeOf(array).toEqualTypeOf<Array<number>>();
      }
    });

    it("narrows on non-empty checks", () => {
      const array = [] as Array<number>;
      if (hasAtLeast(1)(array)) {
        expectTypeOf(array).toEqualTypeOf<[number, ...Array<number>]>();
      }
    });

    it("narrows on large numbers", () => {
      const array = [] as Array<number>;
      if (hasAtLeast(10)(array)) {
        expectTypeOf(array).toEqualTypeOf<
          [
            number,
            number,
            number,
            number,
            number,
            number,
            number,
            number,
            number,
            number,
            ...Array<number>,
          ]
        >();
      }
    });

    it("creates narrowing utility functions", () => {
      const hasADozen = hasAtLeast(12);
      const numbersArray = [] as Array<number>;
      if (hasADozen(numbersArray)) {
        expectTypeOf(numbersArray).toEqualTypeOf<
          [
            number,
            number,
            number,
            number,
            number,
            number,
            number,
            number,
            number,
            number,
            number,
            number,
            ...Array<number>,
          ]
        >();
      }

      const stringsArray = [] as Array<string>;
      if (hasADozen(stringsArray)) {
        expectTypeOf(stringsArray).toEqualTypeOf<
          [
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            ...Array<string>,
          ]
        >();
      }
    });
  });

  it("LEGACY: doesn't allow when minimum isn't literal", () => {
    // TODO: Remove this in V2
    const array = [] as Array<number>;
    if (hasAtLeast(array, 5 as number)) {
      expectTypeOf(array).toEqualTypeOf<Array<number>>();
    }
  });

  it("fails on N > array length", () => {
    const array = ["hello", "world"] as const;
    if (hasAtLeast(array, 3)) {
      expectTypeOf(array).toEqualTypeOf<never>();
    }
  });

  it("works with interesting tuples", () => {
    const array = ["hello", "world", true, 456, 123, "cat"] as [
      "hello",
      string,
      boolean,
      number,
      123,
      ...Array<"cat" | "dog">,
    ];
    if (hasAtLeast(array, 8)) {
      expectTypeOf(array).toEqualTypeOf<
        [
          "hello",
          string,
          boolean,
          number,
          123,
          "cat" | "dog",
          "cat" | "dog",
          "cat" | "dog",
          ...Array<"cat" | "dog">,
        ]
      >();
    }
  });

  it("maintains readonly-ness", () => {
    const array = [] as ReadonlyArray<string>;
    if (hasAtLeast(array, 3)) {
      expectTypeOf(array).toEqualTypeOf<
        readonly [string, string, string, ...Array<string>]
      >();
    }
  });
});
