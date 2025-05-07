import type { ConditionalArray } from "./ConditionalArray";
import type { IterableContainer } from "./IterableContainer";

declare function conditionalArray<T extends IterableContainer, const C>(
  data: T,
  condition: C,
): ConditionalArray<T, C>;

test("empty array", () => {
  const result = conditionalArray([], "" as string);

  expectTypeOf(result).toEqualTypeOf<[]>();
});

test("empty readonly array", () => {
  const result = conditionalArray([] as const, "" as string);

  expectTypeOf(result).toEqualTypeOf<[]>();
});

describe("condition is a primitive", () => {
  test("primitive array", () => {
    const result = conditionalArray([] as Array<string>, "" as string);

    expectTypeOf(result).toEqualTypeOf<Array<string>>();
  });

  test("primitive readonly array", () => {
    const result = conditionalArray([] as ReadonlyArray<string>, "" as string);

    expectTypeOf(result).toEqualTypeOf<Array<string>>();
  });

  test("union of primitives array", () => {
    const result = conditionalArray(
      [] as Array<string | number | boolean>,
      "" as string,
    );

    expectTypeOf(result).toEqualTypeOf<Array<string>>();
  });

  test("union of primitives readonly array", () => {
    const result = conditionalArray(
      [] as ReadonlyArray<string | number | boolean>,
      "" as string,
    );

    expectTypeOf(result).toEqualTypeOf<Array<string>>();
  });

  test("array of literals", () => {
    const result = conditionalArray([] as Array<"hello">, "" as string);

    expectTypeOf(result).toEqualTypeOf<Array<"hello">>();
  });

  test("readonly array of literals", () => {
    const result = conditionalArray([] as ReadonlyArray<"hello">, "" as string);

    expectTypeOf(result).toEqualTypeOf<Array<"hello">>();
  });

  test("array with a union of literals", () => {
    const result = conditionalArray(
      [] as Array<"hello" | 3 | true>,
      "" as string,
    );

    expectTypeOf(result).toEqualTypeOf<Array<"hello">>();
  });

  test("readonly array with a union of literals", () => {
    const result = conditionalArray(
      [] as ReadonlyArray<"hello" | 3 | true>,
      "" as string,
    );

    expectTypeOf(result).toEqualTypeOf<Array<"hello">>();
  });

  test("tuple of primitives", () => {
    const result = conditionalArray(
      [1, "hello", true] as [number, string, boolean],
      "" as string,
    );

    expectTypeOf(result).toEqualTypeOf<[string]>();
  });

  test("readonly tuple of primitives", () => {
    const result = conditionalArray(
      [1, "hello", true] as readonly [number, string, boolean],
      "" as string,
    );

    expectTypeOf(result).toEqualTypeOf<[string]>();
  });

  test("tuple of literals", () => {
    const result = conditionalArray(
      [1, "hello", true] as [1, "hello", true],
      "" as string,
    );

    expectTypeOf(result).toEqualTypeOf<["hello"]>();
  });

  test("readonly tuple of literals", () => {
    const result = conditionalArray([1, "hello", true] as const, "" as string);

    expectTypeOf(result).toEqualTypeOf<["hello"]>();
  });

  test("complex tuple of primitives, filtered on the prefix", () => {
    const result = conditionalArray(
      ["hello", 3] as [string, ...Array<boolean>, number],
      "" as string,
    );

    expectTypeOf(result).toEqualTypeOf<[string]>();
  });

  test("complex tuple of primitives, filtered on the rest", () => {
    const result = conditionalArray(
      [true, 3] as [boolean, ...Array<string>, number],
      "" as string,
    );

    expectTypeOf(result).toEqualTypeOf<Array<string>>();
  });

  test("complex tuple of primitives, filtered on the suffix", () => {
    const result = conditionalArray(
      [true, "hello"] as [boolean, ...Array<number>, string],
      "" as string,
    );

    expectTypeOf(result).toEqualTypeOf<[string]>();
  });

  test("tuple with unions of literals", () => {
    const result = conditionalArray(
      ["hello", "foo"] as ["hello" | "world", "foo" | "bar"],
      "" as string,
    );

    expectTypeOf(result).toEqualTypeOf<
      ["hello", "foo"] | ["world", "foo"] | ["hello", "bar"] | ["world", "bar"]
    >();
  });

  test("complex tuple with union of literals", () => {
    const result = conditionalArray(
      ["prefix", "suffix"] as [
        "prefix" | 123,
        ...Array<"rest" | true>,
        "suffix" | Date,
      ],
      "" as string,
    );

    expectTypeOf(result).toEqualTypeOf<
      | Array<"rest">
      | [...Array<"rest">, "suffix"]
      | ["prefix", ...Array<"rest">]
      | ["prefix", ...Array<"rest">, "suffix"]
    >();
  });

  test("disjoint types", () => {
    const result = conditionalArray([] as Array<number>, "" as string);

    expectTypeOf(result).toEqualTypeOf<[]>();
  });
});

describe("condition is a literal", () => {
  test("array with matching literal", () => {
    const result = conditionalArray([] as Array<string>, "hello");

    expectTypeOf(result).toEqualTypeOf<Array<"hello">>();
  });

  test("array with literal union including the condition", () => {
    const result = conditionalArray([] as Array<"hello" | "world">, "hello");

    expectTypeOf(result).toEqualTypeOf<Array<"hello">>();
  });

  test("array with no matching literals", () => {
    const result = conditionalArray([] as Array<"world" | "goodbye">, "hello");

    expectTypeOf(result).toEqualTypeOf<[]>();
  });

  test("tuple with matching and non-matching literals", () => {
    const result = conditionalArray(
      ["hello", "world", "hello"] as ["hello", "world", "hello"],
      "hello",
    );

    expectTypeOf(result).toEqualTypeOf<["hello", "hello"]>();
  });

  test("readonly tuple with matching literal", () => {
    const result = conditionalArray(
      ["hello", "world", "hello"] as const,
      "hello",
    );

    expectTypeOf(result).toEqualTypeOf<["hello", "hello"]>();
  });

  test("complex tuple with matching literal in rest position", () => {
    const result = conditionalArray(
      ["start", "hello", "hello", "end"] as [
        "start",
        ...Array<"hello" | "world">,
        "end",
      ],
      "hello",
    );

    expectTypeOf(result).toEqualTypeOf<Array<"hello">>();
  });
});

describe("condition is a simple object", () => {
  test("array of matching objects", () => {
    const result = conditionalArray(
      [] as Array<{ a: string }>,
      { a: "" } as { a: string },
    );

    expectTypeOf(result).toEqualTypeOf<Array<{ a: string }>>();
  });

  test("array of objects with matching and additional properties", () => {
    const result = conditionalArray(
      [] as Array<{ a: string; b: number }>,
      { a: "" } as { a: string },
    );

    expectTypeOf(result).toEqualTypeOf<Array<{ a: string; b: number }>>();
  });

  test("array with mixed types including matching objects", () => {
    const result = conditionalArray(
      [] as Array<{ a: string } | string | number>,
      { a: "" } as { a: string },
    );

    expectTypeOf(result).toEqualTypeOf<Array<{ a: string }>>();
  });

  test("tuple with mixed types including matching objects", () => {
    const result = conditionalArray(
      [""] as [{ a: string } | string | number],
      { a: "" } as { a: string },
    );

    expectTypeOf(result).toEqualTypeOf<[] | [{ a: string }]>();
  });

  test("array with no matching objects", () => {
    const result = conditionalArray(
      [] as Array<{ b: string } | string>,
      { a: "" } as { a: string },
    );

    expectTypeOf(result).toEqualTypeOf<[]>();
  });

  test("tuple with matching and non-matching objects", () => {
    const result = conditionalArray(
      [{ a: "value" }, { a: "hello" }, { b: 42 }, { a: "hello", c: true }] as [
        { a: string },
        { a: "hello" },
        { b: number },
        { a: string; c: boolean },
      ],
      { a: "" } as { a: string },
    );

    expectTypeOf(result).toEqualTypeOf<
      [{ a: string }, { a: "hello" }, { a: string; c: boolean }]
    >();
  });
});

describe("condition is a complex object", () => {
  test("array of exactly matching objects", () => {
    const result = conditionalArray(
      [] as Array<{ a: "hello"; b?: number }>,
      { a: "hello" } as { a: "hello"; b?: number },
    );

    expectTypeOf(result).toEqualTypeOf<Array<{ a: "hello"; b?: number }>>();
  });

  test("array of objects with compatible literal property", () => {
    const result = conditionalArray(
      [] as Array<{ a: "hello" | "world"; b?: number }>,
      { a: "hello" } as { a: "hello"; b?: number },
    );

    expectTypeOf(result).toEqualTypeOf<Array<{ a: "hello"; b?: number }>>();
  });

  test("array of objects with incompatible literal property", () => {
    const result = conditionalArray(
      [] as Array<{ a: "world"; b?: number }>,
      { a: "hello" } as { a: "hello"; b?: number },
    );

    expectTypeOf(result).toEqualTypeOf<[]>();
  });

  test("array of objects missing optional property", () => {
    const result = conditionalArray(
      [] as Array<{ a: "hello" }>,
      { a: "hello" } as { a: "hello"; b?: number },
    );

    expectTypeOf(result).toEqualTypeOf<Array<{ a: "hello" }>>();
  });

  test("array with mixed types including matching objects", () => {
    const result = conditionalArray(
      [] as Array<{ a: "hello"; b: number } | { a: "world" } | string>,
      { a: "hello" } as { a: "hello"; b?: number },
    );

    expectTypeOf(result).toEqualTypeOf<Array<{ a: "hello"; b: number }>>();
  });

  test("tuple with mixed complex objects", () => {
    const result = conditionalArray(
      [{ a: "hello" }, { a: "world" }, { a: "hello", b: 42 }] as [
        { a: "hello" },
        { a: "world" },
        { a: "hello"; b: number },
      ],
      { a: "hello" } as { a: "hello"; b?: number },
    );

    expectTypeOf(result).toEqualTypeOf<
      [{ a: "hello" }, { a: "hello"; b: number }]
    >();
  });

  test("partial matches", () => {
    const result = conditionalArray(
      [
        { a: "hello" },
        { a: "world" },
        { b: "hello" },
        { b: "world" },
        { a: "hello", b: "world" },
        { a: "hello", b: "world", c: 1234 },
      ] as const,
      { a: "hello", b: "world" } as { a: "hello"; b: "world" },
    );

    expectTypeOf(result).toEqualTypeOf<
      [
        { readonly a: "hello"; readonly b: "world" },
        { readonly a: "hello"; readonly b: "world"; readonly c: 1234 },
      ]
    >();
  });

  test("condition value with union of literals", () => {
    const result = conditionalArray(
      [
        { a: "hello" },
        { b: "world" },
        { a: "hello", b: "world" },
        { a: "world" },
      ] as const,
      { a: "hello" } as { a: "hello" | "world" },
    );

    expectTypeOf(result).toEqualTypeOf<
      [
        { readonly a: "hello" },
        { readonly a: "hello"; readonly b: "world" },
        { readonly a: "world" },
      ]
    >();
  });
});

describe("condition is an array or primitives", () => {
  test("array of string arrays", () => {
    const result = conditionalArray(
      [] as Array<Array<string>>,
      [] as Array<string>,
    );

    expectTypeOf(result).toEqualTypeOf<Array<Array<string>>>();
  });

  test("array of mixed array types", () => {
    const result = conditionalArray(
      [] as Array<Array<string> | Array<number> | Array<boolean>>,
      [] as Array<string>,
    );

    expectTypeOf(result).toEqualTypeOf<Array<Array<string>>>();
  });

  test("array containing compatible array types", () => {
    const result = conditionalArray(
      [] as Array<Array<string | number> | Array<boolean>>,
      [] as Array<string>,
    );

    expectTypeOf(result).toEqualTypeOf<Array<Array<string>>>();
  });

  test("tuple containing arrays", () => {
    const result = conditionalArray(
      [["a", "b"], [1, 2], ["c"]] as [
        Array<string>,
        Array<number>,
        Array<string>,
      ],
      [] as Array<string>,
    );

    expectTypeOf(result).toEqualTypeOf<[Array<string>, Array<string>]>();
  });

  test("complex tuple with arrays in rest position", () => {
    const result = conditionalArray(
      [["a"], ["b"], ["c"]] as [
        Array<string>,
        ...Array<Array<string> | Array<number>>,
      ],
      [] as Array<string>,
    );

    expectTypeOf(result).toEqualTypeOf<
      [Array<string>, ...Array<Array<string>>]
    >();
  });
});

describe("condition is a readonly array of primitives", () => {
  test("array of readonly string arrays", () => {
    const result = conditionalArray(
      [] as Array<ReadonlyArray<string>>,
      [] as ReadonlyArray<string>,
    );

    expectTypeOf(result).toEqualTypeOf<Array<ReadonlyArray<string>>>();
  });

  test("array of mixed readonly and mutable arrays", () => {
    const result = conditionalArray(
      [] as Array<ReadonlyArray<string> | Array<string>>,
      [] as ReadonlyArray<string>,
    );

    expectTypeOf(result).toEqualTypeOf<
      Array<ReadonlyArray<string> | Array<string>>
    >();
  });

  test("array with non-matching readonly arrays", () => {
    const result = conditionalArray(
      [] as Array<ReadonlyArray<number>>,
      [] as ReadonlyArray<string>,
    );

    expectTypeOf(result).toEqualTypeOf<[]>();
  });

  test("tuple containing readonly arrays", () => {
    const result = conditionalArray(
      [["a"] as const, [1, 2], ["c"] as const] as [
        ReadonlyArray<string>,
        Array<number>,
        ReadonlyArray<string>,
      ],
      [] as ReadonlyArray<string>,
    );

    expectTypeOf(result).toEqualTypeOf<
      [ReadonlyArray<string>, ReadonlyArray<string>]
    >();
  });
});

describe("condition is an array of literals", () => {
  test("array of arrays of matching literals", () => {
    const result = conditionalArray(
      [] as Array<Array<"hello">>,
      [] as Array<"hello">,
    );

    expectTypeOf(result).toEqualTypeOf<Array<Array<"hello">>>();
  });

  test("array with mixed literal arrays", () => {
    const result = conditionalArray(
      [] as Array<Array<"hello"> | Array<"world">>,
      [] as Array<"hello">,
    );

    expectTypeOf(result).toEqualTypeOf<Array<Array<"hello">>>();
  });

  test("array with arrays containing unions of literals", () => {
    const result = conditionalArray(
      [] as Array<Array<"hello" | "world">>,
      [] as Array<"hello">,
    );

    expectTypeOf(result).toEqualTypeOf<Array<Array<"hello">>>();
  });

  test("tuple containing literal arrays", () => {
    const result = conditionalArray(
      [["hello", "hello"], ["world"], ["hello"]] as [
        Array<"hello">,
        Array<"world">,
        Array<"hello">,
      ],
      [] as Array<"hello">,
    );

    expectTypeOf(result).toEqualTypeOf<[Array<"hello">, Array<"hello">]>();
  });

  test("readonly arrays of literals", () => {
    const result = conditionalArray(
      [["hello"], ["world"]] as [
        ReadonlyArray<"hello">,
        ReadonlyArray<"world">,
      ],
      [] as Array<"hello">,
    );

    expectTypeOf(result).toEqualTypeOf<[]>();
  });
});

describe("condition is a tuple", () => {
  test("array of matching tuples", () => {
    const result = conditionalArray(
      [] as Array<[string, number]>,
      ["", 0] as [string, number],
    );

    expectTypeOf(result).toEqualTypeOf<Array<[string, number]>>();
  });

  test("array of compatible tuples", () => {
    const result = conditionalArray(
      [] as Array<["hello", 42]>,
      ["", 0] as [string, number],
    );

    expectTypeOf(result).toEqualTypeOf<Array<["hello", 42]>>();
  });

  test("array of incompatible tuples", () => {
    const result = conditionalArray(
      [] as Array<[number, string]>,
      ["", 0] as [string, number],
    );

    expectTypeOf(result).toEqualTypeOf<[]>();
  });

  test("array with mixed tuples and other types", () => {
    const result = conditionalArray(
      [] as Array<[string, number] | Array<string> | number>,
      ["", 0] as [string, number],
    );

    expectTypeOf(result).toEqualTypeOf<Array<[string, number]>>();
  });

  test("tuple containing different sized tuples", () => {
    const result = conditionalArray(
      [
        ["a", 1],
        [2, "b"],
        ["c", 3, true],
      ] as [[string, number], [number, string], [string, number, boolean]],
      ["", 0] as [string, number],
    );

    expectTypeOf(result).toEqualTypeOf<[[string, number]]>();
  });

  test("complex nested tuples", () => {
    const result = conditionalArray(
      [[["a", 1]], [["b", 2]]] as const,
      ["", 0] as [string, number],
    );

    expectTypeOf(result).toEqualTypeOf<[]>();
  });

  test("readonly tuples", () => {
    const result = conditionalArray(
      [
        ["a", 1],
        [2, "b"],
      ] as [readonly [string, number], readonly [number, string]],
      ["", 0] as [string, number],
    );

    expectTypeOf(result).toEqualTypeOf<[]>();
  });
});

describe("condition is a union of primitives", () => {
  test("array with elements matching multiple parts of the union", () => {
    const result = conditionalArray(
      [] as Array<string | number | boolean>,
      "" as string | number,
    );

    expectTypeOf(result).toEqualTypeOf<Array<string> | Array<number>>();
  });

  test("array with only one union member type", () => {
    const result = conditionalArray([] as Array<string>, "" as string | number);

    expectTypeOf(result).toEqualTypeOf<[] | Array<string>>();
  });

  test("tuple with mixed primitives", () => {
    const result = conditionalArray(
      ["hello", 42, true] as [string, number, boolean],
      "" as string | number,
    );

    expectTypeOf(result).toEqualTypeOf<[string] | [number]>();
  });

  test("tuple with literal types that extend union members", () => {
    const result = conditionalArray(
      ["hello", 42, true] as const,
      "" as string | number,
    );

    expectTypeOf(result).toEqualTypeOf<["hello"] | [42]>();
  });

  test("tuple with union of literals", () => {
    const result = conditionalArray(
      ["", "", 123] as [string | number, string | boolean, number | boolean],
      "cat" as string | number,
    );

    expectTypeOf(result).toEqualTypeOf<
      // @ts-expect-error [ts2344] -- FIXME! This is a bug, the result includes the empty array but that isn't possible because the condition would always be either a string or a number and the first element would always be either string or a number so it would always be present in the result.
      [string] | [number] | [string, string] | [number, number]
    >();
  });
});

describe("condition is a union of literals", () => {
  test("array with elements matching any part of the union", () => {
    const result = conditionalArray(
      ["cat", "dog", "fish"] as Array<string>,
      "cat" as "cat" | "dog",
    );

    expectTypeOf(result).toEqualTypeOf<Array<"cat"> | Array<"dog">>();
  });

  test("array with union literals only", () => {
    const result = conditionalArray(
      [] as Array<"cat" | "dog" | "fish">,
      "cat" as "cat" | "dog",
    );

    expectTypeOf(result).toEqualTypeOf<Array<"cat"> | Array<"dog">>();
  });

  test("tuple with mixed elements", () => {
    const result = conditionalArray(
      ["cat", "fish", "dog"] as const,
      "cat" as "cat" | "dog",
    );

    expectTypeOf(result).toEqualTypeOf<["cat"] | ["dog"]>();
  });

  test("tuple with union of literals", () => {
    const result = conditionalArray(
      ["cat", "cat", "dog"] as ["cat" | "dog", "cat" | "foo", "dog" | "bar"],
      "cat" as "cat" | "dog",
    );

    expectTypeOf(result).toEqualTypeOf<
      // @ts-expect-error [ts2344] -- FIXME! This is a bug, the result includes the empty array but that isn't possible because the condition would always be either "cat" or "dog" and the first element would always be either "cat" or "dog" so it would always be present in the result.
      ["cat"] | ["dog"] | ["cat", "cat"] | ["dog", "dog"]
    >();
  });
});

describe("condition is a discriminated union", () => {
  test("array with discriminated union elements", () => {
    const result = conditionalArray(
      [] as Array<{ a: "cat"; b: number } | { a: "dog"; c: boolean }>,
      { a: "cat" } as { a: "cat" } | { a: "dog" },
    );

    expectTypeOf(result).toEqualTypeOf<
      Array<{ a: "cat"; b: number }> | Array<{ a: "dog"; c: boolean }>
    >();
  });

  test("tuple with mixed discriminated types", () => {
    const result = conditionalArray(
      [
        { a: "cat", b: 1 },
        { a: "dog", c: true },
        { a: "cat", b: 2 },
      ] as const,
      { a: "cat" } as { a: "cat" } | { a: "dog" },
    );

    expectTypeOf(result).toEqualTypeOf<
      | [
          { readonly a: "cat"; readonly b: 1 },
          { readonly a: "cat"; readonly b: 2 },
        ]
      | [{ readonly a: "dog"; readonly c: true }]
    >();
  });

  test("filtering with discriminator only", () => {
    const result = conditionalArray(
      [] as Array<{ a: "cat"; b: number } | { a: "dog"; c: boolean }>,
      { a: "cat" } as { a: "cat" | "dog" },
    );

    expectTypeOf(result).toEqualTypeOf<
      // @ts-expect-error [ts2344] -- FIXME! This is a bug, The result is 2 different arrays and not a single array with both types possible in it.
      Array<{ a: "cat"; b: number }> | Array<{ a: "dog"; c: boolean }>
    >();
  });
});

describe("disjoint object types ({ a: string } | { b: number })", () => {
  test("array with disjoint union elements", () => {
    const result = conditionalArray(
      [] as Array<{ a: string } | { b: number }>,
      { a: "" } as { a: string } | { b: number },
    );

    expectTypeOf(result).toEqualTypeOf<
      Array<{ a: string }> | Array<{ b: number }>
    >();
  });

  test("filtering for only one variant", () => {
    const result = conditionalArray(
      [] as Array<{ a: string } | { b: number }>,
      { a: "" } as { a: string },
    );

    expectTypeOf(result).toEqualTypeOf<Array<{ a: string }>>();
  });

  test("array with objects having both properties", () => {
    const result = conditionalArray(
      [] as Array<{ a: string } | { b: number } | { a: string; b: number }>,
      { a: "" } as { a: string } | { b: number },
    );

    expectTypeOf(result).toEqualTypeOf<
      | Array<{ a: string } | { a: string; b: number }>
      | Array<{ b: number } | { a: string; b: number }>
    >();
  });

  test("tuple with mixed disjoint types", () => {
    const result = conditionalArray(
      [{ a: "hello" }, { b: 42 }, { a: "world", b: 123 }] as const,
      { b: 0 } as { a: string } | { b: number },
    );

    expectTypeOf(result).toEqualTypeOf<
      | [{ readonly b: 42 }, { readonly a: "world"; readonly b: 123 }]
      | [{ readonly a: "hello" }, { readonly a: "world"; readonly b: 123 }]
    >();
  });
});

describe("complex nested union conditions", () => {
  test("union of arrays", () => {
    const result = conditionalArray(
      [["a"], [1], ["b"]] as [Array<string>, Array<number>, Array<string>],
      [] as Array<string> | Array<number>,
    );

    expectTypeOf(result).toEqualTypeOf<
      [Array<string>, Array<string>] | [Array<number>]
    >();
  });

  test("union of tuples with different structures", () => {
    const result = conditionalArray(
      [
        ["a", 1],
        [true, "b"],
        [42, "c"],
      ] as [[string, number], [boolean, string], [number, string]],
      ["", 0] as [string, number] | [boolean, string],
    );

    expectTypeOf(result).toEqualTypeOf<
      [[string, number]] | [[boolean, string]]
    >();
  });
});
