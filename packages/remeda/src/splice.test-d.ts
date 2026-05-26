import { describe, expectTypeOf, test } from "vitest";
import { pipe } from "./pipe";
import { splice } from "./splice";

test("regular array", () => {
  expectTypeOf(splice([] as number[], 0, 0, [9])).toEqualTypeOf<number[]>();
});

test("readonly array", () => {
  expectTypeOf(splice([] as readonly number[], 0, 0, [9])).toEqualTypeOf<
    number[]
  >();
});

test("regular array with union element type", () => {
  expectTypeOf(splice([] as (number | string)[], 0, 0, [9, "a"])).toEqualTypeOf<
    (number | string)[]
  >();
});

test("empty replacement preserves element type", () => {
  expectTypeOf(splice([] as number[], 0, 0, [])).toEqualTypeOf<number[]>();
});

test("prefix tuple", () => {
  expectTypeOf(
    splice([1] as [number, ...boolean[]], 0, 0, [true]),
  ).toEqualTypeOf<(boolean | number)[]>();
});

test("suffix tuple", () => {
  expectTypeOf(
    splice([1] as [...boolean[], number], 0, 0, [true]),
  ).toEqualTypeOf<(boolean | number)[]>();
});

test("prefix + suffix tuple", () => {
  expectTypeOf(
    splice([1, "a"] as [number, ...boolean[], string], 0, 0, [true]),
  ).toEqualTypeOf<(boolean | number | string)[]>();
});

test("const tuple", () => {
  expectTypeOf(splice([1, "a", true] as const, 0, 0, [1])).toEqualTypeOf<
    ("a" | 1 | true)[]
  >();
});

test("union of arrays", () => {
  expectTypeOf(splice([] as boolean[] | string[], 0, 0, [true])).toEqualTypeOf<
    (boolean | string)[]
  >();
});

test("accepts replacement element subtype", () => {
  expectTypeOf(splice([] as (number | string)[], 0, 0, [9])).toEqualTypeOf<
    (number | string)[]
  >();
});

describe("rejects invalid replacement", () => {
  test("element type not in items' element union", () => {
    // @ts-expect-error [ts2322] -- "a" not assignable to number
    splice([] as number[], 0, 0, ["a"]);
  });

  test("supertype replacement element", () => {
    // @ts-expect-error [ts2322] -- string is wider than "a" | "b"
    splice([] as ("a" | "b")[], 0, 0, ["c" as string]);
  });

  test("literal outside const tuple's element union", () => {
    // @ts-expect-error [ts2322] -- 4 not in 1 | "a" | true
    splice([1, "a", true] as const, 0, 0, [4]);
  });
});

test("replacement is optional", () => {
  expectTypeOf(splice([] as number[], 0, 0)).toEqualTypeOf<number[]>();
});

describe("data-last", () => {
  test("regular array", () => {
    expectTypeOf(pipe([] as number[], splice(0, 0, [9]))).toEqualTypeOf<
      number[]
    >();
  });

  test("readonly array", () => {
    expectTypeOf(
      pipe([] as readonly number[], splice(0, 0, [9])),
    ).toEqualTypeOf<number[]>();
  });

  test("regular array with union element type", () => {
    expectTypeOf(
      pipe([] as (number | string)[], splice(0, 0, [9, "a"])),
    ).toEqualTypeOf<(number | string)[]>();
  });

  test("empty replacement preserves element type", () => {
    expectTypeOf(pipe([] as number[], splice(0, 0, []))).toEqualTypeOf<
      number[]
    >();
  });

  test("prefix tuple", () => {
    expectTypeOf(
      pipe([1] as [number, ...boolean[]], splice(0, 0, [true])),
    ).toEqualTypeOf<(boolean | number)[]>();
  });

  test("suffix tuple", () => {
    expectTypeOf(
      pipe([1] as [...boolean[], number], splice(0, 0, [true])),
    ).toEqualTypeOf<(boolean | number)[]>();
  });

  test("prefix + suffix tuple", () => {
    expectTypeOf(
      pipe([1, "a"] as [number, ...boolean[], string], splice(0, 0, [true])),
    ).toEqualTypeOf<(boolean | number | string)[]>();
  });

  test("const tuple", () => {
    expectTypeOf(
      pipe([1, "a", true] as const, splice(0, 0, [1])),
    ).toEqualTypeOf<("a" | 1 | true)[]>();
  });

  test("union of arrays", () => {
    expectTypeOf(
      pipe([] as boolean[] | string[], splice(0, 0, [true])),
    ).toEqualTypeOf<(boolean | string)[]>();
  });

  describe("rejects invalid replacement", () => {
    test("element type not in items' element union", () => {
      // @ts-expect-error [ts2769] -- "a" not assignable to number
      pipe([] as number[], splice(0, 0, ["a"]));
    });

    test("supertype replacement element", () => {
      // @ts-expect-error [ts2769] -- string is wider than "a" | "b"
      pipe([] as ("a" | "b")[], splice(0, 0, ["c" as string]));
    });

    test("literal outside const tuple's element union", () => {
      // @ts-expect-error [ts2769] -- 4 not in 1 | "a" | true
      pipe([1, "a", true] as const, splice(0, 0, [4]));
    });
  });

  test("accepts replacement element subtype", () => {
    expectTypeOf(
      pipe([] as (number | string)[], splice(0, 0, [9])),
    ).toEqualTypeOf<(number | string)[]>();
  });

  // @see https://github.com/remeda/remeda/pull/1358
  test("doesn't infer `never` from an empty `replacement` literal (#1358)", () => {
    expectTypeOf(pipe([] as number[], splice(0, 0, []))).toEqualTypeOf<
      number[]
    >();
  });

  test("replacement is optional", () => {
    expectTypeOf(pipe([] as number[], splice(0, 0))).toEqualTypeOf<number[]>();
  });
});
