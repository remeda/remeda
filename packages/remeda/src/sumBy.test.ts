import { describe, expect, test, vi } from "vitest";
import { identity } from "./identity";
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

  test("should return 0 for an empty array", () => {
    expect(sumBy([], prop("a"))).toBe(0);
  });

  test("a single item", () => {
    expect(sumBy([{ a: 5 }], prop("a"))).toBe(5);
  });

  test("a single bigint", () => {
    expect(sumBy([{ a: 5n }], prop("a"))).toBe(5n);
  });

  test("keeps -0 from the first mapped value", () => {
    expect(sumBy([-0, -0], identity())).toBe(-0);
  });

  test("propagates NaN", () => {
    expect(sumBy([1, NaN, 3], identity())).toBeNaN();
  });

  test("reads holes as undefined", () => {
    // eslint-disable-next-line no-sparse-arrays -- The hole is the case under test.
    expect(sumBy([1, , 3], (value) => value ?? 10)).toBe(14);
  });

  test("calls the mapper on each item in order with the whole array", () => {
    const data = [1, 2, 3];
    const mapper =
      vi.fn<(value: number, index: number, data: readonly number[]) => number>(
        identity(),
      );

    sumBy(data, mapper);

    expect(mapper.mock.calls).toStrictEqual([
      [1, 0, data],
      [2, 1, data],
      [3, 2, data],
    ]);
  });

  test("doesn't call the mapper on an empty array", () => {
    const mapper = vi.fn<(value: number) => number>(identity());

    sumBy([], mapper);

    expect(mapper).not.toHaveBeenCalled();
  });

  test("throws on a number after bigints", () => {
    // @ts-expect-error [ts2769] -- The types reject a mapper that mixes bigint and number.
    expect(() => sumBy([1n, 2], identity())).toThrow(
      new TypeError(
        "Cannot mix BigInt and other types, use explicit conversions",
      ),
    );
  });

  test("throws on a bigint after numbers", () => {
    // @ts-expect-error [ts2769] -- The types reject a mapper that mixes bigint and number.
    expect(() => sumBy([1, 2n], identity())).toThrow(
      new TypeError(
        "Cannot mix BigInt and other types, use explicit conversions",
      ),
    );
  });

  test("stops mapping at the first value of the other type", () => {
    const mapper =
      vi.fn<(value: bigint | number) => bigint | number>(identity());

    // @ts-expect-error [ts2769] -- The types reject a mapper that mixes bigint and number.
    expect(() => sumBy([1n, 2, 3n], mapper)).toThrow(
      new TypeError(
        "Cannot mix BigInt and other types, use explicit conversions",
      ),
    );
    expect(mapper).toHaveBeenCalledTimes(2);
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

  test("should return 0 for an empty array", () => {
    expect(pipe([], sumBy(prop("a")))).toBe(0);
  });

  test("indexed", () => {
    const actual = pipe(
      [{ a: 1 }, { a: 2 }, { a: 4 }, { a: 5 }, { a: 3 }],
      sumBy(({ a }, idx) => a + idx),
    );

    expect(actual).toBe(25);
  });

  test("throws like data-first on mixed bigint and number", () => {
    // @ts-expect-error [ts2769] -- The types reject a mapper that mixes bigint and number.
    expect(() => pipe([1n, 2], sumBy(identity()))).toThrow(
      new TypeError(
        "Cannot mix BigInt and other types, use explicit conversions",
      ),
    );
  });
});
