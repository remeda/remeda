import { pipe } from "./pipe";
import { prop } from "./prop";
import { sumBy } from "./sumBy";

describe("data first", () => {
  test("sumBy", () => {
    expect(
      sumBy([{ a: 1 }, { a: 2 }, { a: 4 }, { a: 5 }, { a: 3 }], prop("a")),
    ).toBe(15);
  });

  test("indexed", () => {
    expect(
      sumBy(
        [{ a: 1 }, { a: 2 }, { a: 4 }, { a: 5 }, { a: 3 }],
        ({ a }, idx) => a + idx,
      ),
    ).toBe(25);
  });

  test("works with bigint", () => {
    expect(
      sumBy([{ a: 1n }, { a: 2n }, { a: 4n }, { a: 5n }, { a: 3n }], prop("a")),
    ).toBe(15n);
  });

  it("should return 0 for an empty array", () => {
    expect(sumBy([], prop("a"))).toBe(0);
  });
});

describe("data last", () => {
  test("sumBy", () => {
    expect(
      pipe(
        [{ a: 1 }, { a: 2 }, { a: 4 }, { a: 5 }, { a: 3 }],
        sumBy(prop("a")),
      ),
    ).toBe(15);
  });

  test("works with bigint", () => {
    expect(
      pipe(
        [{ a: 1n }, { a: 2n }, { a: 4n }, { a: 5n }, { a: 3n }],
        sumBy(prop("a")),
      ),
    ).toBe(15n);
  });

  it("should return 0 for an empty array", () => {
    expect(pipe([], sumBy(prop("a")))).toBe(0);
  });

  test("indexed", () => {
    const actual = pipe(
      [{ a: 1 }, { a: 2 }, { a: 4 }, { a: 5 }, { a: 3 }],
      sumBy(({ a }, idx) => a + idx),
    );

    expect(actual).toBe(25);
  });
});
