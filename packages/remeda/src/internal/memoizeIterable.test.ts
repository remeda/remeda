import { memoizeIterable } from "./memoizeIterable";

describe("memoizeIterable", () => {
  test("should return an iterable that caches values", () => {
    const iterable = [1, 2, 3];
    const memoized = memoizeIterable(iterable);

    const result1 = [...memoized];
    const result2 = [...memoized];

    expect(result1).toStrictEqual([1, 2, 3]);
    expect(result2).toStrictEqual([1, 2, 3]);
  });

  test("should handle empty iterables", () => {
    const iterable: Array<number> = [];
    const memoized = memoizeIterable(iterable);

    const result = [...memoized];

    expect(result).toStrictEqual([]);
  });

  test("should handle single element iterables", () => {
    const iterable = [42];
    const memoized = memoizeIterable(iterable);

    const result = [...memoized];

    expect(result).toStrictEqual([42]);
  });

  test("should not re-iterate the original iterable", () => {
    const expected = [1, 2, 3];
    const iterable = [...expected];
    const mockIterable = {
      [Symbol.iterator]: vi.fn<() => Iterator<number>>(() =>
        iterable[Symbol.iterator](),
      ),
    };

    const memoized = memoizeIterable(mockIterable);

    expect([...memoized]).toStrictEqual(expected);

    iterable[0] = 42;

    expect([...memoized]).toStrictEqual(expected);

    expect(mockIterable[Symbol.iterator]).toHaveBeenCalledTimes(1);
  });
});
