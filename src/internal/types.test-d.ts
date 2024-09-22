import type { EmptyObject, Tagged } from "type-fest";
import type {
  Deduped,
  EnumerableStringKeyedValueOf,
  EnumerableStringKeyOf,
  IfBoundedRecord,
  IterableContainer,
  NTuple,
  TupleParts,
} from "./types";

declare const SymbolFoo: unique symbol;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare const SymbolBar: unique symbol;

describe("ifBoundedRecord", () => {
  test("string", () => {
    expectTypeOf<
      IfBoundedRecord<Record<string, unknown>>
    >().toEqualTypeOf<false>();

    expectTypeOf<
      IfBoundedRecord<Partial<Record<string, unknown>>>
    >().toEqualTypeOf<false>();
  });

  test("number", () => {
    expectTypeOf<
      IfBoundedRecord<Record<number, unknown>>
    >().toEqualTypeOf<false>();

    expectTypeOf<
      IfBoundedRecord<Partial<Record<number, unknown>>>
    >().toEqualTypeOf<false>();
  });

  test("symbol", () => {
    expectTypeOf<
      IfBoundedRecord<Record<symbol, unknown>>
    >().toEqualTypeOf<false>();

    expectTypeOf<
      IfBoundedRecord<Partial<Record<symbol, unknown>>>
    >().toEqualTypeOf<false>();
  });

  test("union of string, number, symbol", () => {
    expectTypeOf<
      IfBoundedRecord<Record<number | string, unknown>>
    >().toEqualTypeOf<false>();

    expectTypeOf<
      IfBoundedRecord<Record<string | symbol, unknown>>
    >().toEqualTypeOf<false>();
  });

  test("string literals and their union", () => {
    expectTypeOf<IfBoundedRecord<Record<"a", unknown>>>().toEqualTypeOf<true>();

    expectTypeOf<
      IfBoundedRecord<Record<"a" | "b", unknown>>
    >().toEqualTypeOf<true>();
  });

  test("number literals and their union", () => {
    expectTypeOf<IfBoundedRecord<Record<1, unknown>>>().toEqualTypeOf<true>();

    expectTypeOf<
      IfBoundedRecord<Record<1 | 2, unknown>>
    >().toEqualTypeOf<true>();
  });

  test("symbol literals and their union", () => {
    expectTypeOf<
      IfBoundedRecord<Record<typeof SymbolFoo, unknown>>
    >().toEqualTypeOf<true>();

    expectTypeOf<
      IfBoundedRecord<Record<typeof SymbolBar | typeof SymbolFoo, unknown>>
    >().toEqualTypeOf<true>();
  });

  test("unions between string, number, symbol", () => {
    expectTypeOf<
      IfBoundedRecord<Record<"a" | 1, unknown>>
    >().toEqualTypeOf<true>();

    expectTypeOf<
      IfBoundedRecord<Record<typeof SymbolFoo | "a", unknown>>
    >().toEqualTypeOf<true>();

    expectTypeOf<
      IfBoundedRecord<Record<typeof SymbolFoo | 1, unknown>>
    >().toEqualTypeOf<true>();

    expectTypeOf<
      IfBoundedRecord<Record<typeof SymbolFoo | "a" | 1, unknown>>
    >().toEqualTypeOf<true>();

    expectTypeOf<
      IfBoundedRecord<{ 1: number } | { a: string; [SymbolFoo]: number }>
    >().toEqualTypeOf<true>();

    expectTypeOf<
      IfBoundedRecord<{ 1?: number } | { a?: string; [SymbolFoo]: number }>
    >().toEqualTypeOf<true>();
  });

  test("unions with unbounded types", () => {
    expectTypeOf<
      IfBoundedRecord<Record<number | "a", unknown>>
    >().toEqualTypeOf<false>();

    expectTypeOf<
      IfBoundedRecord<Record<string | 1, unknown>>
    >().toEqualTypeOf<false>();

    expectTypeOf<
      IfBoundedRecord<Record<1, unknown> | Record<string, unknown>>
    >().toEqualTypeOf<false>();
  });

  test("branded types", () => {
    expectTypeOf<
      IfBoundedRecord<Record<Tagged<string, symbol>, unknown>>
    >().toEqualTypeOf<false>();

    expectTypeOf<
      IfBoundedRecord<Record<Tagged<number, symbol>, unknown>>
    >().toEqualTypeOf<false>();
  });

  test("bounded template strings", () => {
    expectTypeOf<
      IfBoundedRecord<Record<`a_${1 | 2}`, unknown>>
    >().toEqualTypeOf<true>();

    expectTypeOf<
      IfBoundedRecord<Record<`${"a" | "b"}_${1 | 2}`, unknown>>
    >().toEqualTypeOf<true>();

    expectTypeOf<
      IfBoundedRecord<
        Record<`${1 | 2}_${1 | 2}_${1 | 2}_${1 | 2}_${1 | 2}`, unknown>
      >
    >().toEqualTypeOf<true>();
  });

  test("unbounded template strings", () => {
    expectTypeOf<
      IfBoundedRecord<Record<`a_${number}`, unknown>>
    >().toEqualTypeOf<false>();

    expectTypeOf<
      IfBoundedRecord<Record<`${"a" | "b"}_${number}`, unknown>>
    >().toEqualTypeOf<false>();

    expectTypeOf<
      IfBoundedRecord<Record<`a_${string}`, unknown>>
    >().toEqualTypeOf<false>();

    expectTypeOf<
      IfBoundedRecord<
        Record<`${string}_${number}_${string}_${number}_${string}`, unknown>
      >
    >().toEqualTypeOf<false>();
  });
});

describe("enumerableStringKeyOf", () => {
  test("string keys", () => {
    expectTypeOf<
      EnumerableStringKeyOf<Record<string, unknown>>
    >().toEqualTypeOf<string>();
  });

  test("number keys", () => {
    expectTypeOf<
      EnumerableStringKeyOf<Record<number, unknown>>
    >().toEqualTypeOf<`${number}`>();
  });

  test("union of records", () => {
    expectTypeOf<
      EnumerableStringKeyOf<
        Record<`prefix_${string}`, unknown> | Record<number, unknown>
      >
    >().toEqualTypeOf<`${number}` | `prefix_${string}`>();
  });

  test("union keys", () => {
    expectTypeOf<
      EnumerableStringKeyOf<Record<number | `prefix_${string}`, unknown>>
    >().toEqualTypeOf<`${number}` | `prefix_${string}`>();
  });

  test("symbol keys", () => {
    expectTypeOf<
      EnumerableStringKeyOf<Record<string | symbol, unknown>>
    >().toEqualTypeOf<string>();

    expectTypeOf<
      EnumerableStringKeyOf<{ [SymbolFoo]: number; a: unknown }>
    >().toEqualTypeOf<"a">();

    expectTypeOf<
      EnumerableStringKeyOf<Record<string | typeof SymbolFoo, unknown>>
    >().toEqualTypeOf<string>();
  });

  test("optional keys", () => {
    expectTypeOf<
      EnumerableStringKeyOf<{ a: unknown; b?: unknown }>
    >().toEqualTypeOf<"a" | "b">();
  });

  test("branded types", () => {
    expectTypeOf<
      EnumerableStringKeyOf<Record<Tagged<string, symbol>, unknown>>
    >().toEqualTypeOf<`${Tagged<string, symbol>}`>();
  });
});

describe("enumerableStringKeyedValueOf", () => {
  test("string values", () => {
    expectTypeOf<
      EnumerableStringKeyedValueOf<Record<PropertyKey, string>>
    >().toEqualTypeOf<string>();
  });

  test("number values", () => {
    expectTypeOf<
      EnumerableStringKeyedValueOf<Record<PropertyKey, number>>
    >().toEqualTypeOf<number>();
  });

  test("union of records", () => {
    expectTypeOf<
      EnumerableStringKeyedValueOf<
        Record<PropertyKey, "cat"> | Record<PropertyKey, "dog">
      >
    >().toEqualTypeOf<"cat" | "dog">();

    expectTypeOf<
      EnumerableStringKeyedValueOf<
        Record<PropertyKey, number> | Record<PropertyKey, string>
      >
    >().toEqualTypeOf<number | string>();
  });

  test("union values", () => {
    expectTypeOf<
      EnumerableStringKeyedValueOf<Record<PropertyKey, number | string>>
    >().toEqualTypeOf<number | string>();
  });

  test("literal values", () => {
    expectTypeOf<EnumerableStringKeyedValueOf<{ a: 1 }>>().toEqualTypeOf<1>();

    expectTypeOf<
      EnumerableStringKeyedValueOf<{ a: "1" | "2" | 1 }>
    >().toEqualTypeOf<"1" | "2" | 1>();
  });

  test("optional values", () => {
    expectTypeOf<EnumerableStringKeyedValueOf<{ a: 1; b?: 4 }>>().toEqualTypeOf<
      1 | 4
    >();

    expectTypeOf<
      EnumerableStringKeyedValueOf<{ a: string; b?: number }>
    >().toEqualTypeOf<number | string>();
  });

  test("nullish and undefined values", () => {
    expectTypeOf<
      EnumerableStringKeyedValueOf<{
        a: string | undefined;
        b: string | null;
      }>
    >().toEqualTypeOf<string | null | undefined>();

    expectTypeOf<
      EnumerableStringKeyedValueOf<{
        a?: number | null;
        b?: number | null | undefined;
      }>
    >().toEqualTypeOf<number | null | undefined>();
  });

  test("symbol keys", () => {
    expectTypeOf<
      EnumerableStringKeyedValueOf<{ [SymbolFoo]: string }>
    >().toEqualTypeOf<never>();

    expectTypeOf<
      EnumerableStringKeyedValueOf<{ [SymbolFoo]: string; b: "1" }>
    >().toEqualTypeOf<"1">();

    expectTypeOf<
      EnumerableStringKeyedValueOf<
        Record<PropertyKey | typeof SymbolFoo, string>
      >
    >().toEqualTypeOf<string>();
  });

  test("empty object", () => {
    expectTypeOf<
      EnumerableStringKeyedValueOf<EmptyObject>
    >().toEqualTypeOf<never>();
  });
});

describe("nTuple", () => {
  test("size 0", () => {
    const result = nTuple("foo", 0);
    expectTypeOf(result).toEqualTypeOf<[]>();
  });

  test("non-trivial size", () => {
    const result = nTuple("foo", 3);
    expectTypeOf(result).toEqualTypeOf<[string, string, string]>();
  });
});

describe("tupleParts", () => {
  describe("mutable", () => {
    test("empty array", () => {
      const data = [] as [];
      const result = tupleParts(data);
      expectTypeOf(result).toEqualTypeOf<{
        prefix: [];
        item: never;
        suffix: [];
      }>();
    });

    test("regular array", () => {
      const data = [] as Array<number>;
      const result = tupleParts(data);
      expectTypeOf(result).toEqualTypeOf<{
        prefix: [];
        item: number;
        suffix: [];
      }>();
    });

    test("fixed tuple", () => {
      const data = [1, 2, 3] as [1, 2, 3];
      const result = tupleParts(data);
      expectTypeOf(result).toEqualTypeOf<{
        prefix: [1, 2, 3];
        item: never;
        suffix: [];
      }>();
    });

    test("array with prefix", () => {
      const data = ["a"] as [string, ...Array<boolean>];
      const result = tupleParts(data);
      expectTypeOf(result).toEqualTypeOf<{
        prefix: [string];
        item: boolean;
        suffix: [];
      }>();
    });

    test("array with suffix", () => {
      const data = ["a"] as [...Array<boolean>, string];
      const result = tupleParts(data);
      expectTypeOf(result).toEqualTypeOf<{
        prefix: [];
        item: boolean;
        suffix: [string];
      }>();
    });

    test("array with prefix and suffix", () => {
      const data = [1, "a"] as [number, ...Array<boolean>, string];
      const result = tupleParts(data);
      expectTypeOf(result).toEqualTypeOf<{
        prefix: [number];
        item: boolean;
        suffix: [string];
      }>();
    });
  });

  describe("readonly", () => {
    test("empty array", () => {
      const data = [] as const;
      const result = tupleParts(data);
      expectTypeOf(result).toEqualTypeOf<{
        prefix: [];
        item: never;
        suffix: [];
      }>();
    });

    test("regular array", () => {
      const data = [] as ReadonlyArray<number>;
      const result = tupleParts(data);
      expectTypeOf(result).toEqualTypeOf<{
        prefix: [];
        item: number;
        suffix: [];
      }>();
    });

    test("fixed tuple", () => {
      const data = [1, 2, 3] as const;
      const result = tupleParts(data);
      expectTypeOf(result).toEqualTypeOf<{
        prefix: [1, 2, 3];
        item: never;
        suffix: [];
      }>();
    });

    test("array with prefix", () => {
      const data = ["a"] as readonly [string, ...Array<boolean>];
      const result = tupleParts(data);
      expectTypeOf(result).toEqualTypeOf<{
        prefix: [string];
        item: boolean;
        suffix: [];
      }>();
    });

    test("array with suffix", () => {
      const data = ["a"] as readonly [...Array<boolean>, string];
      const result = tupleParts(data);
      expectTypeOf(result).toEqualTypeOf<{
        prefix: [];
        item: boolean;
        suffix: [string];
      }>();
    });

    test("array with prefix and suffix", () => {
      const data = [1, "a"] as readonly [number, ...Array<boolean>, string];
      const result = tupleParts(data);
      expectTypeOf(result).toEqualTypeOf<{
        prefix: [number];
        item: boolean;
        suffix: [string];
      }>();
    });
  });

  describe("unions", () => {
    test("union of arrays", () => {
      const data = [] as Array<boolean> | Array<number>;
      const result = tupleParts(data);
      expectTypeOf(result).toEqualTypeOf<
        | { prefix: []; item: boolean; suffix: [] }
        | { prefix: []; item: number; suffix: [] }
      >();
    });

    test("mixed unions", () => {
      const data = [] as Array<boolean> | [number, string];
      const result = tupleParts(data);
      expectTypeOf(result).toEqualTypeOf<
        | { prefix: []; item: boolean; suffix: [] }
        | { prefix: [number, string]; item: never; suffix: [] }
      >();
    });
  });
});

describe("deDupped", () => {
  describe("mutable", () => {
    test("empty array", () => {
      const result = deduped([] as []);
      expectTypeOf(result).toEqualTypeOf<[]>();
    });

    test("simple array", () => {
      const result = deduped([1, 2, 3] as Array<number>);
      expectTypeOf(result).toEqualTypeOf<Array<number>>();
    });

    test("array with prefix", () => {
      const result = deduped(["a"] as [string, ...Array<number>]);
      expectTypeOf(result).toEqualTypeOf<[string, ...Array<number>]>();
    });

    test("array with suffix", () => {
      const result = deduped(["a"] as [...Array<number>, string]);
      expectTypeOf(result).toEqualTypeOf<
        [number | string, ...Array<number | string>]
      >();
    });

    test("array with both prefix and suffix", () => {
      const result = deduped(["a", true] as [
        string,
        ...Array<number>,
        boolean,
      ]);
      expectTypeOf(result).toEqualTypeOf<
        [string, ...Array<boolean | number>]
      >();
    });

    test("union of arrays", () => {
      const result = deduped(["a"] as
        | [number, ...Array<number>]
        | [string, ...Array<string>]);
      expectTypeOf(result).toEqualTypeOf<
        [number, ...Array<number>] | [string, ...Array<string>]
      >();
    });
  });

  describe("readonly", () => {
    test("empty array", () => {
      const result = deduped([] as const);
      expectTypeOf(result).toEqualTypeOf<[]>();
    });

    test("simple array", () => {
      const result = deduped([1, 2, 3] as ReadonlyArray<number>);
      expectTypeOf(result).toEqualTypeOf<Array<number>>();
    });

    test("array with prefix", () => {
      const result = deduped(["a"] as readonly [string, ...Array<number>]);
      expectTypeOf(result).toEqualTypeOf<[string, ...Array<number>]>();
    });

    test("array with suffix", () => {
      const result = deduped(["a"] as readonly [...Array<number>, string]);
      expectTypeOf(result).toEqualTypeOf<
        [number | string, ...Array<number | string>]
      >();
    });

    test("array with both prefix and suffix", () => {
      const result = deduped(["a", true] as readonly [
        string,
        ...Array<number>,
        boolean,
      ]);
      expectTypeOf(result).toEqualTypeOf<
        [string, ...Array<boolean | number>]
      >();
    });

    test("union of arrays", () => {
      const result = deduped(["a"] as
        | readonly [number, ...Array<number>]
        | readonly [string, ...Array<string>]);
      expectTypeOf(result).toEqualTypeOf<
        [number, ...Array<number>] | [string, ...Array<string>]
      >();
    });

    test("constant tuple", () => {
      const result = deduped([1, 2, 3] as const);
      expectTypeOf(result).toEqualTypeOf<[1, ...Array<2 | 3>]>();
    });
  });
});

declare function nTuple<T, N extends number>(x: T, n: N): NTuple<T, N>;

declare function tupleParts<T>(x: T): TupleParts<T>;

declare function deduped<T extends IterableContainer>(data: T): Deduped<T>;
