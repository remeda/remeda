import { pipe } from "./pipe";
import { take } from "./take";

describe("data_first", () => {
  it("take", () => {
    expect(take([1, 2, 3, 4, 3, 2, 1], 3)).toEqual([1, 2, 3]);
  });

  it("returns the whole array if N is greater than length", () => {
    expect(take([1, 2, 3] as const, 10)).toEqual([1, 2, 3]);
  });

  it("returns an empty array if N is negative", () => {
    expect(take([1, 2, 3] as const, -1)).toEqual([]);
  });
});

describe("data_last", () => {
  it("take", () => {
    expect(take(3)([1, 2, 3, 4, 3, 2, 1])).toEqual([1, 2, 3]);
  });

  it("lazy evaluation of trivial n=1", () => {
    expect(pipe([1, 2, 3, 4, 3, 2, 1], take(0))).toEqual([]);
  });
});

describe("typings", () => {
  it("infers tuple types properly", () => {
    const valid = take([1, 2, "foo", "bar"] as const, 3);
    expectTypeOf(valid).toEqualTypeOf<[1, 2, "foo"]>();

    const negative = take([1, 2, 3] as const, -1);
    expectTypeOf(negative).toEqualTypeOf<[]>();

    const greater = take([1, 2, 3] as const, 10);
    expectTypeOf(greater).toEqualTypeOf<[1, 2, 3]>();

    const unknown = take([1, 2, 3], 2);
    expectTypeOf(unknown).toEqualTypeOf<Array<number>>();
  });

  it("infers types in pipe", () => {
    const input = [1, 2, 3, 4] as const;
    const result = pipe(input, take(2));

    expectTypeOf(result).toEqualTypeOf<[1, 2]>();
  });
});
