import { pipe } from "./pipe";
import { splice } from "./splice";

describe("arrays", () => {
  it("reflects the type of `items` in the return value", () => {
    const items: Array<number> = [];
    const result = splice(items, 0, 0, []);
    expectTypeOf(result).toEqualTypeOf<Array<number>>();
  });

  it("reflects the type of `replacement` in the return value", () => {
    const replacement: Array<number> = [];
    const result = splice([], 0, 0, replacement);
    expectTypeOf(result).toEqualTypeOf<Array<number>>();
  });

  it("reflects the type of `replacement` in the return value (data-last)", () => {
    const replacement: Array<number> = [];
    const result = pipe([], splice(0, 0, replacement));
    expectTypeOf(result).toEqualTypeOf<Array<number>>();
  });
});

describe("fixed tuples", () => {
  it("works with start + length < 0", () => {
    expectTypeOf(splice([1, 2, 3] as const, -4, 0, [4] as const)).toEqualTypeOf<
      [4, 1, 2, 3]
    >();
  });

  it("works with start < 0", () => {
    expectTypeOf(splice([1, 2, 3] as const, -1, 0, [4] as const)).toEqualTypeOf<
      [1, 2, 4, 3]
    >();
  });

  it("works with start = 0", () => {
    expectTypeOf(splice([1, 2, 3] as const, 0, 0, [4] as const)).toEqualTypeOf<
      [4, 1, 2, 3]
    >();
  });

  it("works with start > 0", () => {
    expectTypeOf(splice([1, 2, 3] as const, 1, 0, [4] as const)).toEqualTypeOf<
      [1, 4, 2, 3]
    >();
  });

  it("works with start >= length", () => {
    expectTypeOf(splice([1, 2, 3] as const, 3, 0, [4] as const)).toEqualTypeOf<
      [1, 2, 3, 4]
    >();
  });

  it("works with deleteCount < 0", () => {
    expectTypeOf(splice([1, 2, 3] as const, 1, -1, [4] as const)).toEqualTypeOf<
      [1, 4, 2, 3]
    >();
  });

  it("works with deleteCount + start < length", () => {
    expectTypeOf(splice([1, 2, 3] as const, 1, 2, [4] as const)).toEqualTypeOf<
      [1, 4]
    >();
  });

  it("works with deleteCount + start > length", () => {
    expectTypeOf(splice([1, 2, 3] as const, 1, 4, [4] as const)).toEqualTypeOf<
      [1, 4]
    >();
  });

  it("works with empty replacement", () => {
    expectTypeOf(splice([1, 2, 3] as const, 1, 1, [] as const)).toEqualTypeOf<
      [1, 3]
    >();
  });

  it("works with big replacement", () => {
    expectTypeOf(
      splice([1, 2, 3] as const, 1, 1, [4, 5, 6] as const),
    ).toEqualTypeOf<[1, 4, 5, 6, 3]>();
  });
});

describe("variable-length tuples", () => {
  it("works prefixed and suffixed", () => {
    expectTypeOf(
      splice(
        [1, 2, 3] as [number, number, ...Array<number>],
        1,
        1,
        [] as const,
      ),
    ).toEqualTypeOf<[number, ...Array<number>]>();
  });

  // TODO: tests?
});

describe("known issues", () => {
  it("does not work for deleting past rest param in variable-length tuple", () => {
    expectTypeOf(
      splice(
        [1, 2, 3, "a", "b"] as [
          number,
          number,
          ...Array<number>,
          string,
          string,
        ],
        3,
        3,
        [] as const,
      ),
      // @ts-expect-error - known issue; should we union all possibilities?
    ).toEqualTypeOf<[number, number, ...Array<number>, string?]>();
  });
});
