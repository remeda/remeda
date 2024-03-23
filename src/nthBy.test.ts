import { nthBy } from "./nthBy";
import { identity } from "./identity";
import { pipe } from "./pipe";

describe("runtime (dataFirst)", () => {
  it("works", () => {
    const data = [2, 1, 3];
    expect(nthBy(data, 0, identity())).toEqual(1);
    expect(nthBy(data, 1, identity())).toEqual(2);
    expect(nthBy(data, 2, identity())).toEqual(3);
  });

  it("handles negative indexes", () => {
    const data = [2, 1, 3];
    expect(nthBy(data, -1, identity())).toEqual(3);
    expect(nthBy(data, -2, identity())).toEqual(2);
    expect(nthBy(data, -3, identity())).toEqual(1);
  });

  it("handles overflows gracefully", () => {
    expect(nthBy([1, 2, 3], 100, identity())).toBeUndefined();
    expect(nthBy([1, 2, 3], -100, identity())).toBeUndefined();
  });

  it("works with complex order rules", () => {
    const data = ["aaaa", "b", "bb", "a", "aaa", "bbbb", "aa", "bbb"] as const;
    expect(nthBy(data, 0, (a) => a.length, identity())).toEqual("a");
    expect(nthBy(data, 1, (a) => a.length, identity())).toEqual("b");
    expect(nthBy(data, 2, (a) => a.length, identity())).toEqual("aa");
    expect(nthBy(data, 3, (a) => a.length, identity())).toEqual("bb");
    expect(nthBy(data, 4, (a) => a.length, identity())).toEqual("aaa");
    expect(nthBy(data, 5, (a) => a.length, identity())).toEqual("bbb");
    expect(nthBy(data, 6, (a) => a.length, identity())).toEqual("aaaa");
    expect(nthBy(data, 7, (a) => a.length, identity())).toEqual("bbbb");
  });
});

describe("runtime (dataLast)", () => {
  it("works", () => {
    const data = [2, 1, 3];
    expect(pipe(data, nthBy(0, identity()))).toEqual(1);
    expect(pipe(data, nthBy(1, identity()))).toEqual(2);
    expect(pipe(data, nthBy(2, identity()))).toEqual(3);
  });

  it("handles negative indexes", () => {
    const data = [2, 1, 3];
    expect(pipe(data, nthBy(-1, identity()))).toEqual(3);
    expect(pipe(data, nthBy(-2, identity()))).toEqual(2);
    expect(pipe(data, nthBy(-3, identity()))).toEqual(1);
  });

  it("handles overflows gracefully", () => {
    expect(pipe([1, 2, 3], nthBy(100, identity()))).toBeUndefined();
    expect(pipe([1, 2, 3], nthBy(-100, identity()))).toBeUndefined();
  });

  it("works with complex order rules", () => {
    const data = ["aaaa", "b", "bb", "a", "aaa", "bbbb", "aa", "bbb"] as const;
    expect(
      pipe(
        data,
        nthBy(0, (a) => a.length, identity()),
      ),
    ).toEqual("a");
    expect(
      pipe(
        data,
        nthBy(1, (a) => a.length, identity()),
      ),
    ).toEqual("b");
    expect(
      pipe(
        data,
        nthBy(2, (a) => a.length, identity()),
      ),
    ).toEqual("aa");
    expect(
      pipe(
        data,
        nthBy(3, (a) => a.length, identity()),
      ),
    ).toEqual("bb");
    expect(
      pipe(
        data,
        nthBy(4, (a) => a.length, identity()),
      ),
    ).toEqual("aaa");
    expect(
      pipe(
        data,
        nthBy(5, (a) => a.length, identity()),
      ),
    ).toEqual("bbb");
    expect(
      pipe(
        data,
        nthBy(6, (a) => a.length, identity()),
      ),
    ).toEqual("aaaa");
    expect(
      pipe(
        data,
        nthBy(7, (a) => a.length, identity()),
      ),
    ).toEqual("bbbb");
  });
});

describe("typing", () => {
  it("works with regular arrays", () => {
    const result = nthBy([1, 2, 3], 0, identity());
    expectTypeOf(result).toEqualTypeOf<number | undefined>();
  });

  it("works with negative indices", () => {
    const result = nthBy([1, 2, 3], -1, identity());
    expectTypeOf(result).toEqualTypeOf<number | undefined>();
  });

  it("works with tuples", () => {
    const data: [string, boolean, number] = ["a", true, 1];
    const result = nthBy(data, 1, identity());
    expectTypeOf(result).toEqualTypeOf<boolean | number | string | undefined>();
  });
});
