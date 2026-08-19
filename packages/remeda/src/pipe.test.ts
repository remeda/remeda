import { describe, expect, test, vi } from "vitest";
import { filter } from "./filter";
import { flat } from "./flat";
import { identity } from "./identity";
import type { LazyEvaluator } from "./internal/types/LazyEvaluator";
import { lazyEmptyEvaluator } from "./internal/utilityEvaluators";
import { map } from "./map";
import { pipe } from "./pipe";
import { prop } from "./prop";
import { purry } from "./purry";
import { take } from "./take";

test("should pass through data with 0 functions", () => {
  const data = { a: "hello", b: 123 };

  expect(pipe(data)).toBe(data);
});

test("should pipe a single operation", () => {
  const result = pipe(1, (x) => x * 2);

  expect(result).toBe(2);
});

test("should pipe operations", () => {
  const result = pipe(
    1,
    (x) => x * 2,
    (x) => x * 3,
  );

  expect(result).toBe(6);
});

describe("lazy", () => {
  test("lazy map + take", () => {
    const count = vi.fn<() => void>();
    const result = pipe(
      [1, 2, 3],
      map((x) => {
        count();
        return x * 10;
      }),
      take(2),
    );

    expect(count).toHaveBeenCalledTimes(2);
    expect(result).toStrictEqual([10, 20]);
  });

  test("lazy map + filter + take", () => {
    const count = vi.fn<() => void>();
    const result = pipe(
      [1, 2, 3, 4, 5],
      map((x) => {
        count();
        return x * 10;
      }),
      filter((x) => (x / 10) % 2 === 1),
      take(2),
    );

    expect(count).toHaveBeenCalledTimes(3);
    expect(result).toStrictEqual([10, 30]);
  });

  test("lazy after 1st op", () => {
    const count = vi.fn<() => void>();
    const result = pipe(
      { inner: [1, 2, 3] },
      prop("inner"),
      map((x) => {
        count();
        return x * 10;
      }),
      take(2),
    );

    expect(count).toHaveBeenCalledTimes(2);
    expect(result).toStrictEqual([10, 20]);
  });

  test("break lazy", () => {
    const count = vi.fn<() => void>();
    const result = pipe(
      [1, 2, 3],
      map((x) => {
        count();
        return x * 10;
      }),
      (x) => x,
      take(2),
    );

    expect(count).toHaveBeenCalledTimes(3);
    expect(result).toStrictEqual([10, 20]);
  });

  test("multiple take", () => {
    const count = vi.fn<() => void>();
    const result = pipe(
      [1, 2, 3],
      map((x) => {
        count();
        return x * 10;
      }),
      take(2),
      take(1),
    );

    expect(count).toHaveBeenCalledTimes(1);
    expect(result).toStrictEqual([10]);
  });

  test("multiple lazy", () => {
    const count = vi.fn<() => void>();
    const count2 = vi.fn<() => void>();
    const result = pipe(
      [1, 2, 3, 4, 5, 6, 7],
      map((x) => {
        count();
        return x * 10;
      }),
      take(4),
      identity(),
      map((x) => {
        count2();
        return x * 10;
      }),
      take(2),
    );

    expect(count).toHaveBeenCalledTimes(4);
    expect(count2).toHaveBeenCalledTimes(2);
    expect(result).toStrictEqual([100, 200]);
  });

  test("early exit when done without a next value", () => {
    const count = vi.fn<() => void>();
    const result = pipe(
      [1, 2, 3, 4, 5],
      map((x) => {
        count();
        return x * 10;
      }),
      take(0),
    );

    // An element must be pulled before `take(0)` can report `done`, so the
    // callback runs exactly once even though the result is empty.
    expect(count).toHaveBeenCalledTimes(1);
    expect(result).toStrictEqual([]);
  });

  test("early exit when done without a next value mid-pipe", () => {
    const count = vi.fn<() => void>();
    const downstream = vi.fn<(x: number) => number>();
    const result = pipe(
      [1, 2, 3],
      map((x) => {
        count();
        return x * 10;
      }),
      take(0),
      map(downstream),
    );

    expect(count).toHaveBeenCalledTimes(1);
    expect(downstream).not.toHaveBeenCalled();
    expect(result).toStrictEqual([]);
  });

  test("lazy early exit with hasMany", () => {
    const result = pipe(
      [
        [1, 2],
        [3, 4],
        [5, 6],
      ],
      take(1),
      flat(),
    );

    expect(result).toStrictEqual([1, 2]);
  });

  test("early exit when done with many next values", () => {
    // No built-in function emits `hasMany` results together with `done`; the
    // combination is only reachable via custom `purry` lazy implementations,
    // but it is part of the lazy protocol and must stop the input iteration.
    const duplicateFirst = purry(
      /* v8 ignore next 2 -- `pipe` only ever runs the lazy implementation. */
      (data: readonly number[]) =>
        data.slice(0, 1).flatMap((value) => [value, value]),
      [],
      () => duplicateFirstEvaluator,
    ) as (data: readonly number[]) => number[];

    const count = vi.fn<() => void>();
    const result = pipe(
      [1, 2, 3],
      map((x) => {
        count();
        return x * 10;
      }),
      duplicateFirst,
    );

    expect(count).toHaveBeenCalledTimes(1);
    expect(result).toStrictEqual([10, 10]);
  });

  test("doesn't mutate shared singleton evaluators", () => {
    pipe([1, 2, 3], take(0));

    // `take(0)` returns the module-level `lazyEmptyEvaluator` shared by every
    // pipe in the process, so per-pipe state must not be stamped onto it.
    expect(lazyEmptyEvaluator).not.toHaveProperty("items");
  });
});

const duplicateFirstEvaluator: LazyEvaluator = (value) => ({
  done: true,
  hasNext: true,
  hasMany: true,
  next: [value, value],
});
