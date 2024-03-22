import { filter } from "./filter";
import { identity } from "./identity";
import { map } from "./map";
import { pipe } from "./pipe";

describe("runtime", () => {
  describe("data_first", () => {
    it("filter", () => {
      const result = filter([1, 2, 3], (x) => x % 2 === 1);
      expect(result).toEqual([1, 3]);
    });

    it("data_first with typescript guard", () => {
      const result = filter([1, 2, 3, "abc", true], isNumber);
      expect(result).toEqual([1, 2, 3]);
    });

    it("filter indexed", () => {
      const result = filter([1, 2, 3], (x, i) => x % 2 === 1 && i !== 1);
      expect(result).toEqual([1, 3]);
    });
  });

  describe("data_last", () => {
    it("filter", () => {
      const counter = vi.fn(identity);
      const result = pipe(
        [1, 2, 3],
        filter((x) => x % 2 === 1),
        map(counter),
      );
      expect(counter).toHaveBeenCalledTimes(2);
      expect(result).toEqual([1, 3]);
    });

    it("filter with typescript guard", () => {
      const counter = vi.fn(identity);
      const result = pipe(
        [1, 2, 3, false, "text"],
        filter(isNumber),
        map(counter),
      );
      expect(counter).toHaveBeenCalledTimes(3);
      expect(result).toEqual([1, 2, 3]);
    });

    it("filter indexed", () => {
      const counter = vi.fn(identity);
      const result = pipe(
        [1, 2, 3],
        filter((x, i) => x % 2 === 1 && i !== 1),
        map(counter),
      );
      expect(counter).toHaveBeenCalledTimes(2);
      expect(result).toEqual([1, 3]);
    });
  });
});

describe("typing", () => {
  describe("data_first", () => {
    it("filter", () => {
      const result = filter([1, 2, 3] as const, (x) => x % 2 === 1);
      expectTypeOf(result).toEqualTypeOf<Array<1 | 2 | 3>>();
    });

    it("data_first with typescript guard", () => {
      const result = filter([1, 2, 3, "abc", true] as const, isNumber);
      expectTypeOf(result).toEqualTypeOf<Array<1 | 2 | 3>>();
    });

    it("filter indexed", () => {
      const result = filter(
        [1, 2, 3] as const,
        (x, i) => x % 2 === 1 && i !== 1,
      );
      expectTypeOf(result).toEqualTypeOf<Array<1 | 2 | 3>>();
    });
  });

  describe("data_last", () => {
    it("filter", () => {
      const result = pipe(
        [1, 2, 3] as const,
        filter((x) => x % 2 === 1),
      );
      expectTypeOf(result).toEqualTypeOf<Array<1 | 2 | 3>>();
    });

    it("filter with typescript guard", () => {
      const result = pipe([1, 2, 3, false, "text"] as const, filter(isNumber));
      expectTypeOf(result).toEqualTypeOf<Array<1 | 2 | 3>>();
    });

    it("filter indexed", () => {
      const result = pipe(
        [1, 2, 3] as const,
        filter((x, i) => x % 2 === 1 && i !== 1),
      );
      expectTypeOf(result).toEqualTypeOf<Array<1 | 2 | 3>>();
    });
  });
});

// TODO: The Remeda `isNumber` utility isn't narrowing our types correctly for
// our tests here.
const isNumber = <T>(x: T): x is Extract<T, number> => typeof x === "number";
