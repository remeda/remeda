/* eslint-disable unicorn/prefer-string-raw --
 * We want to have the same inputs as the type-tests.
 */

import { describe, expect, test } from "vitest";
import { stringToPath } from "./stringToPath";

//! IMPORTANT: The tests in this file need to be synced with the type tests so that we can ensure that the function's runtime implementation returns the same values as the functions type computes. This is critical for this utility because its main purpose is to couple the path string parsing logic with the type so that it could be used in utility functions that take a strictly typed path array as input (e.g. `pathOr`, `setPath`, etc...).

test("empty string", () => {
  expect(stringToPath("")).toStrictEqual([]);
});

test("single property", () => {
  expect(stringToPath("foo")).toStrictEqual(["foo"]);
});

test("single array index", () => {
  expect(stringToPath("123")).toStrictEqual([123]);
});

describe("dot notation", () => {
  test("short chain", () => {
    expect(stringToPath("foo.bar")).toStrictEqual(["foo", "bar"]);
  });

  test("long chain", () => {
    expect(
      stringToPath("a.b.c.d.e.f.g.h.i.j.k.l.m.n.o.p.q.r.s.t.u.v.w.x.y.z"),
    ).toStrictEqual([
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
      "l",
      "m",
      "n",
      "o",
      "p",
      "q",
      "r",
      "s",
      "t",
      "u",
      "v",
      "w",
      "x",
      "y",
      "z",
    ]);
  });

  test("array index before", () => {
    expect(stringToPath("123.foo")).toStrictEqual([123, "foo"]);
  });

  test("array index after", () => {
    expect(stringToPath("foo.123")).toStrictEqual(["foo", 123]);
  });
});

describe("square bracket notation", () => {
  test("array index", () => {
    expect(stringToPath("foo[123]")).toStrictEqual(["foo", 123]);
  });

  test("array index with dot notation after access", () => {
    expect(stringToPath("foo[123].bar")).toStrictEqual(["foo", 123, "bar"]);
  });

  test("array index with dot notation before access", () => {
    expect(stringToPath("foo.bar[123]")).toStrictEqual(["foo", "bar", 123]);
  });

  test("sequential array index accesses", () => {
    expect(stringToPath("foo[123][456]")).toStrictEqual(["foo", 123, 456]);
  });

  test("complex mix of array index and chained properties", () => {
    expect(stringToPath("foo[123].bar.baz[456][789].qux")).toStrictEqual([
      "foo",
      123,
      "bar",
      "baz",
      456,
      789,
      "qux",
    ]);
  });

  test("unquoted object property access", () => {
    expect(stringToPath("foo[bar]")).toStrictEqual(["foo", "bar"]);
    expect(stringToPath("foo[bar].baz")).toStrictEqual(["foo", "bar", "baz"]);
  });

  test("single quoted object property access", () => {
    expect(stringToPath("foo['bar']")).toStrictEqual(["foo", "bar"]);
    expect(stringToPath("foo['bar'].baz")).toStrictEqual(["foo", "bar", "baz"]);
  });

  test("double quoted object property access", () => {
    expect(stringToPath('foo["bar"]')).toStrictEqual(["foo", "bar"]);
    expect(stringToPath('foo["bar"].baz')).toStrictEqual(["foo", "bar", "baz"]);
  });

  test("recursive chained properties", () => {
    expect(stringToPath("foo[bar.baz]")).toStrictEqual(["foo", "bar", "baz"]);
  });

  test("2d array access", () => {
    expect(stringToPath("123[456]")).toStrictEqual([123, 456]);
  });

  test("square bracket for a number", () => {
    expect(stringToPath("[123]")).toStrictEqual([123]);
  });

  test("properties with numbers", () => {
    expect(stringToPath("foo[abc123]")).toStrictEqual(["foo", "abc123"]);
    expect(stringToPath("foo[123abc]")).toStrictEqual(["foo", "123abc"]);
  });
});

describe("quoted properties edge-cases", () => {
  test("hyphens", () => {
    expect(stringToPath("foo['bar-baz']")).toStrictEqual(["foo", "bar-baz"]);
  });

  test("underscores", () => {
    expect(stringToPath("foo['bar_baz']")).toStrictEqual(["foo", "bar_baz"]);
  });

  test("spaces", () => {
    expect(stringToPath("foo['bar baz']")).toStrictEqual(["foo", "bar baz"]);
    expect(stringToPath("foo[' bar']")).toStrictEqual(["foo", " bar"]);
    expect(stringToPath("foo['bar ']")).toStrictEqual(["foo", "bar "]);
    expect(stringToPath("foo[' bar ']")).toStrictEqual(["foo", " bar "]);
  });

  test("dots", () => {
    expect(stringToPath("foo['bar.baz']")).toStrictEqual(["foo", "bar.baz"]);
  });

  test("square brackets", () => {
    expect(stringToPath("foo['bar[baz]']")).toStrictEqual(["foo", "bar[baz]"]);
  });

  test("numbers", () => {
    expect(stringToPath("foo['123']")).toStrictEqual(["foo", "123"]);
  });

  test("non-matching quotes", () => {
    expect(stringToPath("foo['bar\"]")).toStrictEqual(["foo", "'bar\""]);
    expect(stringToPath("foo[\"bar']")).toStrictEqual(["foo", "\"bar'"]);
  });

  test("missing quote", () => {
    expect(stringToPath("foo['bar]")).toStrictEqual(["foo", "'bar"]);
    expect(stringToPath('foo["bar]')).toStrictEqual(["foo", '"bar']);
    expect(stringToPath("foo[bar']")).toStrictEqual(["foo", "bar'"]);
    expect(stringToPath('foo[bar"]')).toStrictEqual(["foo", 'bar"']);
  });
});

describe("empty segments edge-cases", () => {
  test("empty quoted access", () => {
    expect(stringToPath("foo[''].bar")).toStrictEqual(["foo", "", "bar"]);
  });
});

// We make sure that our limitations from the type system are always reflected
// by the runtime implementation, so that our type reflects the real output of
// our function. Because the type is more complicated than the runtime
// implementation we use the type tests as the specification for the
// runtime implementation.
describe("known type limitations", () => {
  test.todo("nested object access", () => {
    expect(stringToPath("foo[bar[baz]]")).toStrictEqual([
      "foo",
      "bar[baz",
      "]",
    ]);
  });

  test("two sequential dots", () => {
    expect(stringToPath("foo..bar")).toStrictEqual(["foo", "bar"]);
  });

  test("empty unquoted access", () => {
    expect(stringToPath("foo[].bar")).toStrictEqual(["foo", "bar"]);
  });

  test("using backslash to escape a quote", () => {
    expect(stringToPath("a['b\\'c']")).toStrictEqual(["a", "b\\'c"]);
  });

  test("using backslash to escape a double-quote", () => {
    expect(stringToPath('a["b\\"c"]')).toStrictEqual(["a", 'b\\"c']);
  });

  test("using a backslash to escape a backslash", () => {
    expect(stringToPath("a['b\\\\c']")).toStrictEqual(["a", "b\\\\c"]);
  });

  describe("whitespace handling", () => {
    test("between the brackets and the quotes", () => {
      expect(stringToPath("foo[ 'bar']")).toStrictEqual(["foo", " 'bar'"]);
      expect(stringToPath("foo['bar' ]")).toStrictEqual(["foo", "'bar' "]);
      expect(stringToPath("foo[ 'bar' ]")).toStrictEqual(["foo", " 'bar' "]);
    });

    test("between the brackets and the property", () => {
      expect(stringToPath("foo[ bar]")).toStrictEqual(["foo", " bar"]);
      expect(stringToPath("foo[bar ]")).toStrictEqual(["foo", "bar "]);
      expect(stringToPath("foo[ bar ]")).toStrictEqual(["foo", " bar "]);
    });

    test("between the brackets and an array index", () => {
      expect(stringToPath("foo[ 123]")).toStrictEqual(["foo", " 123"]);
      expect(stringToPath("foo[123 ]")).toStrictEqual(["foo", "123 "]);
      expect(stringToPath("foo[ 123 ]")).toStrictEqual(["foo", " 123 "]);
    });

    test("around dots", () => {
      expect(stringToPath("foo .bar")).toStrictEqual(["foo ", "bar"]);
      expect(stringToPath("foo. bar")).toStrictEqual(["foo", " bar"]);
      expect(stringToPath("foo . bar")).toStrictEqual(["foo ", " bar"]);
    });

    test("around prop names", () => {
      expect(stringToPath("foo ")).toStrictEqual(["foo "]);
      expect(stringToPath(" foo")).toStrictEqual([" foo"]);
      expect(stringToPath(" foo ")).toStrictEqual([" foo "]);
    });
  });
});

test.each(
  // ¯\_(ツ)_/¯
  [".", "..", "[", "]", "[[", "]]", "[.", "].", ".[", ".]"],
)("malformed input: %s", (input) => {
  expect(stringToPath(input)).toStrictEqual([input]);
});
