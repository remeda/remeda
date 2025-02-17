import { createLazyInvocationCounter } from "../test/lazyInvocationCounter.js";
import { find } from "./find";
import { flat } from "./flat";
import { identity } from "./identity";
import { map } from "./map";
import { pipe } from "./pipe";

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
    expect(flat([{ a: 1 }, [{ b: 3 }]], 1)).toStrictEqual([{ a: 1 }, { b: 3 }]);
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
    // eslint-disable-next-line vitest/require-mock-type-parameters -- TODO: It's hard to type this correctly taking into account the deep structure of the array. We might be able to work around that if we pull the array out and use it's type (e.g. typeof) to build the type for the function here...
    const beforeMock = vi.fn(identity());
    const afterMock = vi.fn<(x: number) => number>(identity());
    const result = pipe(
      [[1, 2], 3, [4, 5]],
      map(beforeMock),
      flat(1),
      map(afterMock),
      find((x) => x - 1 === 2),
    );

    expect(beforeMock).toHaveBeenCalledTimes(2);
    expect(afterMock).toHaveBeenCalledTimes(3);
    expect(result).toBe(3);
  });

  it("works lazily (deep)", () => {
    // eslint-disable-next-line vitest/require-mock-type-parameters -- TODO: It's hard to type this correctly taking into account the deep structure of the array. We might be able to work around that if we pull the array out and use it's type (e.g. typeof) to build the type for the function here...
    const beforeMock = vi.fn(identity());
    const afterMock = vi.fn<(x: number) => number>(identity());
    const result = pipe(
      [[[0]], [[[1, 2], [[3]], [[4, 5]]]], 6],
      map(beforeMock),
      flat(4),
      map(afterMock),
      find((x) => x - 1 === 2),
    );

    expect(beforeMock).toHaveBeenCalledTimes(2);
    expect(afterMock).toHaveBeenCalledTimes(4);
    expect(result).toBe(3);
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
        expect(result).toBe(3);
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
      expect(result).toBe(3);
    });
  });
});
