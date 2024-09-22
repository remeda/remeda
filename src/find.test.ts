import { find } from "./find";
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
    ).toEqual({ a: 1, b: 2 });
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
    ).toEqual({ a: 1, b: 2 });
  });
});

describe("data last", () => {
  test("find", () => {
    const counter = vi.fn((x: { readonly a: number; readonly b: number }) => x);

    const actual = pipe(
      [
        { a: 1, b: 1 },
        { a: 1, b: 2 },
        { a: 2, b: 1 },
        { a: 1, b: 3 },
      ],
      map(counter),
      find(({ b }) => b === 2),
    );

    expect(counter).toHaveBeenCalledTimes(2);
    expect(actual).toEqual({ a: 1, b: 2 });
  });

  test("indexed", () => {
    const counter = vi.fn((x: { readonly a: number; readonly b: number }) => x);

    const actual = pipe(
      [
        { a: 1, b: 1 },
        { a: 1, b: 2 },
        { a: 2, b: 1 },
        { a: 1, b: 3 },
      ],
      map(counter),
      find(({ b }, idx) => b === 2 && idx === 1),
    );
    expect(counter).toHaveBeenCalledTimes(2);
    expect(actual).toEqual({ a: 1, b: 2 });
  });
});
