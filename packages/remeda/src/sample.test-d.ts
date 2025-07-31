import { describe, expectTypeOf, test } from "vitest";
import { sample } from "./sample";

// We rely on the tuple shapes defined and described in TupleParts. We extracted
// the constants our of the tests so that we can ensure they keep certain
// properties that are then assumed when we test for different sampleSizes. All
// these tuples have exactly 5 fixed elements (except the empty tuple), this
// allows us to use fixed sample sizes in all tests of each category and make
// sure we hit all the edge-cases.
//
// TODO: Some tuple shapes are not tested yet: optional, mixed, optional prefix, mixed prefix, and fixed elements.

const EMPTY = [] as [];
const EMPTY_RO = EMPTY as readonly [];

const FIXED = ["a", "b", "c", "d", "e"] as ["a", "b", "c", "d", "e"];
const FIXED_RO = FIXED as readonly ["a", "b", "c", "d", "e"];

const ARRAY = [] as Array<true>;
const ARRAY_RO = ARRAY as ReadonlyArray<true>;

const PREFIX = ["a", "b", "c", "d", "e"] as [
  "a",
  "b",
  "c",
  "d",
  "e",
  ...Array<true>,
];
const PREFIX_RO = PREFIX as readonly ["a", "b", "c", "d", "e", ...Array<true>];

const SUFFIX = ["v", "w", "x", "y", "z"] as [
  ...Array<true>,
  "v",
  "w",
  "x",
  "y",
  "z",
];
const SUFFIX_RO = SUFFIX as readonly [...Array<true>, "v", "w", "x", "y", "z"];

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
      | ["a", "b", "c", "d"]
      | ["b", "c", "d", "e"]
      | ["a", "c", "d", "e"]
      | ["a", "b", "d", "e"]
      | ["a", "b", "c", "e"]
    >();
  });

  test("fixed readonly tuples", () => {
    expectTypeOf(sample(FIXED_RO, SAMPLE_SIZE)).toEqualTypeOf<
      | ["a", "b", "c", "d"]
      | ["b", "c", "d", "e"]
      | ["a", "c", "d", "e"]
      | ["a", "b", "d", "e"]
      | ["a", "b", "c", "e"]
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
      | [...Array<true>, "v", "w", "x", "y", "z"]
      | [...Array<true>, "v", "w", "x", "y"]
      | [...Array<true>, "v", "w", "x", "z"]
      | [...Array<true>, "v", "w", "x"]
      | [...Array<true>, "v", "w", "y", "z"]
      | [...Array<true>, "v", "w", "y"]
      | [...Array<true>, "v", "w", "z"]
      | [...Array<true>, "v", "w"]
      | [...Array<true>, "v", "x", "y", "z"]
      | [...Array<true>, "v", "x", "y"]
      | [...Array<true>, "v", "x", "z"]
      | [...Array<true>, "v", "x"]
      | [...Array<true>, "v", "y", "z"]
      | [...Array<true>, "v", "y"]
      | [...Array<true>, "v", "z"]
      | [...Array<true>, "v"]
      | [...Array<true>, "w", "x", "y", "z"]
      | [...Array<true>, "w", "x", "y"]
      | [...Array<true>, "w", "x", "z"]
      | [...Array<true>, "w", "x"]
      | [...Array<true>, "w", "y", "z"]
      | [...Array<true>, "w", "y"]
      | [...Array<true>, "w", "z"]
      | [...Array<true>, "w"]
      | [...Array<true>, "x", "y", "z"]
      | [...Array<true>, "x", "y"]
      | [...Array<true>, "x", "z"]
      | [...Array<true>, "x"]
      | [...Array<true>, "y", "z"]
      | [...Array<true>, "y"]
      | [...Array<true>, "z"]
      | Array<true>
    >();
  });

  test("fixed-suffix readonly arrays", () => {
    expectTypeOf(sample(SUFFIX_RO, SAMPLE_SIZE)).toEqualTypeOf<
      | [...Array<true>, "v", "w", "x", "y", "z"]
      | [...Array<true>, "v", "w", "x", "y"]
      | [...Array<true>, "v", "w", "x", "z"]
      | [...Array<true>, "v", "w", "x"]
      | [...Array<true>, "v", "w", "y", "z"]
      | [...Array<true>, "v", "w", "y"]
      | [...Array<true>, "v", "w", "z"]
      | [...Array<true>, "v", "w"]
      | [...Array<true>, "v", "x", "y", "z"]
      | [...Array<true>, "v", "x", "y"]
      | [...Array<true>, "v", "x", "z"]
      | [...Array<true>, "v", "x"]
      | [...Array<true>, "v", "y", "z"]
      | [...Array<true>, "v", "y"]
      | [...Array<true>, "v", "z"]
      | [...Array<true>, "v"]
      | [...Array<true>, "w", "x", "y", "z"]
      | [...Array<true>, "w", "x", "y"]
      | [...Array<true>, "w", "x", "z"]
      | [...Array<true>, "w", "x"]
      | [...Array<true>, "w", "y", "z"]
      | [...Array<true>, "w", "y"]
      | [...Array<true>, "w", "z"]
      | [...Array<true>, "w"]
      | [...Array<true>, "x", "y", "z"]
      | [...Array<true>, "x", "y"]
      | [...Array<true>, "x", "z"]
      | [...Array<true>, "x"]
      | [...Array<true>, "y", "z"]
      | [...Array<true>, "y"]
      | [...Array<true>, "z"]
      | Array<true>
    >();
  });
});
