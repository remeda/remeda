import { doNothing } from "./doNothing";
import { forEach } from "./forEach";
import { pipe } from "./pipe";
import { take } from "./take";

describe("runtime", () => {
  test("dataFirst", () => {
    const data = [1, 2, 3];
    const cb = vi.fn();

    forEach(data, cb);

    expect(cb).toHaveBeenCalledWith(1, 0, data);
    expect(cb).toHaveBeenCalledWith(2, 1, data);
    expect(cb).toHaveBeenCalledWith(3, 2, data);
  });

  test("dataLast", () => {
    const data = [1, 2, 3];
    const cb = vi.fn();

    // Because the callback is used before the data, we need to tell forEach
    // what the expected type for the result is.
    const result = forEach<typeof data>(cb)(data);

    expect(cb).toHaveBeenCalledWith(1, 0, data);
    expect(cb).toHaveBeenCalledWith(2, 1, data);
    expect(cb).toHaveBeenCalledWith(3, 2, data);

    // dataLast used directly, we return the same reference.
    expect(result).toBe(data);
  });

  test("pipe", () => {
    const data = [1, 2, 3];

    // Callbacks take their type from the pipe itself, but because we construct
    // it here outside of the pipe, we need to deliberately type it.
    const cb = vi.fn((x: number) => x);

    const result = pipe(data, forEach(cb));

    expect(cb).toHaveBeenCalledWith(1, 0, data);
    expect(cb).toHaveBeenCalledWith(2, 1, data);
    expect(cb).toHaveBeenCalledWith(3, 2, data);

    expect(result).toStrictEqual(data);
    // The pipe reconstructs the array because it runs lazily.
    expect(result).not.toBe(data);
  });

  test("with take", () => {
    const count = vi.fn();
    const result = pipe(
      [1, 2, 3],
      forEach(() => {
        count();
      }),
      take(2),
    );
    expect(count).toHaveBeenCalledTimes(2);
    expect(result).toEqual([1, 2]);
  });
});

describe("typing", () => {
  it("doesn't return anything on dataFirst invocations", () => {
    const result = forEach([1, 2, 3], doNothing());
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type -- Intentionally
    expectTypeOf(result).toEqualTypeOf<void>();
  });

  it("passes the item type to the callback", () => {
    pipe(
      [1, 2, 3] as const,
      forEach((x) => {
        expectTypeOf(x).toEqualTypeOf<1 | 2 | 3>();
      }),
    );
  });

  it("maintains the array shape", () => {
    const data = [1, "a"] as [1 | 2, "a" | "b", ...Array<boolean>];

    pipe(data, forEach(doNothing()), (x) => {
      expectTypeOf(x).toEqualTypeOf<[1 | 2, "a" | "b", ...Array<boolean>]>();
    });
  });

  it("makes the result mutable", () => {
    const data = [] as ReadonlyArray<number>;

    pipe(data, forEach(doNothing()), (x) => {
      expectTypeOf(x).toEqualTypeOf<Array<number>>();
    });
  });
});
