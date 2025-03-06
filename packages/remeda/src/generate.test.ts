import { take } from "./take";
import { pipe } from "./pipe";
import { generate } from "./generate";

describe("gererate", () => {
  it("generates a sequence", () => {
    const fn = vi.fn<(i: number) => number>((i) => i ** 2);
    const gen = generate(fn)[Symbol.iterator]();

    expect(fn).toHaveBeenCalledTimes(0);
    expect(gen.next().value).toBe(0);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(gen.next().value).toBe(1);
    expect(fn).toHaveBeenCalledTimes(2);
    expect(gen.next().value).toBe(4);
    expect(fn).toHaveBeenCalledTimes(3);
    expect(gen.next().value).toBe(9);
    expect(fn).toHaveBeenCalledTimes(4);
  });

  it("works outside of pipe", () => {
    expect(
      take(
        generate((i) => i ** 2),
        4,
      ),
    ).toStrictEqual([0, 1, 4, 9]);
  });

  it("works in pipe", () => {
    expect(
      pipe(
        generate((i) => i ** 2),
        take(4),
      ),
    ).toStrictEqual([0, 1, 4, 9]);
  });
});
