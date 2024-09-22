import { filter } from "./filter";
import { isIncludedIn } from "./isIncludedIn";
import { isNot } from "./isNot";
import { map } from "./map";
import { pipe } from "./pipe";
import { take } from "./take";

describe("dataFirst", () => {
  test("empty containers", () => {
    expect(isIncludedIn(1, [])).toBe(false);
  });

  test("when contained", () => {
    expect(isIncludedIn(2, [1, 2, 3])).toBe(true);
  });

  test("when not contained", () => {
    expect(isIncludedIn(4, [1, 2, 3])).toBe(false);
  });

  it("works with strings", () => {
    expect(isIncludedIn("b", ["a", "b", "c"])).toBe(true);
  });

  it("only tests reference equality: (arrays)", () => {
    const arr = [1];

    expect(isIncludedIn([1], [arr])).toBe(false);
    expect(isIncludedIn(arr, [arr])).toBe(true);
  });

  it("only tests reference equality: (objects)", () => {
    const obj = { a: 1 };

    expect(isIncludedIn({ a: 1 }, [obj])).toBe(false);
    expect(isIncludedIn(obj, [obj])).toBe(true);
  });
});

describe("dataLast", () => {
  test("empty containers", () => {
    expect(pipe(1, isIncludedIn([]))).toBe(false);
  });

  test("when contained", () => {
    expect(pipe(2, isIncludedIn([1, 2, 3]))).toBe(true);
  });

  test("when not contained", () => {
    expect(pipe(4, isIncludedIn([1, 2, 3]))).toBe(false);
  });

  it("works with strings", () => {
    expect(pipe("b", isIncludedIn(["a", "b", "c"]))).toBe(true);
  });

  it("only tests reference equality: (arrays)", () => {
    const arr = [1];

    expect(pipe([1], isIncludedIn([arr]))).toBe(false);
    expect(pipe(arr, isIncludedIn([arr]))).toBe(true);
  });

  it("only tests reference equality: (objects)", () => {
    const obj = { a: 1 };

    expect(pipe({ a: 1 }, isIncludedIn([obj]))).toBe(false);
    expect(pipe(obj, isIncludedIn([obj]))).toBe(true);
  });

  describe("dataLast memoization", () => {
    it("returns correct result when called multiple times with the same container", () => {
      const isIncludedInContainer = isIncludedIn([1, 2, 3]);

      expect(isIncludedInContainer(2)).toBe(true);
      expect(isIncludedInContainer(4)).toBe(false);
    });

    it("returns correct result when called with different containers", () => {
      const isIncludedInContainer1 = isIncludedIn([1, 2, 3]);
      const isIncludedInContainer2 = isIncludedIn([4, 5, 6]);

      expect(isIncludedInContainer1(2)).toBe(true);
      expect(isIncludedInContainer2(2)).toBe(false);
      expect(isIncludedInContainer1(4)).toBe(false);
      expect(isIncludedInContainer2(4)).toBe(true);
    });

    it("does not leak information between invocations", () => {
      const container = [1, 2, 3];

      const isIncludedInContainer = isIncludedIn(container);

      expect(isIncludedInContainer(2)).toBe(true);
      expect(isIncludedInContainer(4)).toBe(false);

      // Modifying the original container should not affect the memoized function
      container.push(4);

      expect(isIncludedInContainer(2)).toBe(true);
      expect(isIncludedInContainer(4)).toBe(false);
    });
  });
});

// These tests are copy-pasted and adapted from existing tests of functions
// that have been deprecated and removed from in v2. They validate that we
// provide replacements for deprecated v1 functions. After v2 is out for a while
// they could be removed.
describe("legacy v1 replacements", () => {
  describe("difference", () => {
    describe("data_first", () => {
      test("should return difference", () => {
        expect(filter([1, 2, 3, 4], isNot(isIncludedIn([2, 5, 3])))).toEqual([
          1, 4,
        ]);
      });
    });

    describe("data_last", () => {
      test("should return difference", () => {
        expect(filter(isNot(isIncludedIn([2, 5, 3])))([1, 2, 3, 4])).toEqual([
          1, 4,
        ]);
      });

      test("lazy", () => {
        const count = vi.fn();
        const result = pipe(
          [1, 2, 3, 4, 5, 6],
          map((x) => {
            count();
            return x;
          }),
          filter(isNot(isIncludedIn([2, 3]))),
          take(2),
        );

        expect(count).toHaveBeenCalledTimes(4);
        expect(result).toEqual([1, 4]);
      });
    });
  });

  describe("intersection", () => {
    describe("data_first", () => {
      test("intersection", () => {
        expect(filter([1, 2, 3], isIncludedIn([2, 3, 5]))).toEqual([2, 3]);
      });
    });

    describe("data_last", () => {
      test("intersection", () => {
        expect(filter(isIncludedIn([2, 3, 5]))([1, 2, 3])).toEqual([2, 3]);
      });
    });
  });
});
