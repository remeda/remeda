import type { Simplify } from "type-fest";
import { add } from "./add";
import { constant } from "./constant";
import { fromKeys } from "./fromKeys";
import { pipe } from "./pipe";

type Letter =
  | "a"
  | "b"
  | "c"
  | "d"
  | "e"
  | "f"
  | "g"
  | "h"
  | "i"
  | "j"
  | "k"
  | "l"
  | "m"
  | "n"
  | "o"
  | "p"
  | "q"
  | "r"
  | "s"
  | "t"
  | "u"
  | "v"
  | "w"
  | "x"
  | "y"
  | "z";

describe("runtime", () => {
  it("works on trivially empty arrays", () => {
    expect(fromKeys([] as Array<string>, (item) => `${item}_`)).toEqual({});
  });

  it("works on regular arrays", () => {
    expect(fromKeys(["a"], (item) => `${item}_`)).toEqual({ a: "a_" });
  });

  it("works with duplicates", () => {
    expect(fromKeys(["a", "a"], (item) => `${item}_`)).toEqual({ a: "a_" });
  });

  it("uses the last value", () => {
    let counter = 0;
    expect(
      fromKeys(["a", "a"], () => {
        counter += 1;
        return counter;
      }),
    ).toEqual({ a: 2 });
  });

  it("works with number keys", () => {
    expect(fromKeys([123], add(1))).toEqual({ 123: 124 });
  });

  it("works with symbols", () => {
    const symbol = Symbol("a");
    expect(fromKeys([symbol], () => 1)).toEqual({ [symbol]: 1 });
  });

  it("works with a mix of key types", () => {
    const symbol = Symbol("a");
    expect(fromKeys(["a", 123, symbol], (item) => typeof item)).toEqual({
      a: "string",
      123: "number",
      [symbol]: "symbol",
    });
  });

  describe("dataLast", () => {
    it("works on trivially empty arrays", () => {
      expect(
        pipe(
          [] as Array<string>,
          fromKeys((item) => `${item}_`),
        ),
      ).toEqual({});
    });

    it("works on regular arrays", () => {
      expect(
        pipe(
          ["a"],
          fromKeys((item) => `${item}_`),
        ),
      ).toEqual({ a: "a_" });
    });

    it("works with duplicates", () => {
      expect(
        pipe(
          ["a", "a"],
          fromKeys((item) => `${item}_`),
        ),
      ).toEqual({ a: "a_" });
    });

    it("uses the last value", () => {
      let counter = 0;
      expect(
        pipe(
          ["a", "a"],
          fromKeys(() => {
            counter += 1;
            return counter;
          }),
        ),
      ).toEqual({ a: 2 });
    });

    it("works with number keys", () => {
      expect(pipe([123], fromKeys(add(1)))).toEqual({ 123: 124 });
    });

    it("works with symbols", () => {
      const symbol = Symbol("a");
      expect(
        pipe(
          [symbol],
          fromKeys(() => 1),
        ),
      ).toEqual({ [symbol]: 1 });
    });

    it("works with a mix of key types", () => {
      const symbol = Symbol("a");
      expect(
        pipe(
          ["a", 123, symbol],
          fromKeys((item) => typeof item),
        ),
      ).toEqual({
        a: "string",
        123: "number",
        [symbol]: "symbol",
      });
    });
  });
});

describe("typing", () => {
  test("empty array", () => {
    const data = [] as const;

    const dataFirst = fromKeys(data, constant(1));
    // eslint-disable-next-line @typescript-eslint/ban-types -- That's just what we return
    expectTypeOf(dataFirst).toEqualTypeOf<{}>();

    const dataLast = pipe(data, fromKeys(constant(1)));
    // eslint-disable-next-line @typescript-eslint/ban-types -- That's just what we return
    expectTypeOf(dataLast).toEqualTypeOf<{}>();
  });

  test("fixed tuple", () => {
    const data = ["cat", "dog"] as const;

    const dataFirst = fromKeys(data, constant(1));
    expectTypeOf(dataFirst).toEqualTypeOf<Record<"cat" | "dog", number>>();

    const dataLast = pipe(data, fromKeys(constant(1)));
    expectTypeOf(dataLast).toEqualTypeOf<Record<"cat" | "dog", number>>();
  });

  describe("with simple keys", () => {
    test("regular array", () => {
      const data = [] as Array<string>;

      const dataFirst = fromKeys(data, constant(1));
      expectTypeOf(dataFirst).toEqualTypeOf<Record<string, number>>();

      const dataLast = pipe(data, fromKeys(constant(1)));
      expectTypeOf(dataLast).toEqualTypeOf<Record<string, number>>();
    });

    test("non-empty array", () => {
      const data = ["cat"] as [string, ...Array<string>];

      const dataFirst = fromKeys(data, constant(1));
      expectTypeOf(dataFirst).toEqualTypeOf<Record<string, number>>();

      const dataLast = pipe(data, fromKeys(constant(1)));
      expectTypeOf(dataLast).toEqualTypeOf<Record<string, number>>();
    });

    test("fixed tuple", () => {
      const data = ["cat", "dog"] as [string, string];

      const dataFirst = fromKeys(data, constant(1));
      expectTypeOf(dataFirst).toEqualTypeOf<Record<string, number>>();

      const dataLast = pipe(data, fromKeys(constant(1)));
      expectTypeOf(dataLast).toEqualTypeOf<Record<string, number>>();
    });
  });

  describe("with literal union keys", () => {
    test("regular array", () => {
      const data = [] as Array<"cat" | "dog">;

      const dataFirst = fromKeys(data, constant(1));
      expectTypeOf(dataFirst).toEqualTypeOf<
        Partial<Record<"cat" | "dog", number>>
      >();

      const dataLast = pipe(data, fromKeys(constant(1)));
      expectTypeOf(dataLast).toEqualTypeOf<
        Partial<Record<"cat" | "dog", number>>
      >();
    });

    test("non-empty array", () => {
      const data = ["cat"] as ["cat" | "dog", ...Array<"mouse" | "pig">];

      const dataFirst = fromKeys(data, constant(1));
      expectTypeOf(dataFirst).toEqualTypeOf<
        Simplify<
          Partial<Record<"mouse" | "pig", number>> &
            ({ cat: number } | { dog: number })
        >
      >();

      const dataLast = pipe(data, fromKeys(constant(1)));
      expectTypeOf(dataLast).toEqualTypeOf<
        Simplify<
          Partial<Record<"mouse" | "pig", number>> &
            ({ cat: number } | { dog: number })
        >
      >();
    });

    test("fixed tuple", () => {
      const data = ["cat", "mouse"] as ["cat" | "dog", "mouse" | "pig"];

      const dataFirst = fromKeys(data, constant(1));
      expectTypeOf(dataFirst).toEqualTypeOf<
        Simplify<
          ({ cat: number } | { dog: number }) &
            ({ mouse: number } | { pig: number })
        >
      >();

      const dataLast = pipe(data, fromKeys(constant(1)));
      expectTypeOf(dataLast).toEqualTypeOf<
        Simplify<
          ({ cat: number } | { dog: number }) &
            ({ mouse: number } | { pig: number })
        >
      >();
    });
  });

  describe("with string template keys", () => {
    test("regular array", () => {
      const data = [] as Array<`prefix_${number}`>;

      const dataFirst = fromKeys(data, constant(1));
      expectTypeOf(dataFirst).toEqualTypeOf<
        Record<`prefix_${number}`, number>
      >();

      const dataLast = pipe(data, fromKeys(constant(1)));
      expectTypeOf(dataLast).toEqualTypeOf<
        Record<`prefix_${number}`, number>
      >();
    });

    test("non-empty array", () => {
      const data = ["prefix_1"] as [
        `prefix_${number}`,
        ...Array<`prefix_${number}`>,
      ];

      const dataFirst = fromKeys(data, constant(1));
      expectTypeOf(dataFirst).toEqualTypeOf<
        Record<`prefix_${number}`, number>
      >();

      const dataLast = pipe(data, fromKeys(constant(1)));
      expectTypeOf(dataLast).toEqualTypeOf<
        Record<`prefix_${number}`, number>
      >();
    });

    test("fixed tuple", () => {
      const data = ["prefix_1", "2_suffix"] as [
        `prefix_${number}`,
        `${number}_suffix`,
      ];

      const dataFirst = fromKeys(data, constant(1));
      expectTypeOf(dataFirst).toEqualTypeOf<
        Record<`${number}_suffix` | `prefix_${number}`, number>
      >();

      const dataLast = pipe(data, fromKeys(constant(1)));
      expectTypeOf(dataLast).toEqualTypeOf<
        Record<`${number}_suffix` | `prefix_${number}`, number>
      >();
    });

    describe("number keys", () => {
      test("regular array", () => {
        const data = [] as Array<number>;

        const dataFirst = fromKeys(data, constant(1));
        expectTypeOf(dataFirst).toEqualTypeOf<Record<number, number>>();

        const dataLast = pipe(data, fromKeys(constant(1)));
        expectTypeOf(dataLast).toEqualTypeOf<Record<number, number>>();
      });

      test("non-empty array", () => {
        const data = [1] as [number, ...Array<number>];

        const dataFirst = fromKeys(data, constant(1));
        expectTypeOf(dataFirst).toEqualTypeOf<Record<number, number>>();

        const dataLast = pipe(data, fromKeys(constant(1)));
        expectTypeOf(dataLast).toEqualTypeOf<Record<number, number>>();
      });

      test("fixed tuple", () => {
        const data = [1, 2] as [number, number];

        const dataFirst = fromKeys(data, constant(1));
        expectTypeOf(dataFirst).toEqualTypeOf<Record<number, number>>();

        const dataLast = pipe(data, fromKeys(constant(1)));
        expectTypeOf(dataLast).toEqualTypeOf<Record<number, number>>();
      });

      test("literals", () => {
        const data = [1, 2, 3] as const;

        const dataFirst = fromKeys(data, constant(1));
        expectTypeOf(dataFirst).toEqualTypeOf<Record<1 | 2 | 3, number>>();

        const dataLast = pipe(data, fromKeys(constant(1)));
        expectTypeOf(dataLast).toEqualTypeOf<Record<1 | 2 | 3, number>>();
      });
    });
  });

  test("typescript doesn't choke on huge literal unions", () => {
    const data = [] as Array<`${Letter}${Letter}`>;

    const dataFirst = fromKeys(data, constant(1));
    expectTypeOf(dataFirst).toEqualTypeOf<
      Partial<Record<`${Letter}${Letter}`, number>>
    >();

    const dataLast = pipe(data, fromKeys(constant(1)));
    expectTypeOf(dataLast).toEqualTypeOf<
      Partial<Record<`${Letter}${Letter}`, number>>
    >();
  });
});
