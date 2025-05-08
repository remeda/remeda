import type { IterableContainer } from "./IterableContainer";
import type { TupleParts } from "./TupleParts";

declare function tupleParts<T extends IterableContainer>(x: T): TupleParts<T>;

describe("mutable", () => {
  test("empty array", () => {
    const result = tupleParts([] as []);

    expectTypeOf(result).toEqualTypeOf<{
      required: [];
      optional: [];
      item: never;
      suffix: [];
    }>();
  });

  test("regular array", () => {
    const result = tupleParts([] as Array<number>);

    expectTypeOf(result).toEqualTypeOf<{
      required: [];
      optional: [];
      item: number;
      suffix: [];
    }>();
  });

  test("trivial tuple", () => {
    const result = tupleParts([1, 2, 3] as [1, 2, 3]);

    expectTypeOf(result).toEqualTypeOf<{
      required: [1, 2, 3];
      optional: [];
      item: never;
      suffix: [];
    }>();
  });

  test("array with prefix", () => {
    const result = tupleParts(["a"] as [string, ...Array<boolean>]);

    expectTypeOf(result).toEqualTypeOf<{
      required: [string];
      optional: [];
      item: boolean;
      suffix: [];
    }>();
  });

  test("array with suffix", () => {
    const result = tupleParts(["a"] as [...Array<boolean>, string]);

    expectTypeOf(result).toEqualTypeOf<{
      required: [];
      optional: [];
      item: boolean;
      suffix: [string];
    }>();
  });

  test("array with prefix and suffix", () => {
    const result = tupleParts([1, "a"] as [number, ...Array<boolean>, string]);

    expectTypeOf(result).toEqualTypeOf<{
      required: [number];
      optional: [];
      item: boolean;
      suffix: [string];
    }>();
  });

  test("optional tuple", () => {
    const result = tupleParts([] as [number?]);

    expectTypeOf(result).toEqualTypeOf<{
      required: [];
      optional: [number | undefined];
      item: never;
      suffix: [];
    }>();
  });

  test("optional and rest tuple", () => {
    const result = tupleParts([] as [number?, ...Array<string>]);

    expectTypeOf(result).toEqualTypeOf<{
      required: [];
      optional: [number | undefined];
      item: string;
      suffix: [];
    }>();
  });

  test("optional and rest tuple with same type", () => {
    const result = tupleParts([] as [number?, ...Array<number>]);

    expectTypeOf(result).toEqualTypeOf<{
      required: [];
      optional: [number | undefined];
      item: number;
      suffix: [];
    }>();
  });

  test("required and optional array", () => {
    const result = tupleParts([1] as [number, number?]);

    expectTypeOf(result).toEqualTypeOf<{
      required: [number];
      optional: [number | undefined];
      item: never;
      suffix: [];
    }>();
  });

  test("undefined required item", () => {
    const result = tupleParts([undefined] as [number | undefined]);

    expectTypeOf(result).toEqualTypeOf<{
      required: [number | undefined];
      optional: [];
      item: never;
      suffix: [];
    }>();
  });

  test("undefined optional item", () => {
    const result = tupleParts([undefined] as [(number | undefined)?]);

    expectTypeOf(result).toEqualTypeOf<{
      required: [];
      optional: [number | undefined];
      item: never;
      suffix: [];
    }>();
  });

  test("required, optional, and rest param", () => {
    const result = tupleParts([1, "a"] as [number, string?, ...Array<boolean>]);

    expectTypeOf(result).toEqualTypeOf<{
      required: [number];
      optional: [string | undefined];
      item: boolean;
      suffix: [];
    }>();
  });
});

describe("readonly", () => {
  test("empty array", () => {
    const result = tupleParts([] as const);

    expectTypeOf(result).toEqualTypeOf<{
      required: [];
      optional: [];
      item: never;
      suffix: [];
    }>();
  });

  test("regular array", () => {
    const result = tupleParts([] as ReadonlyArray<number>);

    expectTypeOf(result).toEqualTypeOf<{
      required: [];
      optional: [];
      item: number;
      suffix: [];
    }>();
  });

  test("fixed tuple", () => {
    const result = tupleParts([1, 2, 3] as const);

    expectTypeOf(result).toEqualTypeOf<{
      required: [1, 2, 3];
      optional: [];
      item: never;
      suffix: [];
    }>();
  });

  test("array with prefix", () => {
    const result = tupleParts(["a"] as readonly [string, ...Array<boolean>]);

    expectTypeOf(result).toEqualTypeOf<{
      required: [string];
      optional: [];
      item: boolean;
      suffix: [];
    }>();
  });

  test("array with suffix", () => {
    const result = tupleParts(["a"] as readonly [...Array<boolean>, string]);

    expectTypeOf(result).toEqualTypeOf<{
      required: [];
      optional: [];
      item: boolean;
      suffix: [string];
    }>();
  });

  test("array with prefix and suffix", () => {
    const result = tupleParts([1, "a"] as readonly [
      number,
      ...Array<boolean>,
      string,
    ]);

    expectTypeOf(result).toEqualTypeOf<{
      required: [number];
      optional: [];
      item: boolean;
      suffix: [string];
    }>();
  });

  test("optional tuple", () => {
    const result = tupleParts([] as readonly [number?]);

    expectTypeOf(result).toEqualTypeOf<{
      required: [];
      optional: [number | undefined];
      item: never;
      suffix: [];
    }>();
  });

  test("optional and rest tuple", () => {
    const result = tupleParts([] as readonly [number?, ...Array<string>]);

    expectTypeOf(result).toEqualTypeOf<{
      required: [];
      optional: [number | undefined];
      item: string;
      suffix: [];
    }>();
  });

  test("optional and rest tuple with same type", () => {
    const result = tupleParts([] as readonly [number?, ...Array<number>]);

    expectTypeOf(result).toEqualTypeOf<{
      required: [];
      optional: [number | undefined];
      item: number;
      suffix: [];
    }>();
  });

  test("required and optional array", () => {
    const result = tupleParts([1] as readonly [number, number?]);

    expectTypeOf(result).toEqualTypeOf<{
      required: [number];
      optional: [number | undefined];
      item: never;
      suffix: [];
    }>();
  });

  test("undefined required item", () => {
    const result = tupleParts([undefined] as readonly [number | undefined]);

    expectTypeOf(result).toEqualTypeOf<{
      required: [number | undefined];
      optional: [];
      item: never;
      suffix: [];
    }>();
  });

  test("undefined optional item", () => {
    const result = tupleParts([undefined] as readonly [(number | undefined)?]);

    expectTypeOf(result).toEqualTypeOf<{
      required: [];
      optional: [number | undefined];
      item: never;
      suffix: [];
    }>();
  });

  test("required, optional, and rest param", () => {
    const result = tupleParts([1, "a"] as readonly [
      number,
      string?,
      ...Array<boolean>,
    ]);

    expectTypeOf(result).toEqualTypeOf<{
      required: [number];
      optional: [string | undefined];
      item: boolean;
      suffix: [];
    }>();
  });
});

describe("unions", () => {
  test("union of arrays", () => {
    const result = tupleParts([] as Array<boolean> | Array<number>);

    expectTypeOf(result).toEqualTypeOf<
      | { required: []; optional: []; item: boolean; suffix: [] }
      | { required: []; optional: []; item: number; suffix: [] }
    >();
  });

  test("mixed unions", () => {
    const result = tupleParts([] as Array<boolean> | [number, string]);

    expectTypeOf(result).toEqualTypeOf<
      | { required: []; optional: []; item: boolean; suffix: [] }
      | {
          required: [number, string];
          optional: [];
          item: never;
          suffix: [];
        }
    >();
  });

  test("looks like an optional tuple", () => {
    const result = tupleParts([] as [] | [string | undefined]);

    expectTypeOf(result).toEqualTypeOf<
      | { required: []; optional: []; item: never; suffix: [] }
      | {
          required: [string | undefined];
          optional: [];
          item: never;
          suffix: [];
        }
    >();
  });

  test("union of equivalent optional tuples", () => {
    const result = tupleParts([] as [string?] | [(string | undefined)?]);

    expectTypeOf(result).toEqualTypeOf<{
      required: [];
      optional: [string | undefined];
      item: never;
      suffix: [];
    }>();
  });
});
