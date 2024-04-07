import { createLazyInvocationCounter } from "../test/lazy_invocation_counter";
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

    it("handles infinity depth", () => {
      expect(
        flat([[1], [2], [[3, 4], [5]], 6], Number.POSITIVE_INFINITY),
      ).toStrictEqual([1, 2, 3, 4, 5, 6]);
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
      const beforeMock: <T>(x: T) => T = vi.fn(identity);
      const afterMock: <T>(x: T) => T = vi.fn(identity);
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
      const beforeMock: <T>(x: T) => T = vi.fn(identity);
      const afterMock: <T>(x: T) => T = vi.fn(identity);
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

  it("BUG: handles infinity depth", () => {
    const result = flat(
      [] as Array<Array<Array<string>>>,
      Number.POSITIVE_INFINITY,
    );
    expectTypeOf(result).toEqualTypeOf<Array<string>>();
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

  describe("`flattenDeep` equivalent (depth = 20)", () => {
    test("flatten", () => {
      expect(flat([[1, 2], 3, [4, 5]], 20)).toStrictEqual([1, 2, 3, 4, 5]);
    });

    test("nested", () => {
      expect(
        flat(
          [
            [1, 2],
            [[3], [4, 5]],
          ],
          20,
        ),
      ).toStrictEqual([1, 2, 3, 4, 5]);
    });

    test("lazy", () => {
      const counter1 = createLazyInvocationCounter();
      const counter2 = createLazyInvocationCounter();
      const result = pipe(
        [[1, 2], [[3]], [[4, 5]]],
        counter1.fn(),
        flat(20),
        counter2.fn(),
        find((x) => x - 1 === 2),
      );
      expect(counter1.count).toHaveBeenCalledTimes(2);
      expect(counter2.count).toHaveBeenCalledTimes(3);
      expect(result).toStrictEqual(3);
    });
  });
});
