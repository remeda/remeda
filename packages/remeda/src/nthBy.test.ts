import { describe, expect, test } from "vitest";
import { identity } from "./identity";
import { nthBy } from "./nthBy";
import { pipe } from "./pipe";

describe("runtime (dataFirst)", () => {
  test("works", () => {
    const data = [2, 1, 3];

    expect(nthBy(data, 0, identity())).toBe(1);
    expect(nthBy(data, 1, identity())).toBe(2);
    expect(nthBy(data, 2, identity())).toBe(3);
  });

  test("handles negative indexes", () => {
    const data = [2, 1, 3];

    expect(nthBy(data, -1, identity())).toBe(3);
    expect(nthBy(data, -2, identity())).toBe(2);
    expect(nthBy(data, -3, identity())).toBe(1);
  });

  test("handles overflows gracefully", () => {
    expect(nthBy([1, 2, 3], 100, identity())).toBeUndefined();
    expect(nthBy([1, 2, 3], -100, identity())).toBeUndefined();
  });

  test("works with complex order rules", () => {
    const data = ["aaaa", "b", "bb", "a", "aaa", "bbbb", "aa", "bbb"] as const;

    expect(nthBy(data, 0, (a) => a.length, identity())).toBe("a");
    expect(nthBy(data, 1, (a) => a.length, identity())).toBe("b");
    expect(nthBy(data, 2, (a) => a.length, identity())).toBe("aa");
    expect(nthBy(data, 3, (a) => a.length, identity())).toBe("bb");
    expect(nthBy(data, 4, (a) => a.length, identity())).toBe("aaa");
    expect(nthBy(data, 5, (a) => a.length, identity())).toBe("bbb");
    expect(nthBy(data, 6, (a) => a.length, identity())).toBe("aaaa");
    expect(nthBy(data, 7, (a) => a.length, identity())).toBe("bbbb");
  });
});

describe("runtime (dataLast)", () => {
  test("works", () => {
    const data = [2, 1, 3];

    expect(pipe(data, nthBy(0, identity()))).toBe(1);
    expect(pipe(data, nthBy(1, identity()))).toBe(2);
    expect(pipe(data, nthBy(2, identity()))).toBe(3);
  });

  test("handles negative indexes", () => {
    const data = [2, 1, 3];

    expect(pipe(data, nthBy(-1, identity()))).toBe(3);
    expect(pipe(data, nthBy(-2, identity()))).toBe(2);
    expect(pipe(data, nthBy(-3, identity()))).toBe(1);
  });

  test("handles overflows gracefully", () => {
    expect(pipe([1, 2, 3], nthBy(100, identity()))).toBeUndefined();
    expect(pipe([1, 2, 3], nthBy(-100, identity()))).toBeUndefined();
  });

  test("works with complex order rules", () => {
    const data = ["aaaa", "b", "bb", "a", "aaa", "bbbb", "aa", "bbb"] as const;

    expect(
      pipe(
        data,
        nthBy(0, (a) => a.length, identity()),
      ),
    ).toBe("a");
    expect(
      pipe(
        data,
        nthBy(1, (a) => a.length, identity()),
      ),
    ).toBe("b");
    expect(
      pipe(
        data,
        nthBy(2, (a) => a.length, identity()),
      ),
    ).toBe("aa");
    expect(
      pipe(
        data,
        nthBy(3, (a) => a.length, identity()),
      ),
    ).toBe("bb");
    expect(
      pipe(
        data,
        nthBy(4, (a) => a.length, identity()),
      ),
    ).toBe("aaa");
    expect(
      pipe(
        data,
        nthBy(5, (a) => a.length, identity()),
      ),
    ).toBe("bbb");
    expect(
      pipe(
        data,
        nthBy(6, (a) => a.length, identity()),
      ),
    ).toBe("aaaa");
    expect(
      pipe(
        data,
        nthBy(7, (a) => a.length, identity()),
      ),
    ).toBe("bbbb");
  });
});
