import { add } from "./add";
import { fromKeys } from "./fromKeys";
import type { Simplify } from "./type-fest/simplify";

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

type DoubleLetter = `${Letter}${Letter}`;

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
});

describe("typing", () => {
  test("empty array", () => {
    const res = fromKeys([] as const, () => 1);
    // eslint-disable-next-line @typescript-eslint/ban-types
    expectTypeOf(res).toEqualTypeOf<{}>();
  });

  test("fixed tuple", () => {
    const res = fromKeys(["cat", "dog"] as const, () => 1);
    expectTypeOf(res).toEqualTypeOf<Record<"cat" | "dog", number>>();
  });

  describe("with simple keys", () => {
    test("regular array", () => {
      const res = fromKeys([] as Array<string>, () => 1);
      expectTypeOf(res).toEqualTypeOf<Partial<Record<string, number>>>();
    });

    test("non-empty array", () => {
      const res = fromKeys(["cat"] as [string, ...Array<string>], () => 1);
      expectTypeOf(res).toEqualTypeOf<Record<string, number>>();
    });

    test("fixed tuple", () => {
      const res = fromKeys(["cat", "dog"] as [string, string], () => 1);
      expectTypeOf(res).toEqualTypeOf<Record<string, number>>();
    });
  });

  describe("with literal union keys", () => {
    test("regular array", () => {
      const res = fromKeys([] as Array<"cat" | "dog">, () => 1);
      expectTypeOf(res).toEqualTypeOf<Partial<Record<"cat" | "dog", number>>>();
    });

    test("non-empty array", () => {
      const res = fromKeys(
        ["cat"] as ["cat" | "dog", ...Array<"mouse" | "pig">],
        () => 1,
      );
      expectTypeOf(res).toEqualTypeOf<
        Simplify<
          Partial<Record<"mouse" | "pig", number>> &
            ({ cat: number } | { dog: number })
        >
      >();
    });

    test("fixed tuple", () => {
      const res = fromKeys(
        ["cat", "mouse"] as ["cat" | "dog", "mouse" | "pig"],
        () => 1,
      );
      expectTypeOf(res).toEqualTypeOf<
        Simplify<
          ({ cat: number } | { dog: number }) &
            ({ mouse: number } | { pig: number })
        >
      >();
    });
  });

  describe("with string template keys", () => {
    test("regular array", () => {
      const res = fromKeys([] as Array<`prefix_${number}`>, () => 1);
      expectTypeOf(res).toEqualTypeOf<
        Partial<Record<`prefix_${number}`, number>>
      >();
    });

    test("non-empty array", () => {
      const res = fromKeys(
        ["prefix_1"] as [`prefix_${number}`, ...Array<`prefix_${number}`>],
        () => 1,
      );
      expectTypeOf(res).toEqualTypeOf<Record<`prefix_${number}`, number>>();
    });

    test("fixed tuple", () => {
      const res = fromKeys(
        ["prefix_1", "2_suffix"] as [`prefix_${number}`, `${number}_suffix`],
        () => 1,
      );
      expectTypeOf(res).toEqualTypeOf<
        Record<`${number}_suffix` | `prefix_${number}`, number>
      >();
    });
  });

  test("typescript doesn't choke on huge literal unions", () => {
    const res = fromKeys([] as Array<DoubleLetter>, () => 1);
    expectTypeOf(res).toEqualTypeOf<Partial<Record<DoubleLetter, number>>>();
  });
});
