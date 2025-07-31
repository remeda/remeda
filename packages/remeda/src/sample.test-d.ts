import { describe, expectTypeOf, test } from "vitest";
import { sample } from "./sample";

const EMPTY = [] as [];
const EMPTY_RO = [] as Readonly<typeof EMPTY>;

const FIXED = ["a", "b", "c", "d", "e"] as ["a", "b", "c", "d", "e"];
const FIXED_RO = ["a", "b", "c", "d", "e"] as Readonly<typeof FIXED>;

const ARRAY = [] as Array<true>;
const ARRAY_RO = [] as Readonly<typeof ARRAY>;

const PREFIX = ["a", "b", "c", "d", "e"] as [
  "a",
  "b",
  "c",
  "d",
  "e",
  ...Array<true>,
];
const PREFIX_RO = ["a", "b", "c", "d", "e"] as Readonly<typeof PREFIX>;

const SUFFIX = ["v", "w", "x", "y", "z"] as [
  ...Array<true>,
  "v",
  "w",
  "x",
  "y",
  "z",
];
const SUFFIX_RO = ["v", "w", "x", "y", "z"] as Readonly<typeof SUFFIX>;

// TODO: We aren't testing all possible tuple shapes: optional, mixed, optional prefix, mixed prefix, and fixed elements (see TupleParts for the definition of each shape).

describe("literal sampleSize === 0", () => {
  const SAMPLE_SIZE = 0;

  test("empty", () => {
    expectTypeOf(sample(EMPTY, SAMPLE_SIZE)).toEqualTypeOf<[]>();
  });

  test("empty readonly", () => {
    expectTypeOf(sample(EMPTY_RO, SAMPLE_SIZE)).toEqualTypeOf<[]>();
  });

  test("arrays", () => {
    expectTypeOf(sample(ARRAY, SAMPLE_SIZE)).toEqualTypeOf<[]>();
  });

  test("readonly arrays", () => {
    expectTypeOf(sample(ARRAY_RO, SAMPLE_SIZE)).toEqualTypeOf<[]>();
  });

  test("fixed tuples", () => {
    expectTypeOf(sample(FIXED, SAMPLE_SIZE)).toEqualTypeOf<[]>();
  });

  test("fixed readonly tuples", () => {
    expectTypeOf(sample(FIXED_RO, SAMPLE_SIZE)).toEqualTypeOf<[]>();
  });

  test("fixed-prefix arrays", () => {
    expectTypeOf(sample(PREFIX, SAMPLE_SIZE)).toEqualTypeOf<[]>();
  });

  test("fixed-suffix arrays", () => {
    expectTypeOf(sample(SUFFIX, SAMPLE_SIZE)).toEqualTypeOf<[]>();
  });

  test("fixed-prefix readonly arrays", () => {
    expectTypeOf(sample(PREFIX_RO, SAMPLE_SIZE)).toEqualTypeOf<[]>();
  });

  test("fixed-suffix readonly arrays", () => {
    expectTypeOf(sample(SUFFIX_RO, SAMPLE_SIZE)).toEqualTypeOf<[]>();
  });
});

describe("simple arrays", () => {
  test("mutable", () => {
    expectTypeOf(sample(ARRAY, 4)).toEqualTypeOf<
      [] | [true] | [true, true] | [true, true, true] | [true, true, true, true]
    >();
  });

  test("readonly", () => {
    expectTypeOf(sample(ARRAY_RO, 4)).toEqualTypeOf<
      [] | [true] | [true, true] | [true, true, true] | [true, true, true, true]
    >();
  });
});

describe("literal sampleSize < n", () => {
  const SAMPLE_SIZE = 4;

  test("fixed tuples", () => {
    expectTypeOf(sample(FIXED, SAMPLE_SIZE)).toEqualTypeOf<
      // TODO: This type is OK but it isn't optimal; e.g., It accepts the output ["e", "e", "e", "e"] that isn't possible.
      [
        "a" | "b" | "c" | "d" | "e",
        "b" | "c" | "d" | "e",
        "c" | "d" | "e",
        "d" | "e",
      ]
    >();
  });

  test("fixed readonly tuples", () => {
    expectTypeOf(sample(FIXED_RO, SAMPLE_SIZE)).toEqualTypeOf<
      // TODO: This type is OK but it isn't optimal; e.g., It accepts the output ["e", "e", "e", "e"] that isn't possible.
      [
        "a" | "b" | "c" | "d" | "e",
        "b" | "c" | "d" | "e",
        "c" | "d" | "e",
        "d" | "e",
      ]
    >();
  });

  test("fixed-prefix arrays", () => {
    expectTypeOf(sample(PREFIX, SAMPLE_SIZE)).toEqualTypeOf<
      // TODO: This type is OK but it isn't optimal; e.g., It accepts the output ["e", "e", "e", "e"] that isn't possible.
      [
        true | "a" | "b" | "c" | "d" | "e",
        true | "b" | "c" | "d" | "e",
        true | "c" | "d" | "e",
        true | "d" | "e",
      ]
    >();
  });

  test("fixed-prefix readonly arrays", () => {
    expectTypeOf(sample(PREFIX_RO, SAMPLE_SIZE)).toEqualTypeOf<
      // TODO: This type is OK but it isn't optimal; e.g., It accepts the output ["e", "e", "e", "e"] that isn't possible.
      [
        true | "a" | "b" | "c" | "d" | "e",
        true | "b" | "c" | "d" | "e",
        true | "c" | "d" | "e",
        true | "d" | "e",
      ]
    >();
  });

  test("fixed-suffix arrays", () => {
    expectTypeOf(sample(SUFFIX, SAMPLE_SIZE)).toEqualTypeOf<
      // TODO: This type is wrong, it doesn't represent the rest part of the input at all...
      ["w", "x", "y", "z"]
    >();
  });

  test("fixed-suffix readonly arrays", () => {
    expectTypeOf(sample(SUFFIX_RO, SAMPLE_SIZE)).toEqualTypeOf<
      // TODO: This type is wrong, it doesn't represent the rest part of the input at all...
      ["w", "x", "y", "z"]
    >();
  });
});

describe("literal sampleSize === n", () => {
  const SAMPLE_SIZE = 5;

  test("fixed tuples", () => {
    expectTypeOf(sample(FIXED, SAMPLE_SIZE)).toEqualTypeOf<
      ["a", "b", "c", "d", "e"]
    >();
  });

  test("fixed readonly tuples", () => {
    expectTypeOf(sample(FIXED_RO, SAMPLE_SIZE)).toEqualTypeOf<
      ["a", "b", "c", "d", "e"]
    >();
  });

  test("fixed-prefix arrays", () => {
    expectTypeOf(sample(PREFIX, SAMPLE_SIZE)).toEqualTypeOf<
      // TODO: This type is OK but it isn't optimal; e.g., It accepts the output ["e", "e", "e", "e", "e"] that isn't possible.
      [
        true | "a" | "b" | "c" | "d" | "e",
        true | "b" | "c" | "d" | "e",
        true | "c" | "d" | "e",
        true | "d" | "e",
        true | "e",
      ]
    >();
  });

  test("fixed-prefix readonly arrays", () => {
    expectTypeOf(sample(PREFIX_RO, SAMPLE_SIZE)).toEqualTypeOf<
      // TODO: This type is OK but it isn't optimal; e.g., It accepts the output ["e", "e", "e", "e", "e"] that isn't possible.
      [
        true | "a" | "b" | "c" | "d" | "e",
        true | "b" | "c" | "d" | "e",
        true | "c" | "d" | "e",
        true | "d" | "e",
        true | "e",
      ]
    >();
  });

  test("fixed-suffix arrays", () => {
    expectTypeOf(sample(SUFFIX, SAMPLE_SIZE)).toEqualTypeOf<
      // TODO: This type is wrong, it doesn't represent the rest part of the input at all...
      ["v", "w", "x", "y", "z"]
    >();
  });

  test("fixed-suffix readonly arrays", () => {
    expectTypeOf(sample(SUFFIX_RO, SAMPLE_SIZE)).toEqualTypeOf<
      // TODO: This type is wrong, it doesn't represent the rest part of the input at all...
      ["v", "w", "x", "y", "z"]
    >();
  });
});

describe("literal sampleSize > n", () => {
  const SAMPLE_SIZE = 10;

  test("empty", () => {
    expectTypeOf(sample(EMPTY, SAMPLE_SIZE)).toEqualTypeOf<[]>();
  });

  test("empty readonly", () => {
    expectTypeOf(sample(EMPTY_RO, SAMPLE_SIZE)).toEqualTypeOf<[]>();
  });

  test("fixed tuples", () => {
    expectTypeOf(sample(FIXED, SAMPLE_SIZE)).toEqualTypeOf<
      ["a", "b", "c", "d", "e"]
    >();
  });

  test("fixed readonly tuples", () => {
    expectTypeOf(sample(FIXED_RO, SAMPLE_SIZE)).toEqualTypeOf<
      ["a", "b", "c", "d", "e"]
    >();
  });

  test("fixed-prefix arrays", () => {
    expectTypeOf(sample(PREFIX, SAMPLE_SIZE)).toEqualTypeOf<
      // TODO: This type is OK but it isn't optimal; there are two problems with it: it accepts invalid outputs like ["e", "e", "e", "e", "e", true, true, true, true, true] of length SAMPLE_SIZE, but it also compute the cases for outputs shorter than SAMPLE_SIZE incorrectly, because in those cases the prefix will always be sampled as-is (because it's always present and we are sampling more items than the input has!).
      | [
          "a" | "b" | "c" | "d" | "e" | true,
          "b" | "c" | "d" | "e" | true,
          "c" | "d" | "e" | true,
          "d" | "e" | true,
          "e" | true,
          true,
          true,
          true,
          true,
          true,
        ]
      | [
          "a" | "b" | "c" | "d" | "e" | true,
          "b" | "c" | "d" | "e" | true,
          "c" | "d" | "e" | true,
          "d" | "e" | true,
          "e" | true,
          true,
          true,
          true,
          true,
        ]
      | [
          "a" | "b" | "c" | "d" | "e" | true,
          "b" | "c" | "d" | "e" | true,
          "c" | "d" | "e" | true,
          "d" | "e" | true,
          "e" | true,
          true,
          true,
          true,
        ]
      | [
          "a" | "b" | "c" | "d" | "e" | true,
          "b" | "c" | "d" | "e" | true,
          "c" | "d" | "e" | true,
          "d" | "e" | true,
          "e" | true,
          true,
          true,
        ]
      | [
          "a" | "b" | "c" | "d" | "e" | true,
          "b" | "c" | "d" | "e" | true,
          "c" | "d" | "e" | true,
          "d" | "e" | true,
          "e" | true,
          true,
        ]
      | [
          "a" | "b" | "c" | "d" | "e" | true,
          "b" | "c" | "d" | "e" | true,
          "c" | "d" | "e" | true,
          "d" | "e" | true,
          "e" | true,
        ]
    >();
  });

  test("fixed-prefix readonly arrays", () => {
    expectTypeOf(sample(PREFIX_RO, SAMPLE_SIZE)).toEqualTypeOf<
      // TODO: This type is OK but it isn't optimal; there are two problems with it: it accepts invalid outputs like ["e", "e", "e", "e", "e", true, true, true, true, true] of length SAMPLE_SIZE, but it also compute the cases for outputs shorter than SAMPLE_SIZE incorrectly, because in those cases the prefix will always be sampled as-is (because it's always present and we are sampling more items than the input has!).
      | [
          "a" | "b" | "c" | "d" | "e" | true,
          "b" | "c" | "d" | "e" | true,
          "c" | "d" | "e" | true,
          "d" | "e" | true,
          "e" | true,
          true,
          true,
          true,
          true,
          true,
        ]
      | [
          "a" | "b" | "c" | "d" | "e" | true,
          "b" | "c" | "d" | "e" | true,
          "c" | "d" | "e" | true,
          "d" | "e" | true,
          "e" | true,
          true,
          true,
          true,
          true,
        ]
      | [
          "a" | "b" | "c" | "d" | "e" | true,
          "b" | "c" | "d" | "e" | true,
          "c" | "d" | "e" | true,
          "d" | "e" | true,
          "e" | true,
          true,
          true,
          true,
        ]
      | [
          "a" | "b" | "c" | "d" | "e" | true,
          "b" | "c" | "d" | "e" | true,
          "c" | "d" | "e" | true,
          "d" | "e" | true,
          "e" | true,
          true,
          true,
        ]
      | [
          "a" | "b" | "c" | "d" | "e" | true,
          "b" | "c" | "d" | "e" | true,
          "c" | "d" | "e" | true,
          "d" | "e" | true,
          "e" | true,
          true,
        ]
      | [
          "a" | "b" | "c" | "d" | "e" | true,
          "b" | "c" | "d" | "e" | true,
          "c" | "d" | "e" | true,
          "d" | "e" | true,
          "e" | true,
        ]
    >();
  });

  test("fixed-suffix arrays", () => {
    expectTypeOf(sample(SUFFIX, SAMPLE_SIZE)).toEqualTypeOf<
      | ["v", "w", "x", "y", "z"]
      | [true, "v", "w", "x", "y", "z"]
      | [true, true, "v", "w", "x", "y", "z"]
      | [true, true, true, "v", "w", "x", "y", "z"]
      | [true, true, true, true, "v", "w", "x", "y", "z"]
      // TODO: This is wrong, once the input array has more than sampleSize items then the result might not contain the suffix at all, we need to take any combination of items from the suffix.
      | [true, true, true, true, true, "v", "w", "x", "y", "z"]
    >();
  });

  test("fixed-suffix readonly arrays", () => {
    expectTypeOf(sample(SUFFIX_RO, SAMPLE_SIZE)).toEqualTypeOf<
      | ["v", "w", "x", "y", "z"]
      | [true, "v", "w", "x", "y", "z"]
      | [true, true, "v", "w", "x", "y", "z"]
      | [true, true, true, "v", "w", "x", "y", "z"]
      | [true, true, true, true, "v", "w", "x", "y", "z"]
      // TODO: This is wrong, once the input array has more than sampleSize items then the result might not contain the suffix at all, we need to take any combination of items from the suffix.
      | [true, true, true, true, true, "v", "w", "x", "y", "z"]
    >();
  });
});

describe("primitive sampleSize", () => {
  const SAMPLE_SIZE = 1 as number;

  test("empty", () => {
    expectTypeOf(sample(EMPTY, SAMPLE_SIZE)).toEqualTypeOf<[]>();
  });

  test("empty readonly", () => {
    expectTypeOf(sample(EMPTY_RO, SAMPLE_SIZE)).toEqualTypeOf<[]>();
  });

  test("arrays", () => {
    expectTypeOf(sample(ARRAY, SAMPLE_SIZE)).toEqualTypeOf<Array<true>>();
  });

  test("readonly arrays", () => {
    expectTypeOf(sample(ARRAY_RO, SAMPLE_SIZE)).toEqualTypeOf<Array<true>>();
  });

  test("fixed tuples", () => {
    expectTypeOf(sample(FIXED, SAMPLE_SIZE)).toEqualTypeOf<
      | ["a", "b", "c", "d", "e"]
      | ["a", "b", "c", "d"]
      | ["a", "b", "c", "e"]
      | ["a", "b", "c"]
      | ["a", "b", "d", "e"]
      | ["a", "b", "d"]
      | ["a", "b", "e"]
      | ["a", "b"]
      | ["a", "c", "d", "e"]
      | ["a", "c", "d"]
      | ["a", "c", "e"]
      | ["a", "c"]
      | ["a", "d", "e"]
      | ["a", "d"]
      | ["a", "e"]
      | ["a"]
      | ["b", "c", "d", "e"]
      | ["b", "c", "d"]
      | ["b", "c", "e"]
      | ["b", "c"]
      | ["b", "d", "e"]
      | ["b", "d"]
      | ["b", "e"]
      | ["b"]
      | ["c", "d", "e"]
      | ["c", "d"]
      | ["c", "e"]
      | ["c"]
      | ["d", "e"]
      | ["d"]
      | ["e"]
      | []
    >();
  });

  test("fixed readonly tuples", () => {
    expectTypeOf(sample(FIXED_RO, SAMPLE_SIZE)).toEqualTypeOf<
      | ["a", "b", "c", "d", "e"]
      | ["a", "b", "c", "d"]
      | ["a", "b", "c", "e"]
      | ["a", "b", "c"]
      | ["a", "b", "d", "e"]
      | ["a", "b", "d"]
      | ["a", "b", "e"]
      | ["a", "b"]
      | ["a", "c", "d", "e"]
      | ["a", "c", "d"]
      | ["a", "c", "e"]
      | ["a", "c"]
      | ["a", "d", "e"]
      | ["a", "d"]
      | ["a", "e"]
      | ["a"]
      | ["b", "c", "d", "e"]
      | ["b", "c", "d"]
      | ["b", "c", "e"]
      | ["b", "c"]
      | ["b", "d", "e"]
      | ["b", "d"]
      | ["b", "e"]
      | ["b"]
      | ["c", "d", "e"]
      | ["c", "d"]
      | ["c", "e"]
      | ["c"]
      | ["d", "e"]
      | ["d"]
      | ["e"]
      | []
    >();
  });

  test("fixed-prefix arrays", () => {
    expectTypeOf(sample(PREFIX, SAMPLE_SIZE)).toEqualTypeOf<
      | ["a", "b", "c", "d", "e", ...Array<true>]
      | ["a", "b", "c", "d", ...Array<true>]
      | ["a", "b", "c", "e", ...Array<true>]
      | ["a", "b", "c", ...Array<true>]
      | ["a", "b", "d", "e", ...Array<true>]
      | ["a", "b", "d", ...Array<true>]
      | ["a", "b", "e", ...Array<true>]
      | ["a", "b", ...Array<true>]
      | ["a", "c", "d", "e", ...Array<true>]
      | ["a", "c", "d", ...Array<true>]
      | ["a", "c", "e", ...Array<true>]
      | ["a", "c", ...Array<true>]
      | ["a", "d", "e", ...Array<true>]
      | ["a", "d", ...Array<true>]
      | ["a", "e", ...Array<true>]
      | ["a", ...Array<true>]
      | ["b", "c", "d", "e", ...Array<true>]
      | ["b", "c", "d", ...Array<true>]
      | ["b", "c", "e", ...Array<true>]
      | ["b", "c", ...Array<true>]
      | ["b", "d", "e", ...Array<true>]
      | ["b", "d", ...Array<true>]
      | ["b", "e", ...Array<true>]
      | ["b", ...Array<true>]
      | ["c", "d", "e", ...Array<true>]
      | ["c", "d", ...Array<true>]
      | ["c", "e", ...Array<true>]
      | ["c", ...Array<true>]
      | ["d", "e", ...Array<true>]
      | ["d", ...Array<true>]
      | ["e", ...Array<true>]
      | Array<true>
    >();
  });

  test("fixed-prefix readonly arrays", () => {
    expectTypeOf(sample(PREFIX_RO, SAMPLE_SIZE)).toEqualTypeOf<
      | ["a", "b", "c", "d", "e", ...Array<true>]
      | ["a", "b", "c", "d", ...Array<true>]
      | ["a", "b", "c", "e", ...Array<true>]
      | ["a", "b", "c", ...Array<true>]
      | ["a", "b", "d", "e", ...Array<true>]
      | ["a", "b", "d", ...Array<true>]
      | ["a", "b", "e", ...Array<true>]
      | ["a", "b", ...Array<true>]
      | ["a", "c", "d", "e", ...Array<true>]
      | ["a", "c", "d", ...Array<true>]
      | ["a", "c", "e", ...Array<true>]
      | ["a", "c", ...Array<true>]
      | ["a", "d", "e", ...Array<true>]
      | ["a", "d", ...Array<true>]
      | ["a", "e", ...Array<true>]
      | ["a", ...Array<true>]
      | ["b", "c", "d", "e", ...Array<true>]
      | ["b", "c", "d", ...Array<true>]
      | ["b", "c", "e", ...Array<true>]
      | ["b", "c", ...Array<true>]
      | ["b", "d", "e", ...Array<true>]
      | ["b", "d", ...Array<true>]
      | ["b", "e", ...Array<true>]
      | ["b", ...Array<true>]
      | ["c", "d", "e", ...Array<true>]
      | ["c", "d", ...Array<true>]
      | ["c", "e", ...Array<true>]
      | ["c", ...Array<true>]
      | ["d", "e", ...Array<true>]
      | ["d", ...Array<true>]
      | ["e", ...Array<true>]
      | Array<true>
    >();
  });

  test("fixed-suffix arrays", () => {
    expectTypeOf(sample(SUFFIX, SAMPLE_SIZE)).toEqualTypeOf<
      // TODO: the typing here isn't wrong but it's far from optimal!
      Array<true | "v" | "w" | "x" | "y" | "z">
    >();
  });

  test("fixed-suffix readonly arrays", () => {
    expectTypeOf(sample(SUFFIX_RO, SAMPLE_SIZE)).toEqualTypeOf<
      // TODO: the typing here isn't wrong but it's far from optimal!
      Array<true | "v" | "w" | "x" | "y" | "z">
    >();
  });
});
