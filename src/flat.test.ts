import { createLazyInvocationCounter } from "../test/lazyInvocationCounter.js";
import type { NonEmptyArray } from "./_types";
import { find } from "./find";
import { flat } from "./flat";
import { identity } from "./identity";
import { map } from "./map";
import { pipe } from "./pipe";

describe("runtime", () => {
  describe("dataFirst", () => {
    it("works on empty arrays", () => {
      expect(flat([], 1)).toStrictEqual([]);
    });

    it("works on flat arrays", () => {
      expect(flat([1, 2, 3], 1)).toStrictEqual([1, 2, 3]);
    });

    it("flattens shallow nested arrays", () => {
      expect(flat([[1, 2], [3, 4], [5], [6]], 1)).toStrictEqual([
        1, 2, 3, 4, 5, 6,
      ]);
    });

    it("stops at the given depth", () => {
      expect(flat([[[[[[[[[1]]]]]]]]], 3)).toStrictEqual([[[[[[1]]]]]]);
    });

    it("works with deeper depth", () => {
      expect(flat([1], 10)).toStrictEqual([1]);
    });

    it("handles optional depth as if it was 1", () => {
      expect(flat([1, [2, 3], [[4]]])).toStrictEqual([1, 2, 3, [4]]);
    });

    it("handles objects", () => {
      expect(flat([{ a: 1 }, [{ b: 3 }]], 1)).toStrictEqual([
        { a: 1 },
        { b: 3 },
      ]);
    });

    it("clones the array on depth 0", () => {
      const data = [1, 2, 3];
      const result = flat(data, 0);
      expect(result).toStrictEqual(data);
      expect(result).not.toBe(data);
    });

    it("clones the array when no nested items", () => {
      const data = [1, 2, 3];
      const result = flat(data, 1);
      expect(result).toStrictEqual(data);
      expect(result).not.toBe(data);
    });
  });

  describe("dataLast", () => {
    it("works on empty arrays", () => {
      expect(pipe([], flat(1))).toStrictEqual([]);
    });

    it("works on flat arrays", () => {
      expect(pipe([1, 2, 3], flat(1))).toStrictEqual([1, 2, 3]);
    });

    it("flattens shallow nested arrays", () => {
      expect(pipe([[1, 2], [3, 4], [5], [6]], flat(1))).toStrictEqual([
        1, 2, 3, 4, 5, 6,
      ]);
    });

    it("stops at the given depth", () => {
      expect(pipe([[[[[[[[[1]]]]]]]]], flat(3))).toStrictEqual([[[[[[1]]]]]]);
    });

    it("works with deeper depth", () => {
      expect(pipe([1], flat(10))).toStrictEqual([1]);
    });

    it("handles optional depth as if it was 1", () => {
      expect(pipe([1, [2, 3], [[4]]], flat())).toStrictEqual([1, 2, 3, [4]]);
    });

    it("handles objects", () => {
      expect(pipe([{ a: 1 }, [{ b: 3 }]], flat(1))).toStrictEqual([
        { a: 1 },
        { b: 3 },
      ]);
    });

    it("works lazily (shallow)", () => {
      const beforeMock: <T>(x: T) => T = vi.fn(identity());
      const afterMock: <T>(x: T) => T = vi.fn(identity());
      const result = pipe(
        [[1, 2], 3, [4, 5]],
        map(beforeMock),
        flat(1),
        map(afterMock),
        find((x) => x - 1 === 2),
      );
      expect(beforeMock).toHaveBeenCalledTimes(2);
      expect(afterMock).toHaveBeenCalledTimes(3);
      expect(result).toStrictEqual(3);
    });

    it("works lazily (deep)", () => {
      const beforeMock: <T>(x: T) => T = vi.fn(identity());
      const afterMock: <T>(x: T) => T = vi.fn(identity());
      const result = pipe(
        [[[0]], [[[1, 2], [[3]], [[4, 5]]]], 6],
        map(beforeMock),
        flat(4),
        map(afterMock),
        find((x) => x - 1 === 2),
      );
      expect(beforeMock).toHaveBeenCalledTimes(2);
      expect(afterMock).toHaveBeenCalledTimes(4);
      expect(result).toStrictEqual(3);
    });

    it("works lazily with trivial depth === 0", () => {
      const data = [1, [2, 3], [4, [5, 6], [7, [8, 9], [[10]]]]];
      const result = pipe(data, flat(0));
      expect(result).toStrictEqual(data);
      expect(result).not.toBe(data);
    });
  });

  it("can go very very deep", () => {
    expect(
      flat([[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[1]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]], 99),
    ).toStrictEqual([1]);
  });
});

describe("typing", () => {
  it("works on empty arrays", () => {
    const result = flat([], 1);
    expectTypeOf(result).toEqualTypeOf<[]>();
  });

  it("works on already-flat arrays", () => {
    const result = flat([] as Array<string>, 1);
    expectTypeOf(result).toEqualTypeOf<Array<string>>();
  });

  it("works on a single level of nesting", () => {
    const result = flat([] as Array<Array<string>>, 1);
    expectTypeOf(result).toEqualTypeOf<Array<string>>();
  });

  it("stops after the first level of nesting (depth === 1)", () => {
    const result = flat([] as Array<Array<Array<string>>>, 1);
    expectTypeOf(result).toEqualTypeOf<Array<Array<string>>>();
  });

  it("stops after the first level of nesting (depth === 1)", () => {
    const result = flat([] as Array<Array<Array<Array<string>>>>, 1);
    expectTypeOf(result).toEqualTypeOf<Array<Array<Array<string>>>>();
  });

  it("works with mixed types", () => {
    const result = flat([] as Array<Array<number> | Array<string>>, 1);
    expectTypeOf(result).toEqualTypeOf<Array<number | string>>();
  });

  it("works with mixed levels of nesting", () => {
    const result = flat([] as Array<Array<number> | string>, 1);
    expectTypeOf(result).toEqualTypeOf<Array<number | string>>();
  });

  it("works when depth is deeper than the array", () => {
    const result = flat([] as Array<string>, 10);
    expectTypeOf(result).toEqualTypeOf<Array<string>>();
  });

  it("works when depth is really really really really big", () => {
    const result = flat([] as Array<string>, 9_999_999);
    expectTypeOf(result).toEqualTypeOf<Array<string>>();
  });

  it("keeps the typing of trivial tuples", () => {
    const result = flat([1, 2] as const, 1);
    expectTypeOf(result).toEqualTypeOf<[1, 2]>();
  });

  it("Works on simple tuples", () => {
    const result = flat(
      [
        [1, 2],
        [3, 4],
      ] as const,
      1,
    );
    expectTypeOf(result).toEqualTypeOf<[1, 2, 3, 4]>();
  });

  it("works on tuples with different levels of nesting", () => {
    const result = flat([1, [2, 3], [4, [5, 6]]] as const, 1);
    expectTypeOf(result).toEqualTypeOf<[1, 2, 3, 4, readonly [5, 6]]>();
  });

  it("works on tuples with depth>1", () => {
    const result = flat([1, [2, 3], [4, [5, 6]]] as const, 2);
    expectTypeOf(result).toEqualTypeOf<[1, 2, 3, 4, 5, 6]>();
  });

  it("works with tuples with a lot of nesting", () => {
    const result = flat([[[[1]], [[[[2]]]]], [[[[3, 4], 5]]]] as const, 10);
    expectTypeOf(result).toEqualTypeOf<[1, 2, 3, 4, 5]>();
  });

  it("works with a mix of simple arrays and tuples", () => {
    const result = flat([[]] as [Array<string>], 1);
    expectTypeOf(result).toEqualTypeOf<Array<string>>();
  });

  it("works with multiple types nested in a tuple", () => {
    const result = flat([[], []] as [Array<string>, Array<number>], 1);
    expectTypeOf(result).toEqualTypeOf<Array<number | string>>();
  });

  it("works with a tuple with mixed array and non array items", () => {
    const result = flat([1, []] as [number, Array<string>], 1);
    expectTypeOf(result).toEqualTypeOf<[number, ...Array<string>]>();
  });

  it("works with a tuple with mixed array and non array items, deeply", () => {
    const result = flat([[1], []] as [[number], Array<Array<string>>], 2);
    expectTypeOf(result).toEqualTypeOf<[number, ...Array<string>]>();
  });

  it("works on non-empty arrays", () => {
    const result = flat([[1]] as NonEmptyArray<NonEmptyArray<number>>, 1);
    expectTypeOf(result).toEqualTypeOf<NonEmptyArray<number>>();
  });

  it("works on tuples inside arrays", () => {
    const result = flat([] as Array<[Array<string>, Array<number>]>, 2);
    expectTypeOf(result).toEqualTypeOf<Array<number | string>>();
  });

  it("works on tuples inside arrays", () => {
    const result = flat([1, [], 4] as [1, Array<[2, 3]>, 4], 2);
    expectTypeOf(result).toEqualTypeOf<[1, ...Array<2 | 3>, 4]>();
  });

  it("works with depths beyond 20", () => {
    // The built-in type for `Array.prototype.flat` only goes up to 20.

    const result = flat(
      [[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[1]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]] as const,
      99,
    );
    expectTypeOf(result).toEqualTypeOf<[1]>();
  });

  it("doesn't accept non-literal depths", () => {
    // @ts-expect-error [ts2345] - non-literal numbers can't be used as depth.
    flat([], 1 as number);
  });

  it("doesn't accept built-in 'infinite' numbers", () => {
    // They are all typed as `number` by typescript's libs.

    // @ts-expect-error [ts2345] - Infinity is typed as a non-literal number. - https://github.com/microsoft/TypeScript/blob/main/src/lib/es5.d.ts#L9
    flat([], Number.POSITIVE_INFINITY);

    // @ts-expect-error [ts2345] - Max number is typed as a non-literal number. - https://github.com/microsoft/TypeScript/blob/main/src/lib/es5.d.ts#L576
    flat([], Number.MAX_VALUE);

    // @ts-expect-error [ts2345] - Infinity is typed as a non-literal number. - https://github.com/microsoft/TypeScript/blob/main/src/lib/es5.d.ts#L597
    flat([], Number.POSITIVE_INFINITY);
  });
});

// These tests are copied from an previous implementations of the same concept
// as flat that existed in previous versions of Remeda. We copy the tests so
// that we can ensure that the new function is equivalent. In the future these
// can be deleted.
describe("LEGACY", () => {
  describe("`flatten` equivalent (depth = 1)", () => {
    test("flatten", () => {
      expect(flat([[1, 2], 3, [4, 5]])).toStrictEqual([1, 2, 3, 4, 5]);
    });

    test("nested", () => {
      expect(
        flat([
          [1, 2],
          [[3], [4, 5]],
        ]),
      ).toStrictEqual([1, 2, [3], [4, 5]]);
    });

    describe("dataLast", () => {
      test("flatten multiple values", () => {
        expect(pipe([[1, 2], 3, [4, 5]], flat())).toStrictEqual([
          1, 2, 3, 4, 5,
        ]);
      });

      test("flatten single value", () => {
        expect(pipe([[1]], flat())).toStrictEqual([1]);
      });

      test("lazy", () => {
        const counter1 = createLazyInvocationCounter();
        const counter2 = createLazyInvocationCounter();
        const result = pipe(
          [[1, 2], 3, [4, 5]],
          counter1.fn(),
          flat(4),
          counter2.fn(),
          find((x) => x - 1 === 2),
        );
        expect(counter1.count).toHaveBeenCalledTimes(2);
        expect(counter2.count).toHaveBeenCalledTimes(3);
        expect(result).toStrictEqual(3);
      });
    });
  });

  describe("`flattenDeep` equivalent (depth = 4)", () => {
    test("flatten", () => {
      expect(flat([[1, 2], 3, [4, 5]], 4)).toStrictEqual([1, 2, 3, 4, 5]);
    });

    test("nested", () => {
      expect(
        flat(
          [
            [1, 2],
            [[3], [4, 5]],
          ],
          4,
        ),
      ).toStrictEqual([1, 2, 3, 4, 5]);
    });

    test("lazy", () => {
      const counter1 = createLazyInvocationCounter();
      const counter2 = createLazyInvocationCounter();
      const result = pipe(
        [[1, 2], [[3]], [[4, 5]]],
        counter1.fn(),
        flat(4),
        counter2.fn(),
        find((x) => x - 1 === 2),
      );
      expect(counter1.count).toHaveBeenCalledTimes(2);
      expect(counter2.count).toHaveBeenCalledTimes(3);
      expect(result).toStrictEqual(3);
    });
  });
});
