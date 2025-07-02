import { describe, expect, it, vi } from "vitest";
import { filter } from "./filter";
import { map } from "./map";
import { multiply } from "./multiply";
import { pipe } from "./pipe";
import { tap } from "./tap";

const DATA = [1] as const;

describe("data first", () => {
  it("should call function with input value", () => {
    const fn = vi.fn<() => void>();
    tap(DATA, fn);

    expect(fn).toHaveBeenCalledWith(DATA);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("should return input value", () => {
    expect(tap(DATA, (data) => data.length)).toBe(DATA);
  });
});

describe("data last", () => {
  it("should call function with input value", () => {
    const fn = vi.fn<() => void>();
    pipe(DATA, tap(fn));

    expect(fn).toHaveBeenCalledWith(DATA);
    expect(fn).toHaveBeenCalledTimes(1);
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
        tap((data) => {
          expect(data).toStrictEqual([2]);
        }),
        map(multiply(2)),
      ),
    ).toStrictEqual([4]);
  });

  it("should infer types after tapping function reference with parameter type any", () => {
    expect(
      pipe(
        [-1, 2],
        filter((n) => n > 0),
        tap(foo),
        map(multiply(2)),
      ),
    ).toStrictEqual([4]);
  });
});

// (same as console.log)
function foo(x: unknown): unknown {
  return x;
}
