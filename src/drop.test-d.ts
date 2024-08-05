import { drop } from "./drop";
import { pipe } from "./pipe";

describe("data first", () => {
  it("works on regular inputs", () => {
    expectTypeOf(drop([1, 2, 3, 4, 5], 2)).toEqualTypeOf<
      [number, number, number]
    >();
  });

  it("works on empty arrays", () => {
    expectTypeOf(drop([], 2)).toEqualTypeOf<[]>();
  });

  it("works with negative numbers", () => {
    expectTypeOf(drop([1, 2, 3], -1)).toEqualTypeOf<[number, number, number]>();
  });

  it("works when dropping more than the length of the array", () => {
    expectTypeOf(drop([1, 2, 3, 4, 5], 10)).toEqualTypeOf<[]>();
  });

  it("works with generalized typed arrays", () => {
    expectTypeOf(drop([] as Array<number | string>, 2)).toEqualTypeOf<
      Array<number | string>
    >();
  });

  it("works with generalized typed count", () => {
    expectTypeOf(drop([1, "2", true], 2 as number)).toEqualTypeOf<
      Array<boolean | number | string>
    >();
  });
});

describe("data last", () => {
  it("works on regular inputs", () => {
    expectTypeOf(pipe([1, 2, 3, 4, 5], drop(2))).toEqualTypeOf<Array<number>>();
  });

  it("works on empty arrays", () => {
    expectTypeOf(pipe([] as Array<string>, drop(2))).toEqualTypeOf<
      Array<string>
    >();
  });

  it("works with negative numbers", () => {
    expectTypeOf(pipe([1, 2, 3, 4, 5], drop(-1))).toEqualTypeOf<
      Array<number>
    >();
  });

  it("works when dropping more than the length of the array", () => {
    expectTypeOf(pipe([1, 2, 3, 4, 5], drop(10))).toEqualTypeOf<
      Array<number>
    >();
  });
});
