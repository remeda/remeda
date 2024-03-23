import { add } from "./add";
import { constant } from "./constant";
import { filter } from "./filter";
import { identity } from "./identity";
import { map } from "./map";
import { multiply } from "./multiply";
import { pipe } from "./pipe";
import { take } from "./take";

describe("runtime", () => {
  describe("data_first", () => {
    it("map", () => {
      expect(map([1, 2, 3], multiply(2))).toEqual([2, 4, 6]);
    });

    it("map indexed", () => {
      expect(map([0, 0, 0], (_, i) => i)).toEqual([0, 1, 2]);
    });
  });

  describe("data_last", () => {
    it("map", () => {
      expect(pipe([1, 2, 3], map(multiply(2)))).toEqual([2, 4, 6]);
    });

    it("map", () => {
      expect(
        pipe(
          [0, 0, 0],
          map((_, i) => i),
        ),
      ).toEqual([0, 1, 2]);
    });
  });

  describe("pipe", () => {
    it("invoked lazily", () => {
      const count = vi.fn(multiply(10));

      expect(pipe([1, 2, 3], map(count), take(2))).toEqual([10, 20]);

      expect(count).toHaveBeenCalledTimes(2);
    });

    it("invoked lazily (indexed)", () => {
      const count = vi.fn((_: unknown, index: number) => index);

      expect(pipe([0, 0, 0], map(count), take(2))).toEqual([0, 1]);

      expect(count).toHaveBeenCalledTimes(2);
    });

    it("indexed: check index and items", () => {
      const indexes1: Array<number> = [];
      const indexes2: Array<number> = [];
      const anyItems1: Array<Array<number>> = [];
      const anyItems2: Array<Array<number>> = [];

      expect(
        pipe(
          [1, 2, 3, 4, 5],
          map((x, i, items) => {
            anyItems1.push([...items]);
            indexes1.push(i);
            return x;
          }),
          filter((x) => x % 2 === 1),
          map((x, i, items) => {
            anyItems2.push([...items]);
            indexes2.push(i);
            return x;
          }),
        ),
      ).toEqual([1, 3, 5]);

      expect(indexes1).toEqual([0, 1, 2, 3, 4]);
      expect(indexes2).toEqual([0, 1, 2]);
      expect(anyItems1).toEqual([
        [1],
        [1, 2],
        [1, 2, 3],
        [1, 2, 3, 4],
        [1, 2, 3, 4, 5],
      ]);
      expect(anyItems2).toEqual([[1], [1, 3], [1, 3, 5]]);
    });
  });

  it("number array", () => {
    expect(map([1, 2, 3], add(1))).toEqual([2, 3, 4]);
  });

  it("mixed type tuple", () => {
    expect(map([1, "2", true], constant(1))).toEqual([1, 1, 1]);
  });

  it("complex variadic number array", () => {
    const input = [
      "hello",
      "world",
      1,
      "testing",
      "testing",
      "testing",
      123,
      true,
    ];
    expect(map(input, identity)).toEqual(input);
  });

  describe("Indexed", () => {
    it("number array", () => {
      expect(map([1, 2, 3], (x, index) => x + index)).toEqual([1, 3, 5]);
    });

    it("mixed type tuple", () => {
      expect(map([1, "2", true], (_, index) => index)).toEqual([0, 1, 2]);
    });
  });
});

describe("typing", () => {
  it("number array", () => {
    const result = map([1, 2, 3] as Array<number>, add(1));
    expectTypeOf(result).toEqualTypeOf<Array<number>>();
  });

  it("readonly number array", () => {
    const result = map([1, 2, 3] as ReadonlyArray<number>, add(1));
    expectTypeOf(result).toEqualTypeOf<Array<number>>();
  });

  it("number 3-tuple", () => {
    const result = map([1, 2, 3] as [number, number, number], add(1));
    expectTypeOf(result).toEqualTypeOf<[number, number, number]>();
  });

  it("readonly number 3-tuple", () => {
    const result = map([1, 2, 3] as readonly [number, number, number], add(1));
    expectTypeOf(result).toEqualTypeOf<[number, number, number]>();
  });

  it("named number 3-tuple", () => {
    const result = map(
      [1, 2, 3] as [item1: number, item2: number, item3: number],
      add(1),
    );
    // There's no way to test this, but notice that the names are copied to the
    // output here...
    expectTypeOf(result).toEqualTypeOf<
      [item1: number, item2: number, item3: number]
    >();
  });

  it("mixed type tuple", () => {
    const result = map(
      [1, "2", true] as [number, string, boolean],
      constant(1),
    );
    expectTypeOf(result).toEqualTypeOf<[number, number, number]>();
  });

  it("readonly mixed type tuple", () => {
    const result = map(
      [1, "2", true] as readonly [number, string, boolean],
      constant(1),
    );
    expectTypeOf(result).toEqualTypeOf<[number, number, number]>();
  });

  it("nonempty (tail) number array", () => {
    const result = map([1, 2, 3] as [number, ...Array<number>], add(1));
    expectTypeOf(result).toEqualTypeOf<[number, ...Array<number>]>();
  });

  it("nonempty (tail) readonly number array", () => {
    const result = map(
      [1, 2, 3] as readonly [number, ...Array<number>],
      add(1),
    );
    expectTypeOf(result).toEqualTypeOf<[number, ...Array<number>]>();
  });

  it("nonempty (head) number array", () => {
    const result = map([1, 2, 3] as [...Array<number>, number], add(1));
    expectTypeOf(result).toEqualTypeOf<[...Array<number>, number]>();
  });

  it("nonempty readonly (head) number array", () => {
    const result = map(
      [1, 2, 3] as readonly [...Array<number>, number],
      add(1),
    );
    expectTypeOf(result).toEqualTypeOf<[...Array<number>, number]>();
  });

  it("complex variadic number array", () => {
    const result = map(
      ["hello", "world", 1, "testing", "testing", "testing", 123, true] as [
        ...Array<"hello">,
        "world",
        ...Array<number>,
        string,
        ...Array<number>,
        boolean,
      ],
      identity,
    );
    expectTypeOf(result).toEqualTypeOf<
      [...Array<boolean | number | string>, boolean | number | string]
    >();
  });

  describe("Indexed", () => {
    it("number array", () => {
      const result = map([1, 2, 3] as Array<number>, (x, index) => x + index);
      expectTypeOf(result).toEqualTypeOf<Array<number>>();
    });

    it("readonly number array", () => {
      const result = map(
        [1, 2, 3] as ReadonlyArray<number>,
        (x, index) => x + index,
      );
      expectTypeOf(result).toEqualTypeOf<Array<number>>();
    });

    it("number 3-tuple", () => {
      const result = map(
        [1, 2, 3] as [number, number, number],
        (x, index) => x + index,
      );
      expectTypeOf(result).toEqualTypeOf<[number, number, number]>();
    });

    it("readonly number 3-tuple", () => {
      const result = map(
        [1, 2, 3] as readonly [number, number, number],
        (x, index) => x + index,
      );
      expectTypeOf(result).toEqualTypeOf<[number, number, number]>();
    });

    it("named number 3-tuple", () => {
      const result = map(
        [1, 2, 3] as [item1: number, item2: number, item3: number],
        (x, index) => x + index,
      );
      // There's no way to test this, but notice that the names are copied to the
      // output here...
      expectTypeOf(result).toEqualTypeOf<
        [item1: number, item2: number, item3: number]
      >();
    });

    it("mixed type tuple", () => {
      const result = map(
        [1, "2", true] as [number, string, boolean],
        (_, index) => index,
      );
      expectTypeOf(result).toEqualTypeOf<[number, number, number]>();
    });

    it("readonly mixed type tuple", () => {
      const result = map(
        [1, "2", true] as readonly [number, string, boolean],
        (_, index) => index,
      );
      expectTypeOf(result).toEqualTypeOf<[number, number, number]>();
    });

    it("nonempty (tail) number array", () => {
      const result = map(
        [1, 2, 3] as [number, ...Array<number>],
        (x, index) => x + index,
      );
      expectTypeOf(result).toEqualTypeOf<[number, ...Array<number>]>();
    });

    it("nonempty (tail) readonly number array", () => {
      const result = map(
        [1, 2, 3] as readonly [number, ...Array<number>],
        (x, index) => x + index,
      );
      expectTypeOf(result).toEqualTypeOf<[number, ...Array<number>]>();
    });

    it("nonempty (head) number array", () => {
      const result = map(
        [1, 2, 3] as [...Array<number>, number],
        (x, index) => x + index,
      );
      expectTypeOf(result).toEqualTypeOf<[...Array<number>, number]>();
    });

    it("nonempty readonly (head) number array", () => {
      const result = map(
        [1, 2, 3] as readonly [...Array<number>, number],
        (x, index) => x + index,
      );
      expectTypeOf(result).toEqualTypeOf<[...Array<number>, number]>();
    });
  });
});
