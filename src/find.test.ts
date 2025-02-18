import { find } from "./find";
import { identity } from "./identity";
import { map } from "./map";
import { pipe } from "./pipe";

describe("data first", () => {
  test("find", () => {
    expect(
      find(
        [
          { a: 1, b: 1 },
          { a: 1, b: 2 },
          { a: 2, b: 1 },
          { a: 1, b: 3 },
        ],
        ({ b }) => b === 2,
      ),
    ).toStrictEqual({ a: 1, b: 2 });
  });

  test("indexed", () => {
    expect(
      find(
        [
          { a: 1, b: 1 },
          { a: 1, b: 2 },
          { a: 2, b: 1 },
          { a: 1, b: 3 },
        ],
        ({ b }, idx) => b === 2 && idx === 1,
      ),
    ).toStrictEqual({ a: 1, b: 2 });
  });
});

describe("data last", () => {
  test("find", () => {
    const data = [
      { a: 1, b: 1 },
      { a: 1, b: 2 },
      { a: 2, b: 1 },
      { a: 1, b: 3 },
    ] as const;

    const counter =
      vi.fn<(x: (typeof data)[number]) => (typeof data)[number]>(identity());

    const actual = pipe(
      data,
      map(counter),
      find(({ b }) => b === 2),
    );

    expect(counter).toHaveBeenCalledTimes(2);
    expect(actual).toStrictEqual({ a: 1, b: 2 });
  });

  test("indexed", () => {
    const data = [
      { a: 1, b: 1 },
      { a: 1, b: 2 },
      { a: 2, b: 1 },
      { a: 1, b: 3 },
    ] as const;

    const counter =
      vi.fn<(x: (typeof data)[number]) => (typeof data)[number]>(identity());

    const actual = pipe(
      data,
      map(counter),
      find(({ b }, idx) => b === 2 && idx === 1),
    );

    expect(counter).toHaveBeenCalledTimes(2);
    expect(actual).toStrictEqual({ a: 1, b: 2 });
  });
});
