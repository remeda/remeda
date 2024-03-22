import { isNumber } from "./isNumber";
import { partition } from "./partition";
import { pipe } from "./pipe";

describe("runtime", () => {
  describe("data first", () => {
    test("partition", () => {
      expect(
        partition(
          [
            { a: 1, b: 1 },
            { a: 1, b: 2 },
            { a: 2, b: 1 },
            { a: 1, b: 3 },
          ],
          ({ a }) => a === 1,
        ),
      ).toEqual([
        [
          { a: 1, b: 1 },
          { a: 1, b: 2 },
          { a: 1, b: 3 },
        ],
        [{ a: 2, b: 1 }],
      ]);
    });

    test("partition with type guard", () => {
      expect(partition([1, "a", 2, "b"], isNumber)).toEqual([
        [1, 2],
        ["a", "b"],
      ]);
    });

    test("partition with type guard in pipe", () => {
      expect(
        pipe(
          [1, "a", 2, "b"],
          partition((value): value is number => typeof value === "number"),
        ),
      ).toEqual([
        [1, 2],
        ["a", "b"],
      ]);
    });

    test("indexed", () => {
      expect(
        partition(
          [
            { a: 1, b: 1 },
            { a: 1, b: 2 },
            { a: 2, b: 1 },
            { a: 1, b: 3 },
          ],
          (_, index) => index !== 2,
        ),
      ).toEqual([
        [
          { a: 1, b: 1 },
          { a: 1, b: 2 },
          { a: 1, b: 3 },
        ],
        [{ a: 2, b: 1 }],
      ]);
    });
  });

  describe("data last", () => {
    test("partition", () => {
      expect(
        pipe(
          [
            { a: 1, b: 1 },
            { a: 1, b: 2 },
            { a: 2, b: 1 },
            { a: 1, b: 3 },
          ],
          partition(({ a }) => a === 1),
        ),
      ).toEqual([
        [
          { a: 1, b: 1 },
          { a: 1, b: 2 },
          { a: 1, b: 3 },
        ],
        [{ a: 2, b: 1 }],
      ]);
    });

    test("indexed", () => {
      expect(
        pipe(
          [
            { a: 1, b: 1 },
            { a: 1, b: 2 },
            { a: 2, b: 1 },
            { a: 1, b: 3 },
          ],
          partition((_, index) => index !== 2),
        ),
      ).toEqual([
        [
          { a: 1, b: 1 },
          { a: 1, b: 2 },
          { a: 1, b: 3 },
        ],
        [{ a: 2, b: 1 }],
      ]);
    });
  });
});

describe("typing", () => {
  test("partition with type guard", () => {
    const actual = partition([1, "a", 2, "b"], isNumber);
    expectTypeOf(actual).toEqualTypeOf<[Array<number>, Array<string>]>();
  });

  test("partition with type guard in pipe", () => {
    const actual = pipe(
      [1, "a", 2, "b"],
      partition((value): value is number => typeof value === "number"),
    );
    expectTypeOf(actual).toEqualTypeOf<[Array<number>, Array<string>]>();
  });
});
