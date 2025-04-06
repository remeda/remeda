import { filter } from "./filter";
import { first } from "./first";
import { flat } from "./flat";
import { identity } from "./identity";
import { map } from "./map";
import { pipe } from "./pipe";
import { prop } from "./prop";
import { take } from "./take";
import { unfold } from "./internal/unfold";

it("should pass through data with 0 functions", () => {
  const data = { a: "hello", b: 123 };

  expect(pipe(data)).toBe(data);
});

it("should pipe a single operation", () => {
  const result = pipe(1, (x) => x * 2);

  expect(result).toBe(2);
});

it("should pipe operations", () => {
  const result = pipe(
    1,
    (x) => x * 2,
    (x) => x * 3,
  );

  expect(result).toBe(6);
});

describe("lazy", () => {
  it("lazy map + take", () => {
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

  it("lazy map + filter + take", () => {
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

  it("lazy after 1st op", () => {
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

  it("break lazy", () => {
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

  it("multiple take", () => {
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

  it("multiple lazy", () => {
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

  it("lazy early exit with hasMany", () => {
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

  test("with producer", () => {
    const results = pipe(
      0,
      unfold((x) => (x > 5 ? undefined : [x, x + 1])),
    );

    expect(results).toStrictEqual([0, 1, 2, 3, 4, 5]);
  });

  test("with two producers", () => {
    const results = pipe(
      0,
      unfold((x: number) => (x > 5 ? undefined : [x, x + 1])),
      unfold((x: ReadonlyArray<number>) =>
        x.length > 0 ? [x.length, x.slice(1)] : undefined,
      ),
    );

    expect(results).toStrictEqual([6, 5, 4, 3, 2, 1]);
  });

  test("with reducer", () => {
    const result = pipe([1, 2, 3], map(identity()), first());

    expect(result).toBe(1);
  });
});
