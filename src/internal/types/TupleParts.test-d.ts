import type { TupleParts } from "./TupleParts";

declare function tupleParts<T>(x: T): TupleParts<T>;

describe("mutable", () => {
  test("empty array", () => {
    const data = [] as [];
    const result = tupleParts(data);

    expectTypeOf(result).toEqualTypeOf<{
      prefix: [];
      required: [];
      optional: [];
      item: never;
      suffix: [];
    }>();
  });

  test("regular array", () => {
    const data = [] as Array<number>;
    const result = tupleParts(data);

    expectTypeOf(result).toEqualTypeOf<{
      prefix: [];
      required: [];
      optional: [];
      item: number;
      suffix: [];
    }>();
  });

  test("fixed tuple", () => {
    const data = [1, 2, 3] as [1, 2, 3];
    const result = tupleParts(data);

    expectTypeOf(result).toEqualTypeOf<{
      prefix: [1, 2, 3];
      required: [1, 2, 3];
      optional: [];
      item: never;
      suffix: [];
    }>();
  });

  test("array with prefix", () => {
    const data = ["a"] as [string, ...Array<boolean>];
    const result = tupleParts(data);

    expectTypeOf(result).toEqualTypeOf<{
      prefix: [string];
      required: [string];
      optional: [];
      item: boolean;
      suffix: [];
    }>();
  });

  test("array with suffix", () => {
    const data = ["a"] as [...Array<boolean>, string];
    const result = tupleParts(data);

    expectTypeOf(result).toEqualTypeOf<{
      prefix: [];
      required: [];
      optional: [];
      item: boolean;
      suffix: [string];
    }>();
  });

  test("array with prefix and suffix", () => {
    const data = [1, "a"] as [number, ...Array<boolean>, string];
    const result = tupleParts(data);

    expectTypeOf(result).toEqualTypeOf<{
      prefix: [number];
      required: [number];
      optional: [];
      item: boolean;
      suffix: [string];
    }>();
  });

  test("array with optional prefixes", () => {
    const data = [1, "a"] as [number, string?, number?, ...Array<boolean>];
    const result = tupleParts(data);

    expectTypeOf(result).toEqualTypeOf<{
      prefix: [number, string?, number?];
      required: [number];
      optional: [string, number];
      item: boolean;
      suffix: [];
    }>();
  });
});

describe("readonly", () => {
  test("empty array", () => {
    const data = [] as const;
    const result = tupleParts(data);

    expectTypeOf(result).toEqualTypeOf<{
      prefix: [];
      required: [];
      optional: [];
      item: never;
      suffix: [];
    }>();
  });

  test("regular array", () => {
    const data = [] as ReadonlyArray<number>;
    const result = tupleParts(data);

    expectTypeOf(result).toEqualTypeOf<{
      prefix: [];
      required: [];
      optional: [];
      item: number;
      suffix: [];
    }>();
  });

  test("fixed tuple", () => {
    const data = [1, 2, 3] as const;
    const result = tupleParts(data);

    expectTypeOf(result).toEqualTypeOf<{
      prefix: [1, 2, 3];
      required: [1, 2, 3];
      optional: [];
      item: never;
      suffix: [];
    }>();
  });

  test("array with prefix", () => {
    const data = ["a"] as readonly [string, ...Array<boolean>];
    const result = tupleParts(data);

    expectTypeOf(result).toEqualTypeOf<{
      prefix: [string];
      required: [string];
      optional: [];
      item: boolean;
      suffix: [];
    }>();
  });

  test("array with suffix", () => {
    const data = ["a"] as readonly [...Array<boolean>, string];
    const result = tupleParts(data);

    expectTypeOf(result).toEqualTypeOf<{
      prefix: [];
      required: [];
      optional: [];
      item: boolean;
      suffix: [string];
    }>();
  });

  test("array with prefix and suffix", () => {
    const data = [1, "a"] as readonly [number, ...Array<boolean>, string];
    const result = tupleParts(data);

    expectTypeOf(result).toEqualTypeOf<{
      prefix: [number];
      required: [number];
      optional: [];
      item: boolean;
      suffix: [string];
    }>();
  });

  test("array with optional prefixes", () => {
    const data = [1, "a"] as readonly [
      number,
      string?,
      number?,
      ...Array<boolean>,
    ];
    const result = tupleParts(data);

    expectTypeOf(result).toEqualTypeOf<{
      prefix: [number, string?, number?];
      required: [number];
      optional: [string, number];
      item: boolean;
      suffix: [];
    }>();
  });
});

describe("unions", () => {
  test("union of arrays", () => {
    const data = [] as Array<boolean> | Array<number>;
    const result = tupleParts(data);

    expectTypeOf(result).toEqualTypeOf<
      | { prefix: []; required: []; optional: []; item: boolean; suffix: [] }
      | { prefix: []; required: []; optional: []; item: number; suffix: [] }
    >();
  });

  test("mixed unions", () => {
    const data = [] as Array<boolean> | [number, string];
    const result = tupleParts(data);

    expectTypeOf(result).toEqualTypeOf<
      | { prefix: []; required: []; optional: []; item: boolean; suffix: [] }
      | {
          prefix: [number, string];
          required: [number, string];
          optional: [];
          item: never;
          suffix: [];
        }
    >();
  });
});
