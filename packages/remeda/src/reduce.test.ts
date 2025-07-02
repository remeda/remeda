import { describe, expect, test } from "vitest";
import { pipe } from "./pipe";
import { reduce } from "./reduce";

describe("data first", () => {
  test("reduce", () => {
    expect(reduce([1, 2, 3, 4, 5], (acc, x) => acc + x, 100)).toBe(115);
  });

  test("indexed", () => {
    const data = [1, 2, 3, 4, 5];
    let i = 0;

    expect(
      reduce(
        data,
        (acc, x, index, items) => {
          expect(index).toBe(i);
          expect(items).toBe(data);

          i += 1;
          return acc + x;
        },
        100,
      ),
    ).toBe(115);
  });
});

describe("data last", () => {
  test("reduce", () => {
    expect(
      pipe(
        [1, 2, 3, 4, 5],
        reduce((acc, x) => acc + x, 100),
      ),
    ).toBe(115);
  });
});
