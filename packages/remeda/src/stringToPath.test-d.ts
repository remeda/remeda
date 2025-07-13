import { describe, expectTypeOf, test } from "vitest";
import { stringToPath } from "./stringToPath";

test("empty string", () => {
  expectTypeOf(stringToPath("")).toEqualTypeOf<[]>();
});

test("single property", () => {
  expectTypeOf(stringToPath("foo")).toEqualTypeOf<["foo"]>();
});

test("single array index", () => {
  expectTypeOf(stringToPath("123")).toEqualTypeOf<[123]>();
});

describe("dynamic strings are not inferred", () => {
  test("primitive string", () => {
    expectTypeOf(stringToPath("foo" as string)).toEqualTypeOf<never>();
  });

  test("template literals", () => {
    expectTypeOf(
      stringToPath(`foo.${"bar" as string}[baz]`),
    ).toEqualTypeOf<never>();
  });
});

describe("dot notation", () => {
  test("short chain", () => {
    expectTypeOf(stringToPath("foo.bar")).toEqualTypeOf<["foo", "bar"]>();
  });

  test("long chain", () => {
    expectTypeOf(
      stringToPath("a.b.c.d.e.f.g.h.i.j.k.l.m.n.o.p.q.r.s.t.u.v.w.x.y.z"),
    ).toEqualTypeOf<
      [
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
      ]
    >();
  });

  test("array index before", () => {
    expectTypeOf(stringToPath("123.foo")).toEqualTypeOf<[123, "foo"]>();
  });

  test("array index after", () => {
    expectTypeOf(stringToPath("foo.123")).toEqualTypeOf<["foo", 123]>();
  });
});

describe("square bracket notation", () => {
  test("array index", () => {
    expectTypeOf(stringToPath("foo[123]")).toEqualTypeOf<["foo", 123]>();
  });

  test("array index with dot notation after access", () => {
    expectTypeOf(stringToPath("foo[123].bar")).toEqualTypeOf<
      ["foo", 123, "bar"]
    >();
  });

  test("array index with dot notation before access", () => {
    expectTypeOf(stringToPath("foo.bar[123]")).toEqualTypeOf<
      ["foo", "bar", 123]
    >();
  });

  test("sequential array index accesses", () => {
    expectTypeOf(stringToPath("foo[123][456]")).toEqualTypeOf<
      ["foo", 123, 456]
    >();
  });

  test("complex mix of array index and chained properties", () => {
    expectTypeOf(stringToPath("foo[123].bar.baz[456][789].qux")).toEqualTypeOf<
      ["foo", 123, "bar", "baz", 456, 789, "qux"]
    >();
  });

  test("unquoted object property access", () => {
    expectTypeOf(stringToPath("foo[bar]")).toEqualTypeOf<["foo", "bar"]>();
    expectTypeOf(stringToPath("foo[bar].baz")).toEqualTypeOf<
      ["foo", "bar", "baz"]
    >();
  });

  test("single quoted object property access", () => {
    expectTypeOf(stringToPath("foo['bar']")).toEqualTypeOf<["foo", "bar"]>();
    expectTypeOf(stringToPath("foo['bar'].baz")).toEqualTypeOf<
      ["foo", "bar", "baz"]
    >();
  });

  test("double quoted object property access", () => {
    expectTypeOf(stringToPath('foo["bar"]')).toEqualTypeOf<["foo", "bar"]>();
    expectTypeOf(stringToPath('foo["bar"].baz')).toEqualTypeOf<
      ["foo", "bar", "baz"]
    >();
  });

  test("recursive chained properties", () => {
    expectTypeOf(stringToPath("foo[bar.baz]")).toEqualTypeOf<
      ["foo", "bar", "baz"]
    >();
  });

  test("2d array access", () => {
    expectTypeOf(stringToPath("123[456]")).toEqualTypeOf<[123, 456]>();
  });

  test("square bracket for a number", () => {
    expectTypeOf(stringToPath("[123]")).toEqualTypeOf<[123]>();
  });

  test("properties with numbers", () => {
    expectTypeOf(stringToPath("foo[abc123]")).toEqualTypeOf<
      ["foo", "abc123"]
    >();
    expectTypeOf(stringToPath("foo[123abc]")).toEqualTypeOf<
      ["foo", "123abc"]
    >();
  });
});

describe("quoted properties edge-cases", () => {
  test("hyphens", () => {
    expectTypeOf(stringToPath("foo['bar-baz']")).toEqualTypeOf<
      ["foo", "bar-baz"]
    >();
  });

  test("underscores", () => {
    expectTypeOf(stringToPath("foo['bar_baz']")).toEqualTypeOf<
      ["foo", "bar_baz"]
    >();
  });

  test("spaces", () => {
    expectTypeOf(stringToPath("foo['bar baz']")).toEqualTypeOf<
      ["foo", "bar baz"]
    >();
  });

  test("dots", () => {
    expectTypeOf(stringToPath("foo['bar.baz']")).toEqualTypeOf<
      ["foo", "bar.baz"]
    >();
  });

  test("square brackets", () => {
    expectTypeOf(stringToPath("foo['bar[baz]']")).toEqualTypeOf<
      ["foo", "bar[baz]"]
    >();
  });

  test("numbers", () => {
    expectTypeOf(stringToPath("foo['123']")).toEqualTypeOf<["foo", "123"]>();
  });
});

describe("empty segments edge-cases", () => {
  test("empty quoted access", () => {
    expectTypeOf(stringToPath("foo[''].bar")).toEqualTypeOf<
      ["foo", "", "bar"]
    >();
  });
});

describe("known limitations", () => {
  test("nested object access", () => {
    expectTypeOf(stringToPath("foo[bar[baz]]")).toEqualTypeOf<
      // @ts-expect-error [ts2344] -- This is TypeScript! we can't count parentheses (can we? would it be crazy complex?)
      ["foo", "bar", "baz"]
    >();
  });

  test("two sequential dots", () => {
    // @ts-expect-error [ts2344] -- Is this even valuable to support?! What does an empty property even mean, can an object have an empty property?! If users need this kind of access they can use the quoted access syntax which does work (e.g., `foo[''].bar`).
    expectTypeOf(stringToPath("foo..bar")).toEqualTypeOf<["foo", "", "bar"]>();
  });

  test("empty unquoted access", () => {
    // @ts-expect-error [ts2344] -- Is this even valuable to support?! What does an empty property even mean, can an object have an empty property?! If users need this kind of access they can use the quoted access syntax which does work (e.g., `foo[''].bar`).
    expectTypeOf(stringToPath("foo[].bar")).toEqualTypeOf<["foo", "", "bar"]>();
  });

  test("using slash as an escape character", () => {
    expectTypeOf(stringToPath(String.raw`a['b\'c']`)).toEqualTypeOf<
      // @ts-expect-error [ts2344] -- This is TypeScript! we are not going to build a whole text parser!
      ["a", "b'c"]
    >();

    expectTypeOf(stringToPath(String.raw`a["b\\"c"]`)).toEqualTypeOf<
      // @ts-expect-error [ts2344] -- This is TypeScript! we are not going to build a whole text parser!
      ["a", 'b"c']
    >();

    expectTypeOf(stringToPath(String.raw`a['b\\c']`)).toEqualTypeOf<
      // @ts-expect-error [ts2344] -- This is TypeScript! we are not going to build a whole text parser!
      // eslint-disable-next-line unicorn/prefer-string-raw
      ["a", "b\\c"]
    >();
  });

  test("whitespace handling", () => {
    // @ts-expect-error [ts2344] -- This is TypeScript! we are not going to build a whole text parser!
    expectTypeOf(stringToPath("foo[ 'bar' ]")).toEqualTypeOf<["foo", "bar"]>();
    // @ts-expect-error [ts2344] -- This is TypeScript! we are not going to build a whole text parser!
    expectTypeOf(stringToPath("foo[' bar']")).toEqualTypeOf<["foo", "bar"]>();
    // @ts-expect-error [ts2344] -- This is TypeScript! we are not going to build a whole text parser!
    expectTypeOf(stringToPath("foo['bar ']")).toEqualTypeOf<["foo", "bar"]>();
    // @ts-expect-error [ts2344] -- This is TypeScript! we are not going to build a whole text parser!
    expectTypeOf(stringToPath("foo[' bar ']")).toEqualTypeOf<["foo", "bar"]>();
    // @ts-expect-error [ts2344] -- This is TypeScript! we are not going to build a whole text parser!
    expectTypeOf(stringToPath("foo[ bar]")).toEqualTypeOf<["foo", "bar"]>();
    // @ts-expect-error [ts2344] -- This is TypeScript! we are not going to build a whole text parser!
    expectTypeOf(stringToPath("foo[bar ]")).toEqualTypeOf<["foo", "bar"]>();
    // @ts-expect-error [ts2344] -- This is TypeScript! we are not going to build a whole text parser!
    expectTypeOf(stringToPath("foo[ bar ]")).toEqualTypeOf<["foo", "bar"]>();
    // @ts-expect-error [ts2344] -- This is TypeScript! we are not going to build a whole text parser!
    expectTypeOf(stringToPath("foo[ 123 ]")).toEqualTypeOf<["foo", 123]>();
    // @ts-expect-error [ts2344] -- This is TypeScript! we are not going to build a whole text parser!
    expectTypeOf(stringToPath("foo. bar")).toEqualTypeOf<["foo", "bar"]>();
    // @ts-expect-error [ts2344] -- This is TypeScript! we are not going to build a whole text parser!
    expectTypeOf(stringToPath("foo .bar")).toEqualTypeOf<["foo", "bar"]>();
    // @ts-expect-error [ts2344] -- This is TypeScript! we are not going to build a whole text parser!
    expectTypeOf(stringToPath(" foo")).toEqualTypeOf<["foo"]>();
    // @ts-expect-error [ts2344] -- This is TypeScript! we are not going to build a whole text parser!
    expectTypeOf(stringToPath("foo ")).toEqualTypeOf<["foo"]>();
    // @ts-expect-error [ts2344] -- This is TypeScript! we are not going to build a whole text parser!
    expectTypeOf(stringToPath(" foo ")).toEqualTypeOf<["foo"]>();
  });
});
