import { describe, expectTypeOf, test } from "vitest";
import { add } from "./add";
import { constant } from "./constant";
import { map } from "./map";

test("number array", () => {
  const result = map([1, 2, 3] as number[], add(1));

  expectTypeOf(result).toEqualTypeOf<number[]>();
});

test("readonly number array", () => {
  const result = map([1, 2, 3] as readonly number[], add(1));

  expectTypeOf(result).toEqualTypeOf<number[]>();
});

test("number 3-tuple", () => {
  const result = map([1, 2, 3] as [number, number, number], add(1));

  expectTypeOf(result).toEqualTypeOf<[number, number, number]>();
});

test("readonly number 3-tuple", () => {
  const result = map([1, 2, 3] as readonly [number, number, number], add(1));

  expectTypeOf(result).toEqualTypeOf<[number, number, number]>();
});

test("named number 3-tuple", () => {
  const result = map(
    [1, 2, 3] as [item1: number, item2: number, item3: number],
    add(1),
  );

  // There's no way to test this, but notice that the names are copied to the
  // output here...
  expectTypeOf(result).toEqualTypeOf<
    [item1: number, item2: number, item3: number]
  >();
});

test("mixed type tuple", () => {
  expectTypeOf(
    map([1, "2", true] as [number, string, boolean], constant(1)),
  ).toEqualTypeOf<[1, 1, 1]>();
});

test("readonly mixed type tuple", () => {
  expectTypeOf(
    map([1, "2", true] as readonly [number, string, boolean], constant(1)),
  ).toEqualTypeOf<[1, 1, 1]>();
});

test("nonempty (tail) number array", () => {
  const result = map([1, 2, 3] as [number, ...number[]], add(1));

  expectTypeOf(result).toEqualTypeOf<[number, ...number[]]>();
});

test("nonempty (tail) readonly number array", () => {
  const result = map([1, 2, 3] as readonly [number, ...number[]], add(1));

  expectTypeOf(result).toEqualTypeOf<[number, ...number[]]>();
});

test("nonempty (head) number array", () => {
  const result = map([1, 2, 3] as [...number[], number], add(1));

  expectTypeOf(result).toEqualTypeOf<[...number[], number]>();
});

test("nonempty readonly (head) number array", () => {
  const result = map([1, 2, 3] as readonly [...number[], number], add(1));

  expectTypeOf(result).toEqualTypeOf<[...number[], number]>();
});

describe("indexed", () => {
  test("number array", () => {
    const result = map([1, 2, 3] as number[], (x, index) => x + index);

    expectTypeOf(result).toEqualTypeOf<number[]>();
  });

  test("readonly number array", () => {
    const result = map([1, 2, 3] as readonly number[], (x, index) => x + index);

    expectTypeOf(result).toEqualTypeOf<number[]>();
  });

  test("number 3-tuple", () => {
    const result = map(
      [1, 2, 3] as [number, number, number],
      (x, index) => x + index,
    );

    expectTypeOf(result).toEqualTypeOf<[number, number, number]>();
  });

  test("readonly number 3-tuple", () => {
    const result = map(
      [1, 2, 3] as readonly [number, number, number],
      (x, index) => x + index,
    );

    expectTypeOf(result).toEqualTypeOf<[number, number, number]>();
  });

  test("named number 3-tuple", () => {
    const result = map(
      [1, 2, 3] as [item1: number, item2: number, item3: number],
      (x, index) => x + index,
    );

    // There's no way to test this, but notice that the names are copied to the
    // output here...
    expectTypeOf(result).toEqualTypeOf<
      [item1: number, item2: number, item3: number]
    >();
  });

  test("mixed type tuple", () => {
    const result = map(
      [1, "2", true] as [number, string, boolean],
      (_, index) => index,
    );

    expectTypeOf(result).toEqualTypeOf<[number, number, number]>();
  });

  test("readonly mixed type tuple", () => {
    const result = map(
      [1, "2", true] as readonly [number, string, boolean],
      (_, index) => index,
    );

    expectTypeOf(result).toEqualTypeOf<[number, number, number]>();
  });

  test("nonempty (tail) number array", () => {
    const result = map(
      [1, 2, 3] as [number, ...number[]],
      (x, index) => x + index,
    );

    expectTypeOf(result).toEqualTypeOf<[number, ...number[]]>();
  });

  test("nonempty (tail) readonly number array", () => {
    const result = map(
      [1, 2, 3] as readonly [number, ...number[]],
      (x, index) => x + index,
    );

    expectTypeOf(result).toEqualTypeOf<[number, ...number[]]>();
  });

  test("nonempty (head) number array", () => {
    const result = map(
      [1, 2, 3] as [...number[], number],
      (x, index) => x + index,
    );

    expectTypeOf(result).toEqualTypeOf<[...number[], number]>();
  });

  test("nonempty readonly (head) number array", () => {
    const result = map(
      [1, 2, 3] as readonly [...number[], number],
      (x, index) => x + index,
    );

    expectTypeOf(result).toEqualTypeOf<[...number[], number]>();
  });
});
