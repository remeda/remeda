import { filter } from "./filter";
import { map } from "./map";
import { pipe } from "./pipe";
import { tap } from "./tap";

const DATA = [1] as const;

describe("data first", () => {
  it("should call function with input value", () => {
    const fn = vi.fn();
    tap(DATA, fn);
    expect(fn).toBeCalledWith(DATA);
    expect(fn).toHaveBeenCalledOnce();
  });

  it("should return input value", () => {
    expect(tap(DATA, (data) => data.length)).toBe(DATA);
  });
});

describe("data last", () => {
  it("should call function with input value", () => {
    const fn = vi.fn();
    pipe(DATA, tap(fn));
    expect(fn).toBeCalledWith(DATA);
    expect(fn).toHaveBeenCalledOnce();
  });

  it("should return input value", () => {
    expect(
      pipe(
        DATA,
        tap((data) => data.length),
      ),
    ).toBe(DATA);
  });

  it("should work in the middle of pipe sequence", () => {
    expect(
      pipe(
        [-1, 2],
        filter((n) => n > 0),
        // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
        tap((data) => {
          expect(data).toStrictEqual([2]);
          expectTypeOf(data).toEqualTypeOf<Array<number>>();
        }),
        map((n) => n * 2),
      ),
    ).toStrictEqual([4]);
  });

  it("should infer types after tapping function reference with parameter type any", () => {
    // (same as console.log)
    function foo(x: unknown) {
      return x;
    }

    expect(
      pipe(
        [-1, 2],
        filter((n) => n > 0),
        tap(foo),
        map((n) => {
          expectTypeOf(n).toBeNumber();
          return n * 2;
        }),
      ),
    ).toStrictEqual([4]);
  });
});
