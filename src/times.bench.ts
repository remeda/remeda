import { bench } from "vitest";
import { identity } from "./identity";

const BENCH_OPTIONS = { iterations: 5000 };

const mapper = identity();

describe.each([[10], [100], [1000], [10_000], [-10], [10.5]])(
  "length %d",
  (length) => {
    bench(
      "sparse array, no checks",
      () => {
        try {
          sparseArray(length, mapper);
        } catch {
          // do nothing
        }
      },
      BENCH_OPTIONS,
    );

    bench(
      "preconstructed array",
      () => {
        try {
          preconstructedArray(length, mapper);
        } catch {
          // do nothing
        }
      },
      BENCH_OPTIONS,
    );

    bench(
      "empty array with index access",
      () => {
        try {
          emptyArrayWithIndexAccess(length, mapper);
        } catch {
          // do nothing
        }
      },
      BENCH_OPTIONS,
    );

    bench(
      "current impl, no check (empty array with push)",
      () => {
        try {
          currentImplementationNoRangeCheck(length, mapper);
        } catch {
          // do nothing
        }
      },
      BENCH_OPTIONS,
    );

    bench(
      "current implementation",
      () => {
        try {
          currentImplementation(length, mapper);
        } catch {
          // do nothing
        }
      },
      BENCH_OPTIONS,
    );

    bench(
      "sparse with negative check",
      () => {
        try {
          sparseArrayWithCheck(length, mapper);
        } catch {
          // do nothing
        }
      },
      BENCH_OPTIONS,
    );

    bench(
      "sparse with floor",
      () => {
        try {
          sparseArrayWithFloor(length, mapper);
        } catch {
          // do nothing
        }
      },
      BENCH_OPTIONS,
    );

    bench(
      "sparse with checked floor",
      () => {
        try {
          sparseArrayWithCheckedFloor(length, mapper);
        } catch {
          // do nothing
        }
      },
      BENCH_OPTIONS,
    );

    bench(
      "sparse with safe checked floor",
      () => {
        try {
          sparseArrayWithSafeCheckedFloor(length, mapper);
        } catch {
          // do nothing
        }
      },
      BENCH_OPTIONS,
    );
  },
);

function preconstructedArray<T>(
  length: number,
  fn: (n: number) => T,
): Array<T> {
  const res = Array.from<T>({ length });

  for (let i = 0; i < length; i++) {
    res[i] = fn(i);
  }

  return res;
}

function emptyArrayWithIndexAccess<T>(
  count: number,
  fn: (n: number) => T,
): Array<T> {
  const res: Array<T> = [];
  for (let i = 0; i < count; i++) {
    res[i] = fn(i);
  }
  return res;
}

function currentImplementation<T>(
  count: number,
  fn: (n: number) => T,
): Array<T> {
  if (count < 0) {
    throw new RangeError("n must be a non-negative number");
  }

  const res = [];
  for (let i = 0; i < count; i++) {
    res.push(fn(i));
  }

  return res;
}

function currentImplementationNoRangeCheck<T>(
  count: number,
  fn: (n: number) => T,
): Array<T> {
  const res = [];
  for (let i = 0; i < count; i++) {
    res.push(fn(i));
  }

  return res;
}

function sparseArray<T>(count: number, fn: (n: number) => T): Array<T> {
  // eslint-disable-next-line unicorn/no-new-array
  const res = new Array<T>(count);

  for (let i = 0; i < count; i++) {
    res[i] = fn(i);
  }

  return res;
}

function sparseArrayWithCheck<T>(
  count: number,
  fn: (n: number) => T,
): Array<T> {
  if (count < 0) {
    return [];
  }

  // eslint-disable-next-line unicorn/no-new-array
  const res = new Array<T>(count);

  for (let i = 0; i < count; i++) {
    res[i] = fn(i);
  }

  return res;
}

function sparseArrayWithFloor<T>(
  count: number,
  fn: (n: number) => T,
): Array<T> {
  if (count < 0) {
    return [];
  }

  // eslint-disable-next-line unicorn/no-new-array
  const res = new Array<T>(Math.floor(count));

  for (let i = 0; i < count; i++) {
    res[i] = fn(i);
  }

  return res;
}

function sparseArrayWithCheckedFloor<T>(
  count: number,
  fn: (n: number) => T,
): Array<T> {
  if (count < 0) {
    return [];
  }

  // eslint-disable-next-line unicorn/no-new-array
  const res = new Array<T>(Number.isInteger(count) ? count : Math.floor(count));

  for (let i = 0; i < count; i++) {
    res[i] = fn(i);
  }

  return res;
}

function sparseArrayWithSafeCheckedFloor<T>(
  count: number,
  fn: (n: number) => T,
): Array<T> {
  if (count < 0) {
    return [];
  }

  // eslint-disable-next-line unicorn/no-new-array
  const res = new Array<T>(
    Number.isSafeInteger(count) ? count : Math.floor(count),
  );

  for (let i = 0; i < count; i++) {
    res[i] = fn(i);
  }

  return res;
}
