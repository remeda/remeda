import { splice } from "./splice";

describe("arrays", () => {
  it("reflects the type of `items` in the return value", () => {
    expectTypeOf(splice([] as Array<number>, 0, 0, [])).toEqualTypeOf<
      Array<number>
    >();
  });

  it("reflects the type of `replacement` in the return value", () => {
    expectTypeOf(splice([], 0, 0, [] as Array<number>)).toEqualTypeOf<
      Array<number>
    >();
  });

  it("reflects both `items` and `replacement` in the output type", () => {
    expectTypeOf(
      splice([] as Array<number>, 0, 0, [] as Array<string>),
    ).toEqualTypeOf<Array<number | string>>();
  });
});

describe("fixed tuples", () => {
  describe("deleteCount = 0", () => {
    it("works with start + length < 0", () => {
      expectTypeOf(
        splice([1, 2, 3] as const, -4, 0, [4, 5] as const),
      ).toEqualTypeOf<[4, 5, 1, 2, 3]>();
    });

    it("works with start < 0", () => {
      expectTypeOf(
        splice([1, 2, 3] as const, -1, 0, [4, 5] as const),
      ).toEqualTypeOf<[1, 2, 4, 5, 3]>();
    });

    it("works with start = 0", () => {
      expectTypeOf(
        splice([1, 2, 3] as const, 0, 0, [4, 5] as const),
      ).toEqualTypeOf<[4, 5, 1, 2, 3]>();
    });

    it("works with start > 0", () => {
      expectTypeOf(
        splice([1, 2, 3] as const, 1, 0, [4, 5] as const),
      ).toEqualTypeOf<[1, 4, 5, 2, 3]>();
    });

    it("works with start = length", () => {
      expectTypeOf(
        splice([1, 2, 3] as const, 3, 0, [4, 5] as const),
      ).toEqualTypeOf<[1, 2, 3, 4, 5]>();
    });

    it("works with start > length", () => {
      expectTypeOf(
        splice([1, 2, 3] as const, 6, 0, [4, 5] as const),
      ).toEqualTypeOf<[1, 2, 3, 4, 5]>();
    });
  });

  describe("deleteCount != 0", () => {
    it("works with deleteCount < 0", () => {
      expectTypeOf(
        splice([1, 2, 3] as const, 1, -1, [4, 5] as const),
      ).toEqualTypeOf<[1, 4, 5, 2, 3]>();
    });

    it("works with deleteCount + start < length", () => {
      expectTypeOf(
        splice([1, 2, 3] as const, 1, 2, [4, 5] as const),
      ).toEqualTypeOf<[1, 4, 5]>();
    });

    it("works with deleteCount + start > length", () => {
      expectTypeOf(
        splice([1, 2, 3] as const, 1, 4, [4, 5] as const),
      ).toEqualTypeOf<[1, 4, 5]>();
    });
  });

  it("works with empty replacement", () => {
    expectTypeOf(splice([1, 2, 3] as const, 1, 1, [] as const)).toEqualTypeOf<
      [1, 3]
    >();
  });

  it("works with bigger replacement", () => {
    expectTypeOf(
      splice([1, 2, 3] as const, 1, 1, [4, 5, 6, 7, 8, 9] as const),
    ).toEqualTypeOf<[1, 4, 5, 6, 7, 8, 9, 3]>();
  });

  describe("non-single-literal params", () => {
    it("works as number", () => {
      expectTypeOf(
        splice([1, 2, 3] as const, 1 as number, 1 as number, [4] as const),
      ).toEqualTypeOf<Array<1 | 2 | 3 | 4>>();
    });

    it("works with deleteCount", () => {
      expectTypeOf(
        splice([1, 2, 3] as const, 1, 1 as 1 | 2, [4] as const),
      ).toEqualTypeOf<[1, 4, 3] | [1, 4]>();
    });

    it("works with start", () => {
      expectTypeOf(
        splice([1, 2, 3] as const, 1 as 1 | 2, 1, [4] as const),
      ).toEqualTypeOf<[1, 4, 3] | [1, 2, 4]>();
    });

    it("works with start and deleteCount", () => {
      expectTypeOf(
        splice([1, 2, 3] as const, 1 as 1 | 2, 1 as 1 | 2, [4] as const),
      ).toEqualTypeOf<[1, 4, 3] | [1, 4] | [1, 2, 4]>();
    });
  });
});

describe("variable-length tuples", () => {
  const DATA = [1, 2, false, "a", "b"] as [
    number,
    number,
    ...Array<boolean>,
    string,
    string,
  ];

  it("works on prefix", () => {
    expectTypeOf(splice(DATA, 1, 1, [] as const)).toEqualTypeOf<
      [number, ...Array<boolean>, string, string]
    >();
  });

  it("works on suffix", () => {
    expectTypeOf(splice(DATA, -2, 1, [] as const)).toEqualTypeOf<
      [number, number, ...Array<boolean>, string]
    >();
  });

  describe("splices within rest", () => {
    // These types are correct, but they could be better; see comments.

    it("works within rest", () => {
      expectTypeOf(splice(DATA, 2, 1, [] as const)).toEqualTypeOf<
        Array<boolean | number | string>
        // Better type:
        // | [number, number, ...Array<boolean>, string, string]
        // | [number, number, ...Array<boolean>, string]
      >();
    });

    it("works within prefix + rest", () => {
      expectTypeOf(splice(DATA, 1, 2, [] as const)).toEqualTypeOf<
        Array<boolean | number | string>
        // Better type:
        // | [number, ...Array<boolean>, string, string]
        // | [number, ...Array<boolean>, string]
      >();
    });

    it("works within rest + suffix", () => {
      expectTypeOf(splice(DATA, 2, 2, [] as const)).toEqualTypeOf<
        Array<boolean | number | string>
        // Better type:
        // | [number, number, ...Array<boolean>, string, string]
        // | [number, number, ...Array<boolean>, string]
        // | [number, number, ...Array<boolean>]
      >();
    });
  });
});
