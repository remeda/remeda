import { pipe } from "./pipe";
import { take } from "./take";

describe("data_first", () => {
  it("take", () => {
    expect(take([1, 2, 3, 4, 3, 2, 1], 3)).toEqual([1, 2, 3]);
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
    const result = take([1, 2, "foo", "bar"] as const, 3);

    expectTypeOf(result).toEqualTypeOf<[1, 2, "foo"]>();
  });
});
