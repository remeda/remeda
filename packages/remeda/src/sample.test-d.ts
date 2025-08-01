import { describe, expectTypeOf, test } from "vitest";
import { sample } from "./sample";

// We rely on the tuple shapes defined and described in TupleParts. We extracted
// the constants our of the tests so that we can ensure they keep certain
// properties that are then assumed when we test for different sampleSizes. All
// these tuples have exactly 5 fixed elements (except the empty tuple), this
// allows us to use fixed sample sizes in all tests of each category and make
// sure we hit all the edge-cases.
//
// TODO: Some tuple shapes are not tested yet: optional, mixed, optional prefix, mixed prefix.

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

const FIXED_ARRAY = ["a", "b", "c", "y", "z"] as [
  "a",
  "b",
  "c",
  ...Array<true>,
  "y",
  "z",
];
const FIXED_ARRAY_RO = FIXED_ARRAY as readonly [
  "a",
  "b",
  "c",
  ...Array<true>,
  "y",
  "z",
];

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

  test("fixed array", () => {
    expectTypeOf(sample(FIXED_ARRAY, SAMPLE_SIZE)).toEqualTypeOf<[]>();
  });

  test("fixed readonly array", () => {
    expectTypeOf(sample(FIXED_ARRAY_RO, SAMPLE_SIZE)).toEqualTypeOf<[]>();
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
      | ["a", "b", "c", "e"]
      | ["a", "b", "d", "e"]
      | ["a", "c", "d", "e"]
      | ["b", "c", "d", "e"]
    >();
  });

  test("fixed readonly tuples", () => {
    expectTypeOf(sample(FIXED_RO, SAMPLE_SIZE)).toEqualTypeOf<
      | ["a", "b", "c", "d"]
      | ["a", "b", "c", "e"]
      | ["a", "b", "d", "e"]
      | ["a", "c", "d", "e"]
      | ["b", "c", "d", "e"]
    >();
  });

  test("fixed-prefix arrays", () => {
    expectTypeOf(sample(PREFIX, SAMPLE_SIZE)).toEqualTypeOf<
      | ["a", "b", "c", "d"]
      | ["a", "b", "c", "e"]
      | ["a", "b", "d", "e"]
      | ["a", "c", "d", "e"]
      | ["b", "c", "d", "e"]
      | ["a", "b", "c", true]
      | ["a", "b", "d", true]
      | ["a", "b", "e", true]
      | ["a", "c", "d", true]
      | ["a", "c", "e", true]
      | ["a", "d", "e", true]
      | ["b", "c", "d", true]
      | ["b", "c", "e", true]
      | ["b", "d", "e", true]
      | ["c", "d", "e", true]
      | ["a", "b", true, true]
      | ["a", "c", true, true]
      | ["a", "d", true, true]
      | ["a", "e", true, true]
      | ["b", "c", true, true]
      | ["b", "d", true, true]
      | ["b", "e", true, true]
      | ["c", "d", true, true]
      | ["c", "e", true, true]
      | ["d", "e", true, true]
      | ["a", true, true, true]
      | ["b", true, true, true]
      | ["c", true, true, true]
      | ["d", true, true, true]
      | ["e", true, true, true]
      | [true, true, true, true]
    >();
  });

  test("fixed-prefix readonly arrays", () => {
    expectTypeOf(sample(PREFIX_RO, SAMPLE_SIZE)).toEqualTypeOf<
      | ["a", "b", "c", "d"]
      | ["a", "b", "c", "e"]
      | ["a", "b", "d", "e"]
      | ["a", "c", "d", "e"]
      | ["b", "c", "d", "e"]
      | ["a", "b", "c", true]
      | ["a", "b", "d", true]
      | ["a", "b", "e", true]
      | ["a", "c", "d", true]
      | ["a", "c", "e", true]
      | ["a", "d", "e", true]
      | ["b", "c", "d", true]
      | ["b", "c", "e", true]
      | ["b", "d", "e", true]
      | ["c", "d", "e", true]
      | ["a", "b", true, true]
      | ["a", "c", true, true]
      | ["a", "d", true, true]
      | ["a", "e", true, true]
      | ["b", "c", true, true]
      | ["b", "d", true, true]
      | ["b", "e", true, true]
      | ["c", "d", true, true]
      | ["c", "e", true, true]
      | ["d", "e", true, true]
      | ["a", true, true, true]
      | ["b", true, true, true]
      | ["c", true, true, true]
      | ["d", true, true, true]
      | ["e", true, true, true]
      | [true, true, true, true]
    >();
  });

  test("fixed-suffix arrays", () => {
    expectTypeOf(sample(SUFFIX, SAMPLE_SIZE)).toEqualTypeOf<
      | ["v", "w", "x", "y"]
      | ["v", "w", "x", "z"]
      | ["v", "w", "y", "z"]
      | ["v", "x", "y", "z"]
      | ["w", "x", "y", "z"]
      | [true, "v", "w", "x"]
      | [true, "v", "w", "y"]
      | [true, "v", "w", "z"]
      | [true, "v", "x", "y"]
      | [true, "v", "x", "z"]
      | [true, "v", "y", "z"]
      | [true, "w", "x", "y"]
      | [true, "w", "x", "z"]
      | [true, "w", "y", "z"]
      | [true, "x", "y", "z"]
      | [true, true, "v", "w"]
      | [true, true, "v", "x"]
      | [true, true, "v", "y"]
      | [true, true, "v", "z"]
      | [true, true, "w", "x"]
      | [true, true, "w", "y"]
      | [true, true, "w", "z"]
      | [true, true, "x", "y"]
      | [true, true, "x", "z"]
      | [true, true, "y", "z"]
      | [true, true, true, "v"]
      | [true, true, true, "w"]
      | [true, true, true, "x"]
      | [true, true, true, "y"]
      | [true, true, true, "z"]
      | [true, true, true, true]
    >();
  });

  test("fixed-suffix readonly arrays", () => {
    expectTypeOf(sample(SUFFIX_RO, SAMPLE_SIZE)).toEqualTypeOf<
      | ["v", "w", "x", "y"]
      | ["v", "w", "x", "z"]
      | ["v", "w", "y", "z"]
      | ["v", "x", "y", "z"]
      | ["w", "x", "y", "z"]
      | [true, "v", "w", "x"]
      | [true, "v", "w", "y"]
      | [true, "v", "w", "z"]
      | [true, "v", "x", "y"]
      | [true, "v", "x", "z"]
      | [true, "v", "y", "z"]
      | [true, "w", "x", "y"]
      | [true, "w", "x", "z"]
      | [true, "w", "y", "z"]
      | [true, "x", "y", "z"]
      | [true, true, "v", "w"]
      | [true, true, "v", "x"]
      | [true, true, "v", "y"]
      | [true, true, "v", "z"]
      | [true, true, "w", "x"]
      | [true, true, "w", "y"]
      | [true, true, "w", "z"]
      | [true, true, "x", "y"]
      | [true, true, "x", "z"]
      | [true, true, "y", "z"]
      | [true, true, true, "v"]
      | [true, true, true, "w"]
      | [true, true, true, "x"]
      | [true, true, true, "y"]
      | [true, true, true, "z"]
      | [true, true, true, true]
    >();
  });

  test("fixed array", () => {
    expectTypeOf(sample(FIXED_ARRAY, SAMPLE_SIZE)).toEqualTypeOf<
      | ["a", "b", "c", "y"]
      | ["a", "b", "c", "z"]
      | ["a", "b", "y", "z"]
      | ["a", "c", "y", "z"]
      | ["b", "c", "y", "z"]
      | ["a", "b", "c", true]
      | ["a", "b", true, "y"]
      | ["a", "b", true, "z"]
      | ["a", "c", true, "y"]
      | ["a", "c", true, "z"]
      | ["b", "c", true, "y"]
      | ["b", "c", true, "z"]
      | ["a", true, "y", "z"]
      | ["b", true, "y", "z"]
      | ["c", true, "y", "z"]
      | ["a", "b", true, true]
      | ["a", "c", true, true]
      | ["b", "c", true, true]
      | ["a", true, true, "y"]
      | ["a", true, true, "z"]
      | ["b", true, true, "y"]
      | ["b", true, true, "z"]
      | ["c", true, true, "y"]
      | ["c", true, true, "z"]
      | [true, true, "y", "z"]
      | ["a", true, true, true]
      | ["b", true, true, true]
      | ["c", true, true, true]
      | [true, true, true, "y"]
      | [true, true, true, "z"]
      | [true, true, true, true]
    >();
  });

  test("fixed readonly array", () => {
    expectTypeOf(sample(FIXED_ARRAY_RO, SAMPLE_SIZE)).toEqualTypeOf<
      | ["a", "b", "c", "y"]
      | ["a", "b", "c", "z"]
      | ["a", "b", "y", "z"]
      | ["a", "c", "y", "z"]
      | ["b", "c", "y", "z"]
      | ["a", "b", "c", true]
      | ["a", "b", true, "y"]
      | ["a", "b", true, "z"]
      | ["a", "c", true, "y"]
      | ["a", "c", true, "z"]
      | ["b", "c", true, "y"]
      | ["b", "c", true, "z"]
      | ["a", true, "y", "z"]
      | ["b", true, "y", "z"]
      | ["c", true, "y", "z"]
      | ["a", "b", true, true]
      | ["a", "c", true, true]
      | ["b", "c", true, true]
      | ["a", true, true, "y"]
      | ["a", true, true, "z"]
      | ["b", true, true, "y"]
      | ["b", true, true, "z"]
      | ["c", true, true, "y"]
      | ["c", true, true, "z"]
      | [true, true, "y", "z"]
      | ["a", true, true, true]
      | ["b", true, true, true]
      | ["c", true, true, true]
      | [true, true, true, "y"]
      | [true, true, true, "z"]
      | [true, true, true, true]
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
      | ["a", "b", "c", "d", "e"]
      | ["a", "b", "c", "d", true]
      | ["a", "b", "c", "e", true]
      | ["a", "b", "d", "e", true]
      | ["a", "c", "d", "e", true]
      | ["b", "c", "d", "e", true]
      | ["a", "b", "c", true, true]
      | ["a", "b", "d", true, true]
      | ["a", "b", "e", true, true]
      | ["a", "c", "d", true, true]
      | ["a", "c", "e", true, true]
      | ["a", "d", "e", true, true]
      | ["b", "c", "d", true, true]
      | ["b", "c", "e", true, true]
      | ["b", "d", "e", true, true]
      | ["c", "d", "e", true, true]
      | ["a", "b", true, true, true]
      | ["a", "c", true, true, true]
      | ["a", "d", true, true, true]
      | ["a", "e", true, true, true]
      | ["b", "c", true, true, true]
      | ["b", "d", true, true, true]
      | ["b", "e", true, true, true]
      | ["c", "d", true, true, true]
      | ["c", "e", true, true, true]
      | ["d", "e", true, true, true]
      | ["a", true, true, true, true]
      | ["b", true, true, true, true]
      | ["c", true, true, true, true]
      | ["d", true, true, true, true]
      | ["e", true, true, true, true]
      | [true, true, true, true, true]
    >();
  });

  test("fixed-prefix readonly arrays", () => {
    expectTypeOf(sample(PREFIX_RO, SAMPLE_SIZE)).toEqualTypeOf<
      | ["a", "b", "c", "d", "e"]
      | ["a", "b", "c", "d", true]
      | ["a", "b", "c", "e", true]
      | ["a", "b", "d", "e", true]
      | ["a", "c", "d", "e", true]
      | ["b", "c", "d", "e", true]
      | ["a", "b", "c", true, true]
      | ["a", "b", "d", true, true]
      | ["a", "b", "e", true, true]
      | ["a", "c", "d", true, true]
      | ["a", "c", "e", true, true]
      | ["a", "d", "e", true, true]
      | ["b", "c", "d", true, true]
      | ["b", "c", "e", true, true]
      | ["b", "d", "e", true, true]
      | ["c", "d", "e", true, true]
      | ["a", "b", true, true, true]
      | ["a", "c", true, true, true]
      | ["a", "d", true, true, true]
      | ["a", "e", true, true, true]
      | ["b", "c", true, true, true]
      | ["b", "d", true, true, true]
      | ["b", "e", true, true, true]
      | ["c", "d", true, true, true]
      | ["c", "e", true, true, true]
      | ["d", "e", true, true, true]
      | ["a", true, true, true, true]
      | ["b", true, true, true, true]
      | ["c", true, true, true, true]
      | ["d", true, true, true, true]
      | ["e", true, true, true, true]
      | [true, true, true, true, true]
    >();
  });

  test("fixed-suffix arrays", () => {
    expectTypeOf(sample(SUFFIX, SAMPLE_SIZE)).toEqualTypeOf<
      | ["v", "w", "x", "y", "z"]
      | [true, "v", "w", "x", "y"]
      | [true, "v", "w", "x", "z"]
      | [true, "v", "w", "y", "z"]
      | [true, "v", "x", "y", "z"]
      | [true, "w", "x", "y", "z"]
      | [true, true, "v", "w", "x"]
      | [true, true, "v", "w", "y"]
      | [true, true, "v", "w", "z"]
      | [true, true, "v", "x", "y"]
      | [true, true, "v", "x", "z"]
      | [true, true, "v", "y", "z"]
      | [true, true, "w", "x", "y"]
      | [true, true, "w", "x", "z"]
      | [true, true, "w", "y", "z"]
      | [true, true, "x", "y", "z"]
      | [true, true, true, "v", "w"]
      | [true, true, true, "v", "x"]
      | [true, true, true, "v", "y"]
      | [true, true, true, "v", "z"]
      | [true, true, true, "w", "x"]
      | [true, true, true, "w", "y"]
      | [true, true, true, "w", "z"]
      | [true, true, true, "x", "y"]
      | [true, true, true, "x", "z"]
      | [true, true, true, "y", "z"]
      | [true, true, true, true, "v"]
      | [true, true, true, true, "w"]
      | [true, true, true, true, "x"]
      | [true, true, true, true, "y"]
      | [true, true, true, true, "z"]
      | [true, true, true, true, true]
    >();
  });

  test("fixed-suffix readonly arrays", () => {
    expectTypeOf(sample(SUFFIX_RO, SAMPLE_SIZE)).toEqualTypeOf<
      | ["v", "w", "x", "y", "z"]
      | [true, "v", "w", "x", "y"]
      | [true, "v", "w", "x", "z"]
      | [true, "v", "w", "y", "z"]
      | [true, "v", "x", "y", "z"]
      | [true, "w", "x", "y", "z"]
      | [true, true, "v", "w", "x"]
      | [true, true, "v", "w", "y"]
      | [true, true, "v", "w", "z"]
      | [true, true, "v", "x", "y"]
      | [true, true, "v", "x", "z"]
      | [true, true, "v", "y", "z"]
      | [true, true, "w", "x", "y"]
      | [true, true, "w", "x", "z"]
      | [true, true, "w", "y", "z"]
      | [true, true, "x", "y", "z"]
      | [true, true, true, "v", "w"]
      | [true, true, true, "v", "x"]
      | [true, true, true, "v", "y"]
      | [true, true, true, "v", "z"]
      | [true, true, true, "w", "x"]
      | [true, true, true, "w", "y"]
      | [true, true, true, "w", "z"]
      | [true, true, true, "x", "y"]
      | [true, true, true, "x", "z"]
      | [true, true, true, "y", "z"]
      | [true, true, true, true, "v"]
      | [true, true, true, true, "w"]
      | [true, true, true, true, "x"]
      | [true, true, true, true, "y"]
      | [true, true, true, true, "z"]
      | [true, true, true, true, true]
    >();
  });

  test("fixed array", () => {
    expectTypeOf(sample(FIXED_ARRAY, SAMPLE_SIZE)).toEqualTypeOf<
      | ["a", "b", "c", "y", "z"]
      | ["a", "b", "c", true, "y"]
      | ["a", "b", "c", true, "z"]
      | ["a", "b", true, "y", "z"]
      | ["a", "c", true, "y", "z"]
      | ["b", "c", true, "y", "z"]
      | ["a", "b", "c", true, true]
      | ["a", "b", true, true, "y"]
      | ["a", "b", true, true, "z"]
      | ["a", "c", true, true, "y"]
      | ["a", "c", true, true, "z"]
      | ["b", "c", true, true, "y"]
      | ["b", "c", true, true, "z"]
      | ["a", true, true, "y", "z"]
      | ["b", true, true, "y", "z"]
      | ["c", true, true, "y", "z"]
      | ["a", "b", true, true, true]
      | ["a", "c", true, true, true]
      | ["b", "c", true, true, true]
      | ["a", true, true, true, "y"]
      | ["a", true, true, true, "z"]
      | ["b", true, true, true, "y"]
      | ["b", true, true, true, "z"]
      | ["c", true, true, true, "y"]
      | ["c", true, true, true, "z"]
      | [true, true, true, "y", "z"]
      | ["a", true, true, true, true]
      | ["b", true, true, true, true]
      | ["c", true, true, true, true]
      | [true, true, true, true, "y"]
      | [true, true, true, true, "z"]
      | [true, true, true, true, true]
    >();
  });

  test("fixed readonly array", () => {
    expectTypeOf(sample(FIXED_ARRAY_RO, SAMPLE_SIZE)).toEqualTypeOf<
      | ["a", "b", "c", "y", "z"]
      | ["a", "b", "c", true, "y"]
      | ["a", "b", "c", true, "z"]
      | ["a", "b", true, "y", "z"]
      | ["a", "c", true, "y", "z"]
      | ["b", "c", true, "y", "z"]
      | ["a", "b", "c", true, true]
      | ["a", "b", true, true, "y"]
      | ["a", "b", true, true, "z"]
      | ["a", "c", true, true, "y"]
      | ["a", "c", true, true, "z"]
      | ["b", "c", true, true, "y"]
      | ["b", "c", true, true, "z"]
      | ["a", true, true, "y", "z"]
      | ["b", true, true, "y", "z"]
      | ["c", true, true, "y", "z"]
      | ["a", "b", true, true, true]
      | ["a", "c", true, true, true]
      | ["b", "c", true, true, true]
      | ["a", true, true, true, "y"]
      | ["a", true, true, true, "z"]
      | ["b", true, true, true, "y"]
      | ["b", true, true, true, "z"]
      | ["c", true, true, true, "y"]
      | ["c", true, true, true, "z"]
      | [true, true, true, "y", "z"]
      | ["a", true, true, true, true]
      | ["b", true, true, true, true]
      | ["c", true, true, true, true]
      | [true, true, true, true, "y"]
      | [true, true, true, true, "z"]
      | [true, true, true, true, true]
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
      | ["a", "b", "c", "d", "e"]
      | ["a", "b", "c", "d", "e", true]
      | ["a", "b", "c", "d", "e", true, true]
      | ["a", "b", "c", "d", "e", true, true, true]
      | ["a", "b", "c", "d", "e", true, true, true, true]
      | ["a", "b", "c", "d", "e", true, true, true, true, true]
      | ["a", "b", "c", "d", true, true, true, true, true, true]
      | ["a", "b", "c", "e", true, true, true, true, true, true]
      | ["a", "b", "d", "e", true, true, true, true, true, true]
      | ["a", "c", "d", "e", true, true, true, true, true, true]
      | ["b", "c", "d", "e", true, true, true, true, true, true]
      | ["a", "b", "c", true, true, true, true, true, true, true]
      | ["a", "b", "d", true, true, true, true, true, true, true]
      | ["a", "b", "e", true, true, true, true, true, true, true]
      | ["a", "c", "d", true, true, true, true, true, true, true]
      | ["a", "c", "e", true, true, true, true, true, true, true]
      | ["a", "d", "e", true, true, true, true, true, true, true]
      | ["b", "c", "d", true, true, true, true, true, true, true]
      | ["b", "c", "e", true, true, true, true, true, true, true]
      | ["b", "d", "e", true, true, true, true, true, true, true]
      | ["c", "d", "e", true, true, true, true, true, true, true]
      | ["a", "b", true, true, true, true, true, true, true, true]
      | ["a", "c", true, true, true, true, true, true, true, true]
      | ["a", "d", true, true, true, true, true, true, true, true]
      | ["a", "e", true, true, true, true, true, true, true, true]
      | ["b", "c", true, true, true, true, true, true, true, true]
      | ["b", "d", true, true, true, true, true, true, true, true]
      | ["b", "e", true, true, true, true, true, true, true, true]
      | ["c", "d", true, true, true, true, true, true, true, true]
      | ["c", "e", true, true, true, true, true, true, true, true]
      | ["d", "e", true, true, true, true, true, true, true, true]
      | ["a", true, true, true, true, true, true, true, true, true]
      | ["b", true, true, true, true, true, true, true, true, true]
      | ["c", true, true, true, true, true, true, true, true, true]
      | ["d", true, true, true, true, true, true, true, true, true]
      | ["e", true, true, true, true, true, true, true, true, true]
      | [true, true, true, true, true, true, true, true, true, true]
    >();
  });

  test("fixed-prefix readonly arrays", () => {
    expectTypeOf(sample(PREFIX_RO, SAMPLE_SIZE)).toEqualTypeOf<
      | ["a", "b", "c", "d", "e"]
      | ["a", "b", "c", "d", "e", true]
      | ["a", "b", "c", "d", "e", true, true]
      | ["a", "b", "c", "d", "e", true, true, true]
      | ["a", "b", "c", "d", "e", true, true, true, true]
      | ["a", "b", "c", "d", "e", true, true, true, true, true]
      | ["a", "b", "c", "d", true, true, true, true, true, true]
      | ["a", "b", "c", "e", true, true, true, true, true, true]
      | ["a", "b", "d", "e", true, true, true, true, true, true]
      | ["a", "c", "d", "e", true, true, true, true, true, true]
      | ["b", "c", "d", "e", true, true, true, true, true, true]
      | ["a", "b", "c", true, true, true, true, true, true, true]
      | ["a", "b", "d", true, true, true, true, true, true, true]
      | ["a", "b", "e", true, true, true, true, true, true, true]
      | ["a", "c", "d", true, true, true, true, true, true, true]
      | ["a", "c", "e", true, true, true, true, true, true, true]
      | ["a", "d", "e", true, true, true, true, true, true, true]
      | ["b", "c", "d", true, true, true, true, true, true, true]
      | ["b", "c", "e", true, true, true, true, true, true, true]
      | ["b", "d", "e", true, true, true, true, true, true, true]
      | ["c", "d", "e", true, true, true, true, true, true, true]
      | ["a", "b", true, true, true, true, true, true, true, true]
      | ["a", "c", true, true, true, true, true, true, true, true]
      | ["a", "d", true, true, true, true, true, true, true, true]
      | ["a", "e", true, true, true, true, true, true, true, true]
      | ["b", "c", true, true, true, true, true, true, true, true]
      | ["b", "d", true, true, true, true, true, true, true, true]
      | ["b", "e", true, true, true, true, true, true, true, true]
      | ["c", "d", true, true, true, true, true, true, true, true]
      | ["c", "e", true, true, true, true, true, true, true, true]
      | ["d", "e", true, true, true, true, true, true, true, true]
      | ["a", true, true, true, true, true, true, true, true, true]
      | ["b", true, true, true, true, true, true, true, true, true]
      | ["c", true, true, true, true, true, true, true, true, true]
      | ["d", true, true, true, true, true, true, true, true, true]
      | ["e", true, true, true, true, true, true, true, true, true]
      | [true, true, true, true, true, true, true, true, true, true]
    >();
  });

  test("fixed-suffix arrays", () => {
    expectTypeOf(sample(SUFFIX, SAMPLE_SIZE)).toEqualTypeOf<
      | ["v", "w", "x", "y", "z"]
      | [true, "v", "w", "x", "y", "z"]
      | [true, true, "v", "w", "x", "y", "z"]
      | [true, true, true, "v", "w", "x", "y", "z"]
      | [true, true, true, true, "v", "w", "x", "y", "z"]
      | [true, true, true, true, true, "v", "w", "x", "y", "z"]
      | [true, true, true, true, true, true, "v", "w", "x", "y"]
      | [true, true, true, true, true, true, "v", "w", "x", "z"]
      | [true, true, true, true, true, true, "v", "w", "y", "z"]
      | [true, true, true, true, true, true, "v", "x", "y", "z"]
      | [true, true, true, true, true, true, "w", "x", "y", "z"]
      | [true, true, true, true, true, true, true, "v", "w", "x"]
      | [true, true, true, true, true, true, true, "v", "w", "y"]
      | [true, true, true, true, true, true, true, "v", "w", "z"]
      | [true, true, true, true, true, true, true, "v", "x", "y"]
      | [true, true, true, true, true, true, true, "v", "x", "z"]
      | [true, true, true, true, true, true, true, "v", "y", "z"]
      | [true, true, true, true, true, true, true, "w", "x", "y"]
      | [true, true, true, true, true, true, true, "w", "x", "z"]
      | [true, true, true, true, true, true, true, "w", "y", "z"]
      | [true, true, true, true, true, true, true, "x", "y", "z"]
      | [true, true, true, true, true, true, true, true, "v", "w"]
      | [true, true, true, true, true, true, true, true, "v", "x"]
      | [true, true, true, true, true, true, true, true, "v", "y"]
      | [true, true, true, true, true, true, true, true, "v", "z"]
      | [true, true, true, true, true, true, true, true, "w", "x"]
      | [true, true, true, true, true, true, true, true, "w", "y"]
      | [true, true, true, true, true, true, true, true, "w", "z"]
      | [true, true, true, true, true, true, true, true, "x", "y"]
      | [true, true, true, true, true, true, true, true, "x", "z"]
      | [true, true, true, true, true, true, true, true, "y", "z"]
      | [true, true, true, true, true, true, true, true, true, "v"]
      | [true, true, true, true, true, true, true, true, true, "w"]
      | [true, true, true, true, true, true, true, true, true, "x"]
      | [true, true, true, true, true, true, true, true, true, "y"]
      | [true, true, true, true, true, true, true, true, true, "z"]
      | [true, true, true, true, true, true, true, true, true, true]
    >();
  });

  test("fixed-suffix readonly arrays", () => {
    expectTypeOf(sample(SUFFIX_RO, SAMPLE_SIZE)).toEqualTypeOf<
      | ["v", "w", "x", "y", "z"]
      | [true, "v", "w", "x", "y", "z"]
      | [true, true, "v", "w", "x", "y", "z"]
      | [true, true, true, "v", "w", "x", "y", "z"]
      | [true, true, true, true, "v", "w", "x", "y", "z"]
      | [true, true, true, true, true, "v", "w", "x", "y", "z"]
      | [true, true, true, true, true, true, "v", "w", "x", "y"]
      | [true, true, true, true, true, true, "v", "w", "x", "z"]
      | [true, true, true, true, true, true, "v", "w", "y", "z"]
      | [true, true, true, true, true, true, "v", "x", "y", "z"]
      | [true, true, true, true, true, true, "w", "x", "y", "z"]
      | [true, true, true, true, true, true, true, "v", "w", "x"]
      | [true, true, true, true, true, true, true, "v", "w", "y"]
      | [true, true, true, true, true, true, true, "v", "w", "z"]
      | [true, true, true, true, true, true, true, "v", "x", "y"]
      | [true, true, true, true, true, true, true, "v", "x", "z"]
      | [true, true, true, true, true, true, true, "v", "y", "z"]
      | [true, true, true, true, true, true, true, "w", "x", "y"]
      | [true, true, true, true, true, true, true, "w", "x", "z"]
      | [true, true, true, true, true, true, true, "w", "y", "z"]
      | [true, true, true, true, true, true, true, "x", "y", "z"]
      | [true, true, true, true, true, true, true, true, "v", "w"]
      | [true, true, true, true, true, true, true, true, "v", "x"]
      | [true, true, true, true, true, true, true, true, "v", "y"]
      | [true, true, true, true, true, true, true, true, "v", "z"]
      | [true, true, true, true, true, true, true, true, "w", "x"]
      | [true, true, true, true, true, true, true, true, "w", "y"]
      | [true, true, true, true, true, true, true, true, "w", "z"]
      | [true, true, true, true, true, true, true, true, "x", "y"]
      | [true, true, true, true, true, true, true, true, "x", "z"]
      | [true, true, true, true, true, true, true, true, "y", "z"]
      | [true, true, true, true, true, true, true, true, true, "v"]
      | [true, true, true, true, true, true, true, true, true, "w"]
      | [true, true, true, true, true, true, true, true, true, "x"]
      | [true, true, true, true, true, true, true, true, true, "y"]
      | [true, true, true, true, true, true, true, true, true, "z"]
      | [true, true, true, true, true, true, true, true, true, true]
    >();
  });

  test("fixed array", () => {
    expectTypeOf(sample(FIXED_ARRAY, SAMPLE_SIZE)).toEqualTypeOf<
      | ["a", "b", "c", "y", "z"]
      | ["a", "b", "c", true, "y", "z"]
      | ["a", "b", "c", true, true, "y", "z"]
      | ["a", "b", "c", true, true, true, "y", "z"]
      | ["a", "b", "c", true, true, true, true, "y", "z"]
      | ["a", "b", "c", true, true, true, true, true, "y", "z"]
      | ["a", "b", "c", true, true, true, true, true, true, "y"]
      | ["a", "b", "c", true, true, true, true, true, true, "z"]
      | ["a", "b", true, true, true, true, true, true, "y", "z"]
      | ["a", "c", true, true, true, true, true, true, "y", "z"]
      | ["b", "c", true, true, true, true, true, true, "y", "z"]
      | ["a", "b", "c", true, true, true, true, true, true, true]
      | ["a", "b", true, true, true, true, true, true, true, "y"]
      | ["a", "b", true, true, true, true, true, true, true, "z"]
      | ["a", "c", true, true, true, true, true, true, true, "y"]
      | ["a", "c", true, true, true, true, true, true, true, "z"]
      | ["b", "c", true, true, true, true, true, true, true, "y"]
      | ["b", "c", true, true, true, true, true, true, true, "z"]
      | ["a", true, true, true, true, true, true, true, "y", "z"]
      | ["b", true, true, true, true, true, true, true, "y", "z"]
      | ["c", true, true, true, true, true, true, true, "y", "z"]
      | ["a", "b", true, true, true, true, true, true, true, true]
      | ["a", "c", true, true, true, true, true, true, true, true]
      | ["b", "c", true, true, true, true, true, true, true, true]
      | ["a", true, true, true, true, true, true, true, true, "y"]
      | ["a", true, true, true, true, true, true, true, true, "z"]
      | ["b", true, true, true, true, true, true, true, true, "y"]
      | ["b", true, true, true, true, true, true, true, true, "z"]
      | ["c", true, true, true, true, true, true, true, true, "y"]
      | ["c", true, true, true, true, true, true, true, true, "z"]
      | [true, true, true, true, true, true, true, true, "y", "z"]
      | ["a", true, true, true, true, true, true, true, true, true]
      | ["b", true, true, true, true, true, true, true, true, true]
      | ["c", true, true, true, true, true, true, true, true, true]
      | [true, true, true, true, true, true, true, true, true, "y"]
      | [true, true, true, true, true, true, true, true, true, "z"]
      | [true, true, true, true, true, true, true, true, true, true]
    >();
  });

  test("fixed readonly array", () => {
    expectTypeOf(sample(FIXED_ARRAY_RO, SAMPLE_SIZE)).toEqualTypeOf<
      | ["a", "b", "c", "y", "z"]
      | ["a", "b", "c", true, "y", "z"]
      | ["a", "b", "c", true, true, "y", "z"]
      | ["a", "b", "c", true, true, true, "y", "z"]
      | ["a", "b", "c", true, true, true, true, "y", "z"]
      | ["a", "b", "c", true, true, true, true, true, "y", "z"]
      | ["a", "b", "c", true, true, true, true, true, true, "y"]
      | ["a", "b", "c", true, true, true, true, true, true, "z"]
      | ["a", "b", true, true, true, true, true, true, "y", "z"]
      | ["a", "c", true, true, true, true, true, true, "y", "z"]
      | ["b", "c", true, true, true, true, true, true, "y", "z"]
      | ["a", "b", "c", true, true, true, true, true, true, true]
      | ["a", "b", true, true, true, true, true, true, true, "y"]
      | ["a", "b", true, true, true, true, true, true, true, "z"]
      | ["a", "c", true, true, true, true, true, true, true, "y"]
      | ["a", "c", true, true, true, true, true, true, true, "z"]
      | ["b", "c", true, true, true, true, true, true, true, "y"]
      | ["b", "c", true, true, true, true, true, true, true, "z"]
      | ["a", true, true, true, true, true, true, true, "y", "z"]
      | ["b", true, true, true, true, true, true, true, "y", "z"]
      | ["c", true, true, true, true, true, true, true, "y", "z"]
      | ["a", "b", true, true, true, true, true, true, true, true]
      | ["a", "c", true, true, true, true, true, true, true, true]
      | ["b", "c", true, true, true, true, true, true, true, true]
      | ["a", true, true, true, true, true, true, true, true, "y"]
      | ["a", true, true, true, true, true, true, true, true, "z"]
      | ["b", true, true, true, true, true, true, true, true, "y"]
      | ["b", true, true, true, true, true, true, true, true, "z"]
      | ["c", true, true, true, true, true, true, true, true, "y"]
      | ["c", true, true, true, true, true, true, true, true, "z"]
      | [true, true, true, true, true, true, true, true, "y", "z"]
      | ["a", true, true, true, true, true, true, true, true, true]
      | ["b", true, true, true, true, true, true, true, true, true]
      | ["c", true, true, true, true, true, true, true, true, true]
      | [true, true, true, true, true, true, true, true, true, "y"]
      | [true, true, true, true, true, true, true, true, true, "z"]
      | [true, true, true, true, true, true, true, true, true, true]
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
      | ["a", "b", "d", "e"]
      | ["a", "c", "d", "e"]
      | ["b", "c", "d", "e"]
      | ["a", "b", "c"]
      | ["a", "b", "d"]
      | ["a", "b", "e"]
      | ["a", "c", "d"]
      | ["a", "c", "e"]
      | ["a", "d", "e"]
      | ["b", "c", "d"]
      | ["b", "c", "e"]
      | ["b", "d", "e"]
      | ["c", "d", "e"]
      | ["a", "b"]
      | ["a", "c"]
      | ["a", "d"]
      | ["a", "e"]
      | ["b", "c"]
      | ["b", "d"]
      | ["b", "e"]
      | ["c", "d"]
      | ["c", "e"]
      | ["d", "e"]
      | ["a"]
      | ["b"]
      | ["c"]
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
      | ["a", "b", "d", "e"]
      | ["a", "c", "d", "e"]
      | ["b", "c", "d", "e"]
      | ["a", "b", "c"]
      | ["a", "b", "d"]
      | ["a", "b", "e"]
      | ["a", "c", "d"]
      | ["a", "c", "e"]
      | ["a", "d", "e"]
      | ["b", "c", "d"]
      | ["b", "c", "e"]
      | ["b", "d", "e"]
      | ["c", "d", "e"]
      | ["a", "b"]
      | ["a", "c"]
      | ["a", "d"]
      | ["a", "e"]
      | ["b", "c"]
      | ["b", "d"]
      | ["b", "e"]
      | ["c", "d"]
      | ["c", "e"]
      | ["d", "e"]
      | ["a"]
      | ["b"]
      | ["c"]
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
      | ["a", "b", "d", "e", ...Array<true>]
      | ["a", "c", "d", "e", ...Array<true>]
      | ["b", "c", "d", "e", ...Array<true>]
      | ["a", "b", "c", ...Array<true>]
      | ["a", "b", "d", ...Array<true>]
      | ["a", "b", "e", ...Array<true>]
      | ["a", "c", "d", ...Array<true>]
      | ["a", "c", "e", ...Array<true>]
      | ["a", "d", "e", ...Array<true>]
      | ["b", "c", "d", ...Array<true>]
      | ["b", "c", "e", ...Array<true>]
      | ["b", "d", "e", ...Array<true>]
      | ["c", "d", "e", ...Array<true>]
      | ["a", "b", ...Array<true>]
      | ["a", "c", ...Array<true>]
      | ["a", "d", ...Array<true>]
      | ["a", "e", ...Array<true>]
      | ["b", "c", ...Array<true>]
      | ["b", "d", ...Array<true>]
      | ["b", "e", ...Array<true>]
      | ["c", "d", ...Array<true>]
      | ["c", "e", ...Array<true>]
      | ["d", "e", ...Array<true>]
      | ["a", ...Array<true>]
      | ["b", ...Array<true>]
      | ["c", ...Array<true>]
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
      | ["a", "b", "d", "e", ...Array<true>]
      | ["a", "c", "d", "e", ...Array<true>]
      | ["b", "c", "d", "e", ...Array<true>]
      | ["a", "b", "c", ...Array<true>]
      | ["a", "b", "d", ...Array<true>]
      | ["a", "b", "e", ...Array<true>]
      | ["a", "c", "d", ...Array<true>]
      | ["a", "c", "e", ...Array<true>]
      | ["a", "d", "e", ...Array<true>]
      | ["b", "c", "d", ...Array<true>]
      | ["b", "c", "e", ...Array<true>]
      | ["b", "d", "e", ...Array<true>]
      | ["c", "d", "e", ...Array<true>]
      | ["a", "b", ...Array<true>]
      | ["a", "c", ...Array<true>]
      | ["a", "d", ...Array<true>]
      | ["a", "e", ...Array<true>]
      | ["b", "c", ...Array<true>]
      | ["b", "d", ...Array<true>]
      | ["b", "e", ...Array<true>]
      | ["c", "d", ...Array<true>]
      | ["c", "e", ...Array<true>]
      | ["d", "e", ...Array<true>]
      | ["a", ...Array<true>]
      | ["b", ...Array<true>]
      | ["c", ...Array<true>]
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
      | [...Array<true>, "v", "w", "y", "z"]
      | [...Array<true>, "v", "x", "y", "z"]
      | [...Array<true>, "w", "x", "y", "z"]
      | [...Array<true>, "v", "w", "x"]
      | [...Array<true>, "v", "w", "y"]
      | [...Array<true>, "v", "w", "z"]
      | [...Array<true>, "v", "x", "y"]
      | [...Array<true>, "v", "x", "z"]
      | [...Array<true>, "v", "y", "z"]
      | [...Array<true>, "w", "x", "y"]
      | [...Array<true>, "w", "x", "z"]
      | [...Array<true>, "w", "y", "z"]
      | [...Array<true>, "x", "y", "z"]
      | [...Array<true>, "v", "w"]
      | [...Array<true>, "v", "x"]
      | [...Array<true>, "v", "y"]
      | [...Array<true>, "v", "z"]
      | [...Array<true>, "w", "x"]
      | [...Array<true>, "w", "y"]
      | [...Array<true>, "w", "z"]
      | [...Array<true>, "x", "y"]
      | [...Array<true>, "x", "z"]
      | [...Array<true>, "y", "z"]
      | [...Array<true>, "v"]
      | [...Array<true>, "w"]
      | [...Array<true>, "x"]
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
      | [...Array<true>, "v", "w", "y", "z"]
      | [...Array<true>, "v", "x", "y", "z"]
      | [...Array<true>, "w", "x", "y", "z"]
      | [...Array<true>, "v", "w", "x"]
      | [...Array<true>, "v", "w", "y"]
      | [...Array<true>, "v", "w", "z"]
      | [...Array<true>, "v", "x", "y"]
      | [...Array<true>, "v", "x", "z"]
      | [...Array<true>, "v", "y", "z"]
      | [...Array<true>, "w", "x", "y"]
      | [...Array<true>, "w", "x", "z"]
      | [...Array<true>, "w", "y", "z"]
      | [...Array<true>, "x", "y", "z"]
      | [...Array<true>, "v", "w"]
      | [...Array<true>, "v", "x"]
      | [...Array<true>, "v", "y"]
      | [...Array<true>, "v", "z"]
      | [...Array<true>, "w", "x"]
      | [...Array<true>, "w", "y"]
      | [...Array<true>, "w", "z"]
      | [...Array<true>, "x", "y"]
      | [...Array<true>, "x", "z"]
      | [...Array<true>, "y", "z"]
      | [...Array<true>, "v"]
      | [...Array<true>, "w"]
      | [...Array<true>, "x"]
      | [...Array<true>, "y"]
      | [...Array<true>, "z"]
      | Array<true>
    >();
  });

  test("fixed array", () => {
    expectTypeOf(sample(FIXED_ARRAY, SAMPLE_SIZE)).toEqualTypeOf<
      | ["a", "b", "c", ...Array<true>, "y", "z"]
      | ["a", "b", "c", ...Array<true>, "y"]
      | ["a", "b", "c", ...Array<true>, "z"]
      | ["a", "b", ...Array<true>, "y", "z"]
      | ["a", "c", ...Array<true>, "y", "z"]
      | ["b", "c", ...Array<true>, "y", "z"]
      | ["a", "b", "c", ...Array<true>]
      | ["a", "b", ...Array<true>, "y"]
      | ["a", "b", ...Array<true>, "z"]
      | ["a", "c", ...Array<true>, "y"]
      | ["a", "c", ...Array<true>, "z"]
      | ["b", "c", ...Array<true>, "y"]
      | ["b", "c", ...Array<true>, "z"]
      | ["a", ...Array<true>, "y", "z"]
      | ["b", ...Array<true>, "y", "z"]
      | ["c", ...Array<true>, "y", "z"]
      | ["a", "b", ...Array<true>]
      | ["a", "c", ...Array<true>]
      | ["b", "c", ...Array<true>]
      | ["a", ...Array<true>, "y"]
      | ["a", ...Array<true>, "z"]
      | ["b", ...Array<true>, "y"]
      | ["b", ...Array<true>, "z"]
      | ["c", ...Array<true>, "y"]
      | ["c", ...Array<true>, "z"]
      | [...Array<true>, "y", "z"]
      | ["a", ...Array<true>]
      | ["b", ...Array<true>]
      | ["c", ...Array<true>]
      | [...Array<true>, "y"]
      | [...Array<true>, "z"]
      | Array<true>
    >();
  });

  test("fixed readonly array", () => {
    expectTypeOf(sample(FIXED_ARRAY_RO, SAMPLE_SIZE)).toEqualTypeOf<
      | ["a", "b", "c", ...Array<true>, "y", "z"]
      | ["a", "b", "c", ...Array<true>, "y"]
      | ["a", "b", "c", ...Array<true>, "z"]
      | ["a", "b", ...Array<true>, "y", "z"]
      | ["a", "c", ...Array<true>, "y", "z"]
      | ["b", "c", ...Array<true>, "y", "z"]
      | ["a", "b", "c", ...Array<true>]
      | ["a", "b", ...Array<true>, "y"]
      | ["a", "b", ...Array<true>, "z"]
      | ["a", "c", ...Array<true>, "y"]
      | ["a", "c", ...Array<true>, "z"]
      | ["b", "c", ...Array<true>, "y"]
      | ["b", "c", ...Array<true>, "z"]
      | ["a", ...Array<true>, "y", "z"]
      | ["b", ...Array<true>, "y", "z"]
      | ["c", ...Array<true>, "y", "z"]
      | ["a", "b", ...Array<true>]
      | ["a", "c", ...Array<true>]
      | ["b", "c", ...Array<true>]
      | ["a", ...Array<true>, "y"]
      | ["a", ...Array<true>, "z"]
      | ["b", ...Array<true>, "y"]
      | ["b", ...Array<true>, "z"]
      | ["c", ...Array<true>, "y"]
      | ["c", ...Array<true>, "z"]
      | [...Array<true>, "y", "z"]
      | ["a", ...Array<true>]
      | ["b", ...Array<true>]
      | ["c", ...Array<true>]
      | [...Array<true>, "y"]
      | [...Array<true>, "z"]
      | Array<true>
    >();
  });
});
