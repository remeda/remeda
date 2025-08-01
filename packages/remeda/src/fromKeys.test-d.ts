import { describe, expectTypeOf, test } from "vitest";
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

test("empty array", () => {
  const data = [] as const;

  const dataFirst = fromKeys(data, constant(1));

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type -- That's just what we return
  expectTypeOf(dataFirst).toEqualTypeOf<{}>();

  const dataLast = pipe(data, fromKeys(constant(1)));

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type -- That's just what we return
  expectTypeOf(dataLast).toEqualTypeOf<{}>();
});

test("fixed tuple", () => {
  const data = ["cat", "dog"] as const;

  expectTypeOf(fromKeys(data, constant(1))).toEqualTypeOf<{ cat: 1; dog: 1 }>();
  expectTypeOf(pipe(data, fromKeys(constant(1)))).toEqualTypeOf<{
    cat: 1;
    dog: 1;
  }>();
});

describe("with simple keys", () => {
  test("regular array", () => {
    const data = [] as Array<string>;

    expectTypeOf(fromKeys(data, constant(1))).toEqualTypeOf<
      Record<string, 1>
    >();
    expectTypeOf(pipe(data, fromKeys(constant(1)))).toEqualTypeOf<
      Record<string, 1>
    >();
  });

  test("non-empty array", () => {
    const data = ["cat"] as [string, ...Array<string>];

    expectTypeOf(fromKeys(data, constant(1))).toEqualTypeOf<
      Record<string, 1>
    >();
    expectTypeOf(pipe(data, fromKeys(constant(1)))).toEqualTypeOf<
      Record<string, 1>
    >();
  });

  test("fixed tuple", () => {
    const data = ["cat", "dog"] as [string, string];

    expectTypeOf(fromKeys(data, constant(1))).toEqualTypeOf<
      Record<string, 1>
    >();
    expectTypeOf(pipe(data, fromKeys(constant(1)))).toEqualTypeOf<
      Record<string, 1>
    >();
  });
});

describe("with literal union keys", () => {
  test("regular array", () => {
    const data = [] as Array<"cat" | "dog">;

    expectTypeOf(fromKeys(data, constant(1))).toEqualTypeOf<{
      cat?: 1;
      dog?: 1;
    }>();
    expectTypeOf(pipe(data, fromKeys(constant(1)))).toEqualTypeOf<{
      cat?: 1;
      dog?: 1;
    }>();
  });

  test("non-empty array", () => {
    const data = ["cat"] as ["cat" | "dog", ...Array<"mouse" | "pig">];

    expectTypeOf(fromKeys(data, constant(1))).toEqualTypeOf<
      { cat: 1; mouse?: 1; pig?: 1 } | { dog: 1; mouse?: 1; pig?: 1 }
    >();
    expectTypeOf(pipe(data, fromKeys(constant(1)))).toEqualTypeOf<
      { cat: 1; mouse?: 1; pig?: 1 } | { dog: 1; mouse?: 1; pig?: 1 }
    >();
  });

  test("fixed tuple", () => {
    const data = ["cat", "mouse"] as ["cat" | "dog", "mouse" | "pig"];

    expectTypeOf(fromKeys(data, constant(1))).toEqualTypeOf<
      | { cat: 1; mouse: 1 }
      | { cat: 1; pig: 1 }
      | { dog: 1; mouse: 1 }
      | { dog: 1; pig: 1 }
    >();
    expectTypeOf(pipe(data, fromKeys(constant(1)))).toEqualTypeOf<
      | { cat: 1; mouse: 1 }
      | { cat: 1; pig: 1 }
      | { dog: 1; mouse: 1 }
      | { dog: 1; pig: 1 }
    >();
  });
});

describe("with string template keys", () => {
  test("regular array", () => {
    const data = [] as Array<`prefix_${number}`>;

    expectTypeOf(fromKeys(data, constant(1))).toEqualTypeOf<
      Record<`prefix_${number}`, 1>
    >();
    expectTypeOf(pipe(data, fromKeys(constant(1)))).toEqualTypeOf<
      Record<`prefix_${number}`, 1>
    >();
  });

  test("non-empty array", () => {
    const data = ["prefix_1"] as [
      `prefix_${number}`,
      ...Array<`prefix_${number}`>,
    ];

    expectTypeOf(fromKeys(data, constant(1))).toEqualTypeOf<
      Record<`prefix_${number}`, 1>
    >();
    expectTypeOf(pipe(data, fromKeys(constant(1)))).toEqualTypeOf<
      Record<`prefix_${number}`, 1>
    >();
  });

  test("fixed tuple", () => {
    const data = ["prefix_1", "2_suffix"] as [
      `prefix_${number}`,
      `${number}_suffix`,
    ];

    expectTypeOf(fromKeys(data, constant(1))).toEqualTypeOf<
      Record<`${number}_suffix` | `prefix_${number}`, 1>
    >();
    expectTypeOf(pipe(data, fromKeys(constant(1)))).toEqualTypeOf<
      Record<`${number}_suffix` | `prefix_${number}`, 1>
    >();
  });

  describe("number keys", () => {
    test("regular array", () => {
      const data = [] as Array<number>;

      expectTypeOf(fromKeys(data, constant(1))).toEqualTypeOf<
        Record<number, 1>
      >();
      expectTypeOf(pipe(data, fromKeys(constant(1)))).toEqualTypeOf<
        Record<number, 1>
      >();
    });

    test("non-empty array", () => {
      const data = [1] as [number, ...Array<number>];

      expectTypeOf(fromKeys(data, constant(1))).toEqualTypeOf<
        Record<number, 1>
      >();
      expectTypeOf(pipe(data, fromKeys(constant(1)))).toEqualTypeOf<
        Record<number, 1>
      >();
    });

    test("fixed tuple", () => {
      const data = [1, 2] as [number, number];

      expectTypeOf(fromKeys(data, constant(1))).toEqualTypeOf<
        Record<number, 1>
      >();
      expectTypeOf(pipe(data, fromKeys(constant(1)))).toEqualTypeOf<
        Record<number, 1>
      >();
    });

    test("literals", () => {
      const data = [1, 2, 3] as const;

      expectTypeOf(fromKeys(data, constant("a"))).toEqualTypeOf<{
        1: "a";
        2: "a";
        3: "a";
      }>();
      expectTypeOf(pipe(data, fromKeys(constant("a")))).toEqualTypeOf<{
        1: "a";
        2: "a";
        3: "a";
      }>();
    });
  });
});

test("typescript doesn't choke on huge literal unions", () => {
  const data = [] as Array<`${Letter}${Letter}`>;

  expectTypeOf(fromKeys(data, constant(1))).toEqualTypeOf<
    Partial<Record<`${Letter}${Letter}`, 1>>
  >();
  expectTypeOf(pipe(data, fromKeys(constant(1)))).toEqualTypeOf<
    Partial<Record<`${Letter}${Letter}`, 1>>
  >();
});
