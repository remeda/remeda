import type { IterableContainer } from "./IterableContainer";
import type { TupleSplits } from "./TupleSplits";

declare function tupleSplits<T extends IterableContainer>(x: T): TupleSplits<T>;

describe("mutable", () => {
  test("empty array", () => {
    const data = [] as [];
    const result = tupleSplits(data);
    expectTypeOf(result).toEqualTypeOf<{
      left: [];
      right: [];
    }>();
  });

  test("regular array", () => {
    const data = [] as Array<number>;
    const result = tupleSplits(data);
    expectTypeOf(result).toEqualTypeOf<
      | {
          left: [];
          right: Array<number>;
        }
      | {
          left: Array<number>;
          right: Array<number>;
        }
      | {
          left: Array<number>;
          right: [];
        }
    >();
  });

  test("fixed tuple", () => {
    const data = [1, 2, 3] as [1, 2, 3];
    const result = tupleSplits(data);
    expectTypeOf(result).toEqualTypeOf<
      | {
          left: [1, 2, 3];
          right: [];
        }
      | {
          left: [1, 2];
          right: [3];
        }
      | {
          left: [1];
          right: [2, 3];
        }
      | {
          left: [];
          right: [1, 2, 3];
        }
    >();
  });

  test("array with prefix", () => {
    const data = ["a"] as [string, ...Array<boolean>];
    const result = tupleSplits(data);
    expectTypeOf(result).toEqualTypeOf<
      | {
          left: [];
          right: [string, ...Array<boolean>];
        }
      | {
          left: [string];
          right: Array<boolean>;
        }
      | {
          left: [string, ...Array<boolean>];
          right: Array<boolean>;
        }
      | {
          left: [string, ...Array<boolean>];
          right: [];
        }
    >();
  });

  test("array with suffix", () => {
    const data = ["a"] as [...Array<boolean>, string];
    const result = tupleSplits(data);
    expectTypeOf(result).toEqualTypeOf<
      | {
          left: [];
          right: [...Array<boolean>, string];
        }
      | {
          left: Array<boolean>;
          right: [...Array<boolean>, string];
        }
      | {
          left: Array<boolean>;
          right: [string];
        }
      | {
          left: [...Array<boolean>, string];
          right: [];
        }
    >();
  });

  test("array with prefix and suffix", () => {
    const data = [1, "a"] as [number, ...Array<boolean>, string];
    const result = tupleSplits(data);
    expectTypeOf(result).toEqualTypeOf<
      | {
          left: [];
          right: [number, ...Array<boolean>, string];
        }
      | {
          left: [number];
          right: [...Array<boolean>, string];
        }
      | {
          left: [number, ...Array<boolean>];
          right: [...Array<boolean>, string];
        }
      | {
          left: [number, ...Array<boolean>];
          right: [string];
        }
      | {
          left: [number, ...Array<boolean>, string];
          right: [];
        }
    >();
  });

  test("array with optional prefixes", () => {
    const data = [1, "a"] as [number, string?, number?, ...Array<boolean>];
    const result = tupleSplits(data);
    expectTypeOf(result).toEqualTypeOf<
      | {
          left: [];
          right: [number, string?, number?, ...Array<boolean>];
        }
      | {
          left: [number];
          right: [string?, number?, ...Array<boolean>];
        }
      | {
          left: [number, string?];
          right: [number?, ...Array<boolean>];
        }
      | {
          left: [number, string?, number?];
          right: [...Array<boolean>];
        }
      | {
          left: [number, string?, number?, ...Array<boolean>];
          right: Array<boolean>;
        }
      | {
          left: [number, string?, number?, ...Array<boolean>];
          right: [];
        }
    >();
  });
});

describe("unions", () => {
  test("union of arrays", () => {
    const data = [] as Array<boolean> | Array<number>;
    const result = tupleSplits(data);
    expectTypeOf(result).toEqualTypeOf<
      | {
          left: [];
          right: Array<boolean>;
        }
      | {
          left: Array<boolean>;
          right: Array<boolean>;
        }
      | {
          left: Array<boolean>;
          right: [];
        }
      | {
          left: [];
          right: Array<number>;
        }
      | {
          left: Array<number>;
          right: Array<number>;
        }
      | {
          left: Array<number>;
          right: [];
        }
    >();
  });

  test("mixed unions", () => {
    const data = [] as Array<boolean> | [number, string];
    const result = tupleSplits(data);
    expectTypeOf(result).toEqualTypeOf<
      | {
          left: [];
          right: Array<boolean>;
        }
      | {
          left: Array<boolean>;
          right: Array<boolean>;
        }
      | {
          left: Array<boolean>;
          right: [];
        }
      | {
          left: [];
          right: [number, string];
        }
      | {
          left: [number];
          right: [string];
        }
      | {
          left: [number, string];
          right: [];
        }
    >();
  });
});
