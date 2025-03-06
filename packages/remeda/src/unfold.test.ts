import { unfold } from "./unfold";
import { constant } from "./constant";
import { take } from "./take";
import { pipe } from "./pipe";

describe("unfold", () => {
  it("should generate a sequence of numbers", () => {
    const result = unfold(0, (n) => (n < 5 ? [n, n + 1] : undefined));

    expect(result).toStrictEqual([0, 1, 2, 3, 4]);
  });

  it("should return an empty array if function returns undefined immediately", () => {
    const result = unfold(0, constant(undefined));

    expect(result).toStrictEqual([]);
  });

  it("should generate a sequence of objects", () => {
    const result = unfold({ count: 0 }, (state) =>
      state.count < 3
        ? [{ ...state, count: state.count + 1 }, { count: state.count + 1 }]
        : undefined,
    );

    expect(result).toStrictEqual([{ count: 1 }, { count: 2 }, { count: 3 }]);
  });

  it("should handle complex logic", () => {
    const result = unfold(1, (n) => (n < 100 ? [n, n * 2] : undefined));

    expect(result).toStrictEqual([1, 2, 4, 8, 16, 32, 64]);
  });

  it("should work with curried version", () => {
    const curriedUnfold = unfold((n: number) =>
      n < 5 ? [n, n + 1] : undefined,
    );
    const result = curriedUnfold(0);

    expect(result).toStrictEqual([0, 1, 2, 3, 4]);
  });

  it("should work lazily", () => {
    const fn = vi.fn<(n: number) => [number, number]>((n) => [n, n + 1]);

    expect(pipe(0, unfold(fn), take(3))).toStrictEqual([0, 1, 2]);
    expect(fn).toHaveBeenCalledTimes(3);
  });
});
