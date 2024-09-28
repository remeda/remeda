import { add } from "./add";
import { constant } from "./constant";
import { map } from "./map";

it("number array", () => {
  const result = map([1, 2, 3] as Array<number>, add(1));
  expectTypeOf(result).toEqualTypeOf<Array<number>>();
});

it("readonly number array", () => {
  const result = map([1, 2, 3] as ReadonlyArray<number>, add(1));
  expectTypeOf(result).toEqualTypeOf<Array<number>>();
});

it("number 3-tuple", () => {
  const result = map([1, 2, 3] as [number, number, number], add(1));
  expectTypeOf(result).toEqualTypeOf<[number, number, number]>();
});

it("readonly number 3-tuple", () => {
  const result = map([1, 2, 3] as readonly [number, number, number], add(1));
  expectTypeOf(result).toEqualTypeOf<[number, number, number]>();
});

it("named number 3-tuple", () => {
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

it("mixed type tuple", () => {
  const result = map([1, "2", true] as [number, string, boolean], constant(1));
  expectTypeOf(result).toEqualTypeOf<[number, number, number]>();
});

it("readonly mixed type tuple", () => {
  const result = map(
    [1, "2", true] as readonly [number, string, boolean],
    constant(1),
  );
  expectTypeOf(result).toEqualTypeOf<[number, number, number]>();
});

it("nonempty (tail) number array", () => {
  const result = map([1, 2, 3] as [number, ...Array<number>], add(1));
  expectTypeOf(result).toEqualTypeOf<[number, ...Array<number>]>();
});

it("nonempty (tail) readonly number array", () => {
  const result = map([1, 2, 3] as readonly [number, ...Array<number>], add(1));
  expectTypeOf(result).toEqualTypeOf<[number, ...Array<number>]>();
});

it("nonempty (head) number array", () => {
  const result = map([1, 2, 3] as [...Array<number>, number], add(1));
  expectTypeOf(result).toEqualTypeOf<[...Array<number>, number]>();
});

it("nonempty readonly (head) number array", () => {
  const result = map([1, 2, 3] as readonly [...Array<number>, number], add(1));
  expectTypeOf(result).toEqualTypeOf<[...Array<number>, number]>();
});

describe("indexed", () => {
  it("number array", () => {
    const result = map([1, 2, 3] as Array<number>, (x, index) => x + index);
    expectTypeOf(result).toEqualTypeOf<Array<number>>();
  });

  it("readonly number array", () => {
    const result = map(
      [1, 2, 3] as ReadonlyArray<number>,
      (x, index) => x + index,
    );
    expectTypeOf(result).toEqualTypeOf<Array<number>>();
  });

  it("number 3-tuple", () => {
    const result = map(
      [1, 2, 3] as [number, number, number],
      (x, index) => x + index,
    );
    expectTypeOf(result).toEqualTypeOf<[number, number, number]>();
  });

  it("readonly number 3-tuple", () => {
    const result = map(
      [1, 2, 3] as readonly [number, number, number],
      (x, index) => x + index,
    );
    expectTypeOf(result).toEqualTypeOf<[number, number, number]>();
  });

  it("named number 3-tuple", () => {
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

  it("mixed type tuple", () => {
    const result = map(
      [1, "2", true] as [number, string, boolean],
      (_, index) => index,
    );
    expectTypeOf(result).toEqualTypeOf<[number, number, number]>();
  });

  it("readonly mixed type tuple", () => {
    const result = map(
      [1, "2", true] as readonly [number, string, boolean],
      (_, index) => index,
    );
    expectTypeOf(result).toEqualTypeOf<[number, number, number]>();
  });

  it("nonempty (tail) number array", () => {
    const result = map(
      [1, 2, 3] as [number, ...Array<number>],
      (x, index) => x + index,
    );
    expectTypeOf(result).toEqualTypeOf<[number, ...Array<number>]>();
  });

  it("nonempty (tail) readonly number array", () => {
    const result = map(
      [1, 2, 3] as readonly [number, ...Array<number>],
      (x, index) => x + index,
    );
    expectTypeOf(result).toEqualTypeOf<[number, ...Array<number>]>();
  });

  it("nonempty (head) number array", () => {
    const result = map(
      [1, 2, 3] as [...Array<number>, number],
      (x, index) => x + index,
    );
    expectTypeOf(result).toEqualTypeOf<[...Array<number>, number]>();
  });

  it("nonempty readonly (head) number array", () => {
    const result = map(
      [1, 2, 3] as readonly [...Array<number>, number],
      (x, index) => x + index,
    );
    expectTypeOf(result).toEqualTypeOf<[...Array<number>, number]>();
  });
});
