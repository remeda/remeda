import type { FilteredArray } from "./FilteredArray";
import type { IterableContainer } from "./IterableContainer";

declare function filteredArray<T extends IterableContainer, C>(
  data: T,
  condition: C,
): FilteredArray<T, C>;

test("empty array", () => {
  expectTypeOf(filteredArray([], "" as string)).toEqualTypeOf<[]>();
});

test("empty readonly array", () => {
  expectTypeOf(filteredArray([] as const, "" as string)).toEqualTypeOf<[]>();
});

describe("condition is a primitive", () => {
  test("primitive array", () => {
    expectTypeOf(
      filteredArray([] as Array<string>, "" as string),
    ).toEqualTypeOf<Array<string>>();
  });

  test("primitive readonly array", () => {
    expectTypeOf(
      filteredArray([] as ReadonlyArray<string>, "" as string),
    ).toEqualTypeOf<Array<string>>();
  });

  test("union of primitives array", () => {
    expectTypeOf(
      filteredArray([] as Array<string | number | boolean>, "" as string),
    ).toEqualTypeOf<Array<string>>();
  });

  test("union of primitives readonly array", () => {
    expectTypeOf(
      filteredArray(
        [] as ReadonlyArray<string | number | boolean>,
        "" as string,
      ),
    ).toEqualTypeOf<Array<string>>();
  });

  test("array of literals", () => {
    expectTypeOf(
      filteredArray([] as Array<"hello">, "" as string),
    ).toEqualTypeOf<Array<"hello">>();
  });

  test("readonly array of literals", () => {
    expectTypeOf(
      filteredArray([] as ReadonlyArray<"hello">, "" as string),
    ).toEqualTypeOf<Array<"hello">>();
  });

  test("array with a union of literals", () => {
    expectTypeOf(
      filteredArray([] as Array<"hello" | 3 | true>, "" as string),
    ).toEqualTypeOf<Array<"hello">>();
  });

  test("readonly array with a union of literals", () => {
    expectTypeOf(
      filteredArray([] as ReadonlyArray<"hello" | 3 | true>, "" as string),
    ).toEqualTypeOf<Array<"hello">>();
  });

  test("tuple of primitives", () => {
    expectTypeOf(
      filteredArray(
        [1, "hello", true] as [number, string, boolean],
        "" as string,
      ),
    ).toEqualTypeOf<[string]>();
  });

  test("readonly tuple of primitives", () => {
    expectTypeOf(
      filteredArray(
        [1, "hello", true] as readonly [number, string, boolean],
        "" as string,
      ),
    ).toEqualTypeOf<[string]>();
  });

  test("tuple of literals", () => {
    expectTypeOf(
      filteredArray([1, "hello", true] as [1, "hello", true], "" as string),
    ).toEqualTypeOf<["hello"]>();
  });

  test("readonly tuple of literals", () => {
    expectTypeOf(
      filteredArray([1, "hello", true] as const, "" as string),
    ).toEqualTypeOf<["hello"]>();
  });

  test("complex tuple of primitives, filtered on the prefix", () => {
    expectTypeOf(
      filteredArray(
        ["hello", 3] as [string, ...Array<boolean>, number],
        "" as string,
      ),
    ).toEqualTypeOf<[string]>();
  });

  test("complex tuple of primitives, filtered on the rest", () => {
    expectTypeOf(
      filteredArray(
        [true, 3] as [boolean, ...Array<string>, number],
        "" as string,
      ),
    ).toEqualTypeOf<Array<string>>();
  });

  test("complex tuple of primitives, filtered on the suffix", () => {
    expectTypeOf(
      filteredArray(
        [true, "hello"] as [boolean, ...Array<number>, string],
        "" as string,
      ),
    ).toEqualTypeOf<[string]>();
  });

  test("tuple with unions of literals", () => {
    expectTypeOf(
      filteredArray(
        ["hello", "foo"] as ["hello" | "world", "foo" | "bar"],
        "" as string,
      ),
    ).toEqualTypeOf<
      ["hello", "foo"] | ["world", "foo"] | ["hello", "bar"] | ["world", "bar"]
    >();
  });

  test("complex tuple with union of literals", () => {
    expectTypeOf(
      filteredArray(
        ["prefix", "suffix"] as [
          "prefix" | 123,
          ...Array<"rest" | true>,
          "suffix" | Date,
        ],
        "" as string,
      ),
    ).toEqualTypeOf<
      | Array<"rest">
      | [...Array<"rest">, "suffix"]
      | ["prefix", ...Array<"rest">]
      | ["prefix", ...Array<"rest">, "suffix"]
    >();
  });

  test("disjoint types", () => {
    expectTypeOf(
      filteredArray([] as Array<number>, "" as string),
    ).toEqualTypeOf<[]>();
  });
});

describe("condition is a literal", () => {
  test("array with matching literal", () => {
    expectTypeOf(
      filteredArray([] as Array<string>, "hello" as const),
    ).toEqualTypeOf<Array<"hello">>();
  });

  test("array with literal union including the condition", () => {
    expectTypeOf(
      filteredArray([] as Array<"hello" | "world">, "hello" as const),
    ).toEqualTypeOf<Array<"hello">>();
  });

  test("array with no matching literals", () => {
    expectTypeOf(
      filteredArray([] as Array<"world" | "goodbye">, "hello" as const),
    ).toEqualTypeOf<[]>();
  });

  test("tuple with primitive types", () => {
    expectTypeOf(
      filteredArray(
        ["hello", 1, "world"] as [string, number, string],
        "hello" as const,
      ),
    ).toEqualTypeOf<[] | ["hello"] | ["hello", "hello"]>();
  });

  test("tuple with matching and non-matching literals", () => {
    expectTypeOf(
      filteredArray(
        ["hello", "world", "hello"] as ["hello", "world", "hello"],
        "hello" as const,
      ),
    ).toEqualTypeOf<["hello", "hello"]>();
  });

  test("readonly tuple with matching literal", () => {
    expectTypeOf(
      filteredArray(["hello", "world", "hello"] as const, "hello" as const),
    ).toEqualTypeOf<["hello", "hello"]>();
  });

  test("complex tuple with matching literal in rest position", () => {
    expectTypeOf(
      filteredArray(
        ["start", "hello", "hello", "end"] as [
          "start",
          ...Array<"hello" | "world">,
          "end",
        ],
        "hello" as const,
      ),
    ).toEqualTypeOf<Array<"hello">>();
  });
});

describe("condition is a simple object", () => {
  test("array of matching objects", () => {
    expectTypeOf(
      filteredArray([] as Array<{ a: string }>, { a: "" } as { a: string }),
    ).toEqualTypeOf<Array<{ a: string }>>();
  });

  test("array of objects with matching and additional properties", () => {
    expectTypeOf(
      filteredArray(
        [] as Array<{ a: string; b: number }>,
        { a: "" } as { a: string },
      ),
    ).toEqualTypeOf<Array<{ a: string; b: number }>>();
  });

  test("array with mixed types including matching objects", () => {
    expectTypeOf(
      filteredArray(
        [] as Array<{ a: string } | string | number>,
        { a: "" } as { a: string },
      ),
    ).toEqualTypeOf<Array<{ a: string }>>();
  });

  test("tuple with mixed types including matching objects", () => {
    expectTypeOf(
      filteredArray(
        [""] as [{ a: string } | string | number],
        { a: "" } as { a: string },
      ),
    ).toEqualTypeOf<[] | [{ a: string }]>();
  });

  test("array with no matching objects", () => {
    expectTypeOf(
      filteredArray(
        [] as Array<{ b: string } | string>,
        { a: "" } as { a: string },
      ),
    ).toEqualTypeOf<[]>();
  });

  test("tuple with matching and non-matching objects", () => {
    expectTypeOf(
      filteredArray(
        [
          { a: "value" },
          { a: "hello" },
          { b: 42 },
          { a: "hello", c: true },
        ] as [
          { a: string },
          { a: "hello" },
          { b: number },
          { a: string; c: boolean },
        ],
        { a: "" } as { a: string },
      ),
    ).toEqualTypeOf<
      [{ a: string }, { a: "hello" }, { a: string; c: boolean }]
    >();
  });
});

describe("condition is a complex object", () => {
  test("array of exactly matching objects", () => {
    expectTypeOf(
      filteredArray(
        [] as Array<{ a: "hello"; b?: number }>,
        { a: "hello" } as { a: "hello"; b?: number },
      ),
    ).toEqualTypeOf<Array<{ a: "hello"; b?: number }>>();
  });

  test("array of objects with compatible literal property", () => {
    expectTypeOf(
      filteredArray(
        [] as Array<{ a: "hello" | "world"; b?: number }>,
        { a: "hello" } as { a: "hello"; b?: number },
      ),
    ).toEqualTypeOf<Array<{ a: "hello"; b?: number }>>();
  });

  test("array of objects with incompatible literal property", () => {
    expectTypeOf(
      filteredArray(
        [] as Array<{ a: "world"; b?: number }>,
        { a: "hello" } as { a: "hello"; b?: number },
      ),
    ).toEqualTypeOf<[]>();
  });

  test("array of objects missing optional property", () => {
    expectTypeOf(
      filteredArray(
        [] as Array<{ a: "hello" }>,
        { a: "hello" } as { a: "hello"; b?: number },
      ),
    ).toEqualTypeOf<Array<{ a: "hello" }>>();
  });

  test("array with mixed types including matching objects", () => {
    expectTypeOf(
      filteredArray(
        [] as Array<{ a: "hello"; b: number } | { a: "world" } | string>,
        { a: "hello" } as { a: "hello"; b?: number },
      ),
    ).toEqualTypeOf<Array<{ a: "hello"; b: number }>>();
  });

  test("tuple with mixed complex objects", () => {
    expectTypeOf(
      filteredArray(
        [{ a: "hello" }, { a: "world" }, { a: "hello", b: 42 }] as [
          { a: "hello" },
          { a: "world" },
          { a: "hello"; b: number },
        ],
        { a: "hello" } as { a: "hello"; b?: number },
      ),
    ).toEqualTypeOf<[{ a: "hello" }, { a: "hello"; b: number }]>();
  });

  test("partial matches", () => {
    expectTypeOf(
      filteredArray(
        [
          { a: "hello" },
          { a: "world" },
          { b: "hello" },
          { b: "world" },
          { a: "hello", b: "world" },
          { a: "hello", b: "world", c: 1234 },
        ] as const,
        { a: "hello", b: "world" } as { a: "hello"; b: "world" },
      ),
    ).toEqualTypeOf<
      [
        { readonly a: "hello"; readonly b: "world" },
        { readonly a: "hello"; readonly b: "world"; readonly c: 1234 },
      ]
    >();
  });

  test("condition value with union of literals", () => {
    expectTypeOf(
      filteredArray(
        [
          { a: "hello" },
          { b: "world" },
          { a: "hello", b: "world" },
          { a: "world" },
        ] as const,
        { a: "hello" } as { a: "hello" | "world" },
      ),
    ).toEqualTypeOf<
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
    expectTypeOf(
      filteredArray([] as Array<Array<string>>, [] as Array<string>),
    ).toEqualTypeOf<Array<Array<string>>>();
  });

  test("array of mixed array types", () => {
    expectTypeOf(
      filteredArray(
        [] as Array<Array<string> | Array<number> | Array<boolean>>,
        [] as Array<string>,
      ),
    ).toEqualTypeOf<Array<Array<string>>>();
  });

  test("array containing compatible array types", () => {
    expectTypeOf(
      filteredArray(
        [] as Array<Array<string | number> | Array<boolean>>,
        [] as Array<string>,
      ),
    ).toEqualTypeOf<Array<Array<string>>>();
  });

  test("tuple containing arrays", () => {
    expectTypeOf(
      filteredArray(
        [["a", "b"], [1, 2], ["c"]] as [
          Array<string>,
          Array<number>,
          Array<string>,
        ],
        [] as Array<string>,
      ),
    ).toEqualTypeOf<[Array<string>, Array<string>]>();
  });

  test("complex tuple with arrays in rest position", () => {
    expectTypeOf(
      filteredArray(
        [["a"], ["b"], ["c"]] as [
          Array<string>,
          ...Array<Array<string> | Array<number>>,
        ],
        [] as Array<string>,
      ),
    ).toEqualTypeOf<[Array<string>, ...Array<Array<string>>]>();
  });
});

describe("condition is a readonly array of primitives", () => {
  test("array of readonly string arrays", () => {
    expectTypeOf(
      filteredArray(
        [] as Array<ReadonlyArray<string>>,
        [] as ReadonlyArray<string>,
      ),
    ).toEqualTypeOf<Array<ReadonlyArray<string>>>();
  });

  test("array of mixed readonly and mutable arrays", () => {
    expectTypeOf(
      filteredArray(
        [] as Array<ReadonlyArray<string> | Array<string>>,
        [] as ReadonlyArray<string>,
      ),
    ).toEqualTypeOf<Array<ReadonlyArray<string> | Array<string>>>();
  });

  test("array with non-matching readonly arrays", () => {
    expectTypeOf(
      filteredArray(
        [] as Array<ReadonlyArray<number>>,
        [] as ReadonlyArray<string>,
      ),
    ).toEqualTypeOf<[]>();
  });

  test("tuple containing readonly arrays", () => {
    expectTypeOf(
      filteredArray(
        [["a"] as const, [1, 2], ["c"] as const] as [
          ReadonlyArray<string>,
          Array<number>,
          ReadonlyArray<string>,
        ],
        [] as ReadonlyArray<string>,
      ),
    ).toEqualTypeOf<[ReadonlyArray<string>, ReadonlyArray<string>]>();
  });
});

describe("condition is an array of literals", () => {
  test("array of arrays of matching literals", () => {
    expectTypeOf(
      filteredArray([] as Array<Array<"hello">>, [] as Array<"hello">),
    ).toEqualTypeOf<Array<Array<"hello">>>();
  });

  test("array with mixed literal arrays", () => {
    expectTypeOf(
      filteredArray(
        [] as Array<Array<"hello"> | Array<"world">>,
        [] as Array<"hello">,
      ),
    ).toEqualTypeOf<Array<Array<"hello">>>();
  });

  test("array with arrays containing unions of literals", () => {
    expectTypeOf(
      filteredArray(
        [] as Array<Array<"hello" | "world">>,
        [] as Array<"hello">,
      ),
    ).toEqualTypeOf<Array<Array<"hello">>>();
  });

  test("tuple containing literal arrays", () => {
    expectTypeOf(
      filteredArray(
        [["hello", "hello"], ["world"], ["hello"]] as [
          Array<"hello">,
          Array<"world">,
          Array<"hello">,
        ],
        [] as Array<"hello">,
      ),
    ).toEqualTypeOf<[Array<"hello">, Array<"hello">]>();
  });

  test("readonly arrays of literals", () => {
    expectTypeOf(
      filteredArray(
        [[], []] as [ReadonlyArray<"hello">, ReadonlyArray<"world">],
        [] as Array<"hello">,
      ),
    ).toEqualTypeOf<[]>();

    expectTypeOf(
      filteredArray(
        [[], []] as [ReadonlyArray<"hello">, ReadonlyArray<"world">],
        [] as ReadonlyArray<"hello">,
      ),
    ).toEqualTypeOf<[ReadonlyArray<"hello">]>();
  });
});

describe("condition is a tuple", () => {
  test("array of matching tuples", () => {
    expectTypeOf(
      filteredArray([] as Array<[string, number]>, ["", 0] as [string, number]),
    ).toEqualTypeOf<Array<[string, number]>>();
  });

  test("array of compatible tuples", () => {
    expectTypeOf(
      filteredArray([] as Array<["hello", 42]>, ["", 0] as [string, number]),
    ).toEqualTypeOf<Array<["hello", 42]>>();
  });

  test("array of incompatible tuples", () => {
    expectTypeOf(
      filteredArray([] as Array<[number, string]>, ["", 0] as [string, number]),
    ).toEqualTypeOf<[]>();
  });

  test("array with mixed tuples and other types", () => {
    expectTypeOf(
      filteredArray(
        [] as Array<[string, number] | Array<string> | number>,
        ["", 0] as [string, number],
      ),
    ).toEqualTypeOf<Array<[string, number]>>();
  });

  test("tuple containing different sized tuples", () => {
    expectTypeOf(
      filteredArray(
        [
          ["a", 1],
          [2, "b"],
          ["c", 3, true],
        ] as [[string, number], [number, string], [string, number, boolean]],
        ["", 0] as [string, number],
      ),
    ).toEqualTypeOf<[[string, number]]>();
  });

  test("complex nested tuples", () => {
    expectTypeOf(
      filteredArray(
        [[["a", 1]], [["b", 2]]] as const,
        ["", 0] as [string, number],
      ),
    ).toEqualTypeOf<[]>();
  });

  test("readonly tuples", () => {
    expectTypeOf(
      filteredArray(
        [
          ["a", 1],
          [2, "b"],
        ] as [readonly [string, number], readonly [number, string]],
        ["", 0] as [string, number],
      ),
    ).toEqualTypeOf<[]>();

    expectTypeOf(
      filteredArray(
        [
          ["a", 1],
          [2, "b"],
        ] as [readonly [string, number], readonly [number, string]],
        ["", 0] as readonly [string, number],
      ),
    ).toEqualTypeOf<[readonly [string, number]]>();
  });
});

describe("condition is a union of primitives", () => {
  test("array with elements matching multiple parts of the union", () => {
    expectTypeOf(
      filteredArray(
        [] as Array<string | number | boolean>,
        "" as string | number,
      ),
    ).toEqualTypeOf<Array<string | number>>();
  });

  test("array with only one union member type", () => {
    expectTypeOf(
      filteredArray([] as Array<string>, "" as string | number),
    ).toEqualTypeOf<Array<string>>();
  });

  test("tuple with mixed primitives", () => {
    expectTypeOf(
      filteredArray(
        ["hello", 42, true] as [string, number, boolean],
        "" as string | number,
      ),
    ).toEqualTypeOf<[string, number]>();
  });

  test("tuple with literal types that extend union members", () => {
    expectTypeOf(
      filteredArray(["hello", 42, true] as const, "" as string | number),
    ).toEqualTypeOf<["hello", 42]>();
  });

  test("tuple with union of literals", () => {
    expectTypeOf(
      filteredArray(
        ["", "", 123] as [string | number, string | boolean, number | boolean],
        "cat" as string | number,
      ),
    ).toEqualTypeOf<
      | [string, number]
      | [number, string]
      | [string]
      | [string, string, number]
      | [number]
      | [string, string]
      | [number, string, number]
      | [number, number]
    >();
  });
});

describe("condition is a union of literals", () => {
  test("array with elements matching any part of the union", () => {
    expectTypeOf(
      filteredArray(
        ["cat", "dog", "fish"] as Array<string>,
        "cat" as "cat" | "dog",
      ),
    ).toEqualTypeOf<Array<"cat" | "dog">>();
  });

  test("array with union literals only", () => {
    expectTypeOf(
      filteredArray(
        [] as Array<"cat" | "dog" | "fish">,
        "cat" as "cat" | "dog",
      ),
    ).toEqualTypeOf<Array<"cat" | "dog">>();
  });

  test("tuple with mixed elements", () => {
    expectTypeOf(
      filteredArray(["cat", "fish", "dog"] as const, "cat" as "cat" | "dog"),
    ).toEqualTypeOf<["cat", "dog"]>();
  });

  test("tuple with union of literals", () => {
    expectTypeOf(
      filteredArray(
        ["cat", "cat", "dog"] as ["cat" | "dog", "cat" | "foo", "dog" | "bar"],
        "cat" as "cat" | "dog",
      ),
    ).toEqualTypeOf<
      | ["cat"]
      | ["dog"]
      | ["cat", "dog"]
      | ["cat", "cat", "dog"]
      | ["cat", "cat"]
      | ["dog", "cat"]
      | ["dog", "dog"]
      | ["dog", "cat", "dog"]
    >();
  });
});

describe("condition is a discriminated union", () => {
  test("array with discriminated union elements", () => {
    expectTypeOf(
      filteredArray(
        [] as Array<{ a: "cat"; b: number } | { a: "dog"; c: boolean }>,
        { a: "cat" } as { a: "cat" } | { a: "dog" },
      ),
    ).toEqualTypeOf<
      Array<{ a: "cat"; b: number } | { a: "dog"; c: boolean }>
    >();
  });

  test("tuple with mixed discriminated types", () => {
    expectTypeOf(
      filteredArray(
        [
          { a: "cat", b: 1 },
          { a: "dog", c: true },
          { a: "cat", b: 2 },
        ] as const,
        { a: "cat" } as { a: "cat" } | { a: "dog" },
      ),
    ).toEqualTypeOf<
      [
        { readonly a: "cat"; readonly b: 1 },
        { readonly a: "dog"; readonly c: true },
        { readonly a: "cat"; readonly b: 2 },
      ]
    >();
  });

  test("filtering with discriminator only", () => {
    expectTypeOf(
      filteredArray(
        [] as Array<{ a: "cat"; b: number } | { a: "dog"; c: boolean }>,
        { a: "cat" } as { a: "cat" | "dog" },
      ),
    ).toEqualTypeOf<
      Array<{ a: "cat"; b: number } | { a: "dog"; c: boolean }>
    >();
  });
});

describe("disjoint object types ({ a: string } | { b: number })", () => {
  test("array with disjoint union elements", () => {
    expectTypeOf(
      filteredArray(
        [] as Array<{ a: string } | { b: number }>,
        { a: "" } as { a: string } | { b: number },
      ),
    ).toEqualTypeOf<Array<{ a: string } | { b: number }>>();
  });

  test("filtering for only one variant", () => {
    expectTypeOf(
      filteredArray(
        [] as Array<{ a: string } | { b: number }>,
        { a: "" } as { a: string },
      ),
    ).toEqualTypeOf<Array<{ a: string }>>();
  });

  test("array with objects having both properties", () => {
    expectTypeOf(
      filteredArray(
        [] as Array<{ a: string } | { b: number } | { a: string; b: number }>,
        { a: "" } as { a: string } | { b: number },
      ),
    ).toEqualTypeOf<
      Array<{ a: string } | { b: number } | { a: string; b: number }>
    >();
  });

  test("tuple with mixed disjoint types", () => {
    expectTypeOf(
      filteredArray(
        [{ a: "hello" }, { b: 42 }, { a: "world", b: 123 }] as const,
        { b: 0 } as { a: string } | { b: number },
      ),
    ).toEqualTypeOf<
      [
        { readonly a: "hello" },
        { readonly b: 42 },
        { readonly a: "world"; readonly b: 123 },
      ]
    >();
  });
});

describe("complex nested union conditions", () => {
  test("union of arrays", () => {
    expectTypeOf(
      filteredArray(
        [["a"], [1], ["b"]] as [Array<string>, Array<number>, Array<string>],
        [] as Array<string> | Array<number>,
      ),
    ).toEqualTypeOf<[Array<string>, Array<number>, Array<string>]>();
  });

  test("union of tuples with different structures", () => {
    expectTypeOf(
      filteredArray(
        [
          ["a", 1],
          [true, "b"],
          [42, "c"],
        ] as [[string, number], [boolean, string], [number, string]],
        ["", 0] as [string, number] | [boolean, string],
      ),
    ).toEqualTypeOf<[[string, number], [boolean, string]]>();
  });
});

describe("tuples with optional elements", () => {
  test("removes the partialness once filtered", () => {
    expectTypeOf(
      filteredArray([] as [number?, string?], "" as string),
    ).toEqualTypeOf<[] | [string]>();
  });

  test("multiple matches", () => {
    expectTypeOf(
      filteredArray([] as [number?, string?, number?, string?], "" as string),
    ).toEqualTypeOf<[] | [string] | [string, string]>();
  });

  test("literal unions, primitive condition", () => {
    expectTypeOf(
      filteredArray(
        [] as [("hello" | "world")?, ("foo" | "bar")?],
        "" as string,
      ),
    ).toEqualTypeOf<
      | []
      | ["hello"]
      | ["world"]
      | ["foo"]
      | ["hello", "foo"]
      | ["world", "foo"]
      | ["bar"]
      | ["hello", "bar"]
      | ["world", "bar"]
    >();
  });

  test("literal unions, matching condition", () => {
    expectTypeOf(
      filteredArray(
        [] as [("hello" | "world")?, ("foo" | "bar")?],
        "hello" as "hello" | "foo",
      ),
    ).toEqualTypeOf<[] | ["hello"] | ["foo"] | ["hello", "foo"]>();
  });

  test("primitive items, literal union condition", () => {
    expectTypeOf(
      filteredArray([] as [string?, string?], "hello" as "hello" | "foo"),
    ).toEqualTypeOf<
      | []
      | ["hello"]
      | ["foo"]
      | ["hello", "foo"]
      | ["hello", "hello"]
      | ["foo", "hello"]
      | ["foo", "foo"]
    >();
  });
});

test("null filtering", () => {
  expectTypeOf(
    filteredArray([] as Array<string | undefined>, "" as string),
  ).toEqualTypeOf<Array<string>>();
});
