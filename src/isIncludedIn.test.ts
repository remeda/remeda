import { isIncludedIn } from "./isIncludedIn";
import { pipe } from "./pipe";

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

describe("typing", () => {
  it("throws on bad value types", () => {
    // @ts-expect-error [ts2322] - strings are not numbers
    isIncludedIn(1, ["yes", "no"]);
  });

  it("throws on non-overlapping (e.g. typo-proof)", () => {
    const myEnum = "cat" as "cat" | "dog";
    // @ts-expect-error [ts2322] - "doog" is a typo
    isIncludedIn(myEnum, ["doog"]);
  });

  describe("narrowing", () => {
    test("data is single literal, container is pure tuple === NARROWED", () => {
      const data = 1 as const;
      if (isIncludedIn(data, [1] as const)) {
        expectTypeOf(data).toEqualTypeOf<1>();
      } else {
        expectTypeOf(data).toBeNever();
      }
    });

    test("data is literal union, container is pure tuple === NARROWED", () => {
      const data = 1 as 1 | 2 | 3;
      if (isIncludedIn(data, [1] as const)) {
        expectTypeOf(data).toEqualTypeOf<1>();
      } else {
        expectTypeOf(data).toEqualTypeOf<2 | 3>();
      }
    });

    test("data is single literal, container is array === NOT NARROWED", () => {
      const data = 1 as const;
      if (isIncludedIn(data, [1] as Array<1>)) {
        expectTypeOf(data).toEqualTypeOf<1>();
      } else {
        expectTypeOf(data).toEqualTypeOf<1>();
      }
    });

    test("data is literal union, container is array === NOT NARROWED", () => {
      const data = 1 as 1 | 2 | 3;
      if (isIncludedIn(data, [1] as Array<1>)) {
        expectTypeOf(data).toEqualTypeOf<1 | 2 | 3>();
      } else {
        expectTypeOf(data).toEqualTypeOf<1 | 2 | 3>();
      }
    });

    test("data is primitive, container is pure tuple of typeof data === NOT NARROWED", () => {
      const data = 1 as number;
      if (isIncludedIn(data, [1] as [number])) {
        expectTypeOf(data).toEqualTypeOf<number>();
      } else {
        expectTypeOf(data).toEqualTypeOf<number>();
      }
    });

    test("data is primitive, container is array of typeof data === NOT NARROWED", () => {
      const data = 1 as number;
      if (isIncludedIn(data, [1] as Array<number>)) {
        expectTypeOf(data).toEqualTypeOf<number>();
      } else {
        expectTypeOf(data).toEqualTypeOf<number>();
      }
    });

    test("data is primitive, container is pure tuple of literals === NARROWED", () => {
      const data = 1 as number;
      if (isIncludedIn(data, [1] as const)) {
        expectTypeOf(data).toEqualTypeOf<1>();
      } else {
        expectTypeOf(data).toEqualTypeOf<number>();
      }
    });

    test("data is primitive, container is array of literals === NARROWED", () => {
      const data = 1 as number;
      if (isIncludedIn(data, [1] as Array<1>)) {
        expectTypeOf(data).toEqualTypeOf<1>();
      } else {
        expectTypeOf(data).toEqualTypeOf<number>();
      }
    });

    test("data is primitive union, container is pure tuple of literals === NARROWED", () => {
      const data = 1 as number | string;
      if (isIncludedIn(data, [1] as const)) {
        expectTypeOf(data).toEqualTypeOf<1>();
      } else {
        expectTypeOf(data).toEqualTypeOf<number | string>();
      }
    });

    test("data is primitive union, container is pure tuple of primitives === NOT NARROWED", () => {
      const data = 1 as number | string;
      if (isIncludedIn(data, [1] as [number])) {
        expectTypeOf(data).toEqualTypeOf<number | string>();
      } else {
        expectTypeOf(data).toEqualTypeOf<number | string>();
      }
    });

    test("data is primitive union, container is array of primitives === NOT NARROWED", () => {
      const data = 1 as number | string;
      if (isIncludedIn(data, [1] as Array<number>)) {
        expectTypeOf(data).toEqualTypeOf<number | string>();
      } else {
        expectTypeOf(data).toEqualTypeOf<number | string>();
      }
    });
  });

  describe("KNOWN ISSUES", () => {
    test("pure tuples with literal unions break typing", () => {
      const data = 1 as 1 | 2 | 3;
      if (!isIncludedIn(data, [1] as [1 | 2])) {
        // @ts-expect-error [ts2344] - Because we don't know if 1 or 2 is in the container, the rejected type should contain both of them!
        expectTypeOf(data).toEqualTypeOf<1 | 2 | 3>();
      }
    });
  });
});
