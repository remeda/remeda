import { describe, expectTypeOf, test } from "vitest";
import { indexBy } from "./indexBy";
import { map } from "./map";
import { pipe } from "./pipe";
import { prop } from "./prop";
import { sortBy } from "./sortBy";
import { stringToPath } from "./stringToPath";

describe("data-last", () => {
  test("inferred directly", () => {
    expectTypeOf(sortBy([{ a: 1 }] as const, prop("a"))).toEqualTypeOf<
      [{ readonly a: 1 }]
    >();
  });

  test("inferred indirectly", () => {
    expectTypeOf(pipe([{ a: 1 }] as const, sortBy(prop("a")))).toEqualTypeOf<
      [{ readonly a: 1 }]
    >();
  });
});

describe("tuples", () => {
  test("fixed tuple", () => {
    expectTypeOf(prop([1, 2, 3] as const, 0)).toEqualTypeOf<1>();
  });

  test("simple array", () => {
    expectTypeOf(prop([] as Array<"cat">, 3)).toEqualTypeOf<
      "cat" | undefined
    >();
  });

  test("prefix array", () => {
    expectTypeOf(prop([1] as [number, ...Array<string>], 10)).toEqualTypeOf<
      string | undefined
    >();
  });
});

describe("unions", () => {
  test("shared prop name", () => {
    expectTypeOf(prop({} as { a: 1 } | { a: 2 }, "a")).toEqualTypeOf<1 | 2>();
  });

  test("disjoint prop name", () => {
    expectTypeOf(prop({} as { a: 1 } | { b: 2 }, "a")).toEqualTypeOf<
      1 | undefined
    >();
  });

  test("union of keys", () => {
    expectTypeOf(
      prop({ a: "hello", b: "world" } as const, "a" as "a" | "b"),
    ).toEqualTypeOf<"hello" | "world">();
  });

  test("union with shared and disjoin keys", () => {
    expectTypeOf(
      prop(
        {} as { a: "hello"; b: "world" } | { a: "hello"; c: "foo" },
        "a" as "a" | "b",
      ),
    ).toEqualTypeOf<"hello" | "world" | undefined>();
  });

  test("detects typos in union of objects", () => {
    // @ts-expect-error [ts2345] -- 'c' is not a key of the union type
    prop({} as { a: 1 } | { b: 2 }, "c");
  });

  test("detects typos in unions of keys", () => {
    // @ts-expect-error [ts2345] -- 'c' is not a key of the union type
    prop({ a: "hello", b: "world" } as const, "a" as "a" | "c");
  });

  test("union of arrays", () => {
    expectTypeOf(prop([] as Array<string> | Array<number>, 10)).toEqualTypeOf<
      string | number | undefined
    >();
  });

  test("arrays of unions", () => {
    expectTypeOf(prop([] as Array<"cat" | "dog">, 100)).toEqualTypeOf<
      "cat" | "dog" | undefined
    >();
  });

  test("union of tuples", () => {
    expectTypeOf(
      prop([1, "foo"] as [number, string] | [string, boolean], 1),
    ).toEqualTypeOf<string | boolean>();
  });

  test("union of array and object", () => {
    const data = { a: 1 } as { a: 1 } | ReadonlyArray<"cat">;

    expectTypeOf(prop(data, "a")).toEqualTypeOf<1 | undefined>();
    expectTypeOf(prop(data, 100)).toEqualTypeOf<"cat" | undefined>();
    expectTypeOf(prop(data, "a" as "a" | number)).toEqualTypeOf<
      1 | "cat" | undefined
    >();
  });
});

describe("as a factory function", () => {
  test("direct usage", () => {
    const propA = prop("a");

    expectTypeOf(propA({ a: 1 } as const)).toEqualTypeOf<1>();
  });

  test("indirect usage as a callback", () => {
    const propA = prop("a");

    expectTypeOf(map([{ a: 1 }, { a: 2 }] as const, propA)).toEqualTypeOf<
      [1 | 2, 1 | 2]
    >();
  });

  test("detects typos", () => {
    const propB = prop("b");

    // @ts-expect-error [ts2353] -- b is not a key of typeof item
    propB({ a: 1 });
  });
});

describe("deep prop", () => {
  const DATA = {} as {
    a: { b: { c: { d: { e: { f: { g: { h: { i: { j: 10 } } } } } } } } };
  };

  test("data-first", () => {
    expectTypeOf(prop(DATA, "a")).toEqualTypeOf<{
      b: { c: { d: { e: { f: { g: { h: { i: { j: 10 } } } } } } } };
    }>();
    expectTypeOf(prop(DATA, "a", "b")).toEqualTypeOf<{
      c: { d: { e: { f: { g: { h: { i: { j: 10 } } } } } } };
    }>();
    expectTypeOf(prop(DATA, "a", "b", "c")).toEqualTypeOf<{
      d: { e: { f: { g: { h: { i: { j: 10 } } } } } };
    }>();
    expectTypeOf(prop(DATA, "a", "b", "c", "d")).toEqualTypeOf<{
      e: { f: { g: { h: { i: { j: 10 } } } } };
    }>();
    expectTypeOf(prop(DATA, "a", "b", "c", "d", "e")).toEqualTypeOf<{
      f: { g: { h: { i: { j: 10 } } } };
    }>();
    expectTypeOf(prop(DATA, "a", "b", "c", "d", "e", "f")).toEqualTypeOf<{
      g: { h: { i: { j: 10 } } };
    }>();
    expectTypeOf(prop(DATA, "a", "b", "c", "d", "e", "f", "g")).toEqualTypeOf<{
      h: { i: { j: 10 } };
    }>();
    expectTypeOf(
      prop(DATA, "a", "b", "c", "d", "e", "f", "g", "h"),
    ).toEqualTypeOf<{
      i: { j: 10 };
    }>();
    expectTypeOf(
      prop(DATA, "a", "b", "c", "d", "e", "f", "g", "h", "i"),
    ).toEqualTypeOf<{ j: 10 }>();
    expectTypeOf(
      prop(DATA, "a", "b", "c", "d", "e", "f", "g", "h", "i", "j"),
    ).toEqualTypeOf<10>();
  });

  test("data-last", () => {
    expectTypeOf(pipe(DATA, prop("a"))).toEqualTypeOf<{
      b: { c: { d: { e: { f: { g: { h: { i: { j: 10 } } } } } } } };
    }>();
    expectTypeOf(pipe(DATA, prop("a", "b"))).toEqualTypeOf<{
      c: { d: { e: { f: { g: { h: { i: { j: 10 } } } } } } };
    }>();
    expectTypeOf(pipe(DATA, prop("a", "b", "c"))).toEqualTypeOf<{
      d: { e: { f: { g: { h: { i: { j: 10 } } } } } };
    }>();
    expectTypeOf(pipe(DATA, prop("a", "b", "c", "d"))).toEqualTypeOf<{
      e: { f: { g: { h: { i: { j: 10 } } } } };
    }>();
    expectTypeOf(pipe(DATA, prop("a", "b", "c", "d", "e"))).toEqualTypeOf<{
      f: { g: { h: { i: { j: 10 } } } };
    }>();
    expectTypeOf(pipe(DATA, prop("a", "b", "c", "d", "e", "f"))).toEqualTypeOf<{
      g: { h: { i: { j: 10 } } };
    }>();
    expectTypeOf(
      pipe(DATA, prop("a", "b", "c", "d", "e", "f", "g")),
    ).toEqualTypeOf<{
      h: { i: { j: 10 } };
    }>();
    expectTypeOf(
      pipe(DATA, prop("a", "b", "c", "d", "e", "f", "g", "h")),
    ).toEqualTypeOf<{
      i: { j: 10 };
    }>();
    expectTypeOf(
      pipe(DATA, prop("a", "b", "c", "d", "e", "f", "g", "h", "i")),
    ).toEqualTypeOf<{ j: 10 }>();
    expectTypeOf(
      pipe(DATA, prop("a", "b", "c", "d", "e", "f", "g", "h", "i", "j")),
    ).toEqualTypeOf<10>();
  });

  test("detects typos", () => {
    // @ts-expect-error [ts2769] -- "cc" is not a key of DATA.a.b
    prop(DATA, "a", "b", "cc", "d", "e");
  });

  test("multi-dimensional arrays", () => {
    const data = [[[[]]]] as Array<Array<Array<Array<"cat">>>>;

    expectTypeOf(prop(data, 10)).toExtend<
      Array<Array<Array<"cat">>> | undefined
    >();
    expectTypeOf(prop(data, 10, 20)).toExtend<
      Array<Array<"cat">> | undefined
    >();
    expectTypeOf(prop(data, 10, 20, 30)).toExtend<Array<"cat"> | undefined>();
    expectTypeOf(prop(data, 10, 20, 30, 40)).toExtend<"cat" | undefined>();
  });

  test("element aware deep props", () => {
    const data = [{ a: 1 }, { b: 2 }, { c: 3 }] as const;

    expectTypeOf(prop(data, 0)).toEqualTypeOf<{ readonly a: 1 }>();
    expectTypeOf(prop(data, 1)).toEqualTypeOf<{ readonly b: 2 }>();
    expectTypeOf(prop(data, 2)).toEqualTypeOf<{ readonly c: 3 }>();
    expectTypeOf(prop(data, 0, "a")).toEqualTypeOf<1>();
    expectTypeOf(prop(data, 1, "b")).toEqualTypeOf<2>();
    expectTypeOf(prop(data, 2, "c")).toEqualTypeOf<3>();

    // @ts-expect-error [ts2769] -- "b" is not a key of data[0]
    prop(data, 0, "b");
    // @ts-expect-error [ts2769] -- "a" is not a key of data[10]
    prop(data, 10, "a");
  });
});

describe("deeper than 10 levels", () => {
  const data = {} as {
    a: {
      b: {
        c: {
          d: {
            e: {
              f: {
                g: {
                  h: {
                    i: {
                      j: {
                        k: {
                          l: {
                            m: {
                              n: {
                                o: {
                                  p: {
                                    q: {
                                      r: {
                                        s: {
                                          t: {
                                            u: {
                                              v: {
                                                w: {
                                                  x: { y: { z: "yey!" } };
                                                };
                                              };
                                            };
                                          };
                                        };
                                      };
                                    };
                                  };
                                };
                              };
                            };
                          };
                        };
                      };
                    };
                  };
                };
              };
            };
          };
        };
      };
    };
  };

  test("just before the tip", () => {
    expectTypeOf(
      prop(
        data,
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
      ),
    ).toEqualTypeOf<{ z: "yey!" }>();
  });

  test("at the tip", () => {
    expectTypeOf(
      prop(
        data,
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
      ),
    ).toEqualTypeOf<"yey!">();
  });

  test("after the tip", () => {
    expectTypeOf(
      prop(
        data,
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
        // Notice that this also tests that we don't validate that the props are
        // valid after the first 10 levels (otherwise we would need to continue
        // adding more function overloads!) but we still compute the output type
        // correctly.
        "aa",
        "bb",
        "cc",
      ),
    ).toEqualTypeOf<undefined>();
  });
});

describe("optional props", () => {
  test("shallow prop", () => {
    expectTypeOf(prop({} as { a?: 1 }, "a")).toEqualTypeOf<1 | undefined>();
  });

  test("deep prop", () => {
    expectTypeOf(
      prop({} as { a?: { b?: { c?: 1 } } }, "a", "b", "c"),
    ).toEqualTypeOf<1 | undefined>();
  });

  test("discriminated unions (Issue #830)", () => {
    expectTypeOf(
      prop(
        {} as {
          type: "a";
          b:
            | { type: "b"; c: { type: "c"; content: string } | { type: "c2" } }
            | { type: "b2" };
        },
        "b",
        "c",
        "content",
      ),
    ).toEqualTypeOf<string | undefined>();
  });
});

describe("with stringToPath", () => {
  const DATA = {} as { a: { b: Array<{ c: { d: number } }> } };

  test("with valid paths", () => {
    expectTypeOf(prop(DATA, ...stringToPath("a"))).toEqualTypeOf<{
      b: Array<{ c: { d: number } }>;
    }>();
    expectTypeOf(prop(DATA, ...stringToPath("a.b"))).toEqualTypeOf<
      Array<{ c: { d: number } }>
    >();
    expectTypeOf(prop(DATA, ...stringToPath("a.b[0]"))).toExtend<
      { c: { d: number } } | undefined
    >();
    expectTypeOf(prop(DATA, ...stringToPath("a.b[0].c"))).toExtend<
      { d: number } | undefined
    >();
    expectTypeOf(prop(DATA, ...stringToPath("a.b[0].c.d"))).toEqualTypeOf<
      number | undefined
    >();
  });

  test("with invalid paths", () => {
    // @ts-expect-error [ts2769] -- 'x' is not a key of DATA
    prop(DATA, ...stringToPath("x.y"));
    // @ts-expect-error [ts2769] -- 'e' is not a key of DATA.a.b[0].c.d
    prop(DATA, ...stringToPath("a.b[0].c.d.e"));
    // @ts-expect-error [ts2769] -- 1 is not a key of DATA.a.b[0].c.d
    prop(DATA, ...stringToPath("a.b[0].c.d[1]"));
  });
});

describe("prevents unsupported data types", () => {
  test("strings", () => {
    // @ts-expect-error [ts2769] -- strings can't be used as data.
    prop("hello", "length");
  });

  test("number", () => {
    // @ts-expect-error [ts2769] -- numbers can't be used as data.
    prop(123, "doNumbersHaveProps?");
  });

  test("symbol", () => {
    // @ts-expect-error [ts2769] -- symbols can't be used as data.
    prop(Symbol("test"), "description");
  });
});

describe("preserves generic types (Issue #XXX)", () => {
  test("works with indexBy and generic constrained types", () => {
    function testWithProp<T extends { id: string }>(
      data: T[],
      key: T["id"],
    ) {
      return indexBy(data, prop("id"))[key];
    }

    const result = testWithProp([{ id: "a", name: "Alice" }], "a");

    expectTypeOf(result).toEqualTypeOf<
      { id: string; name: string } | undefined
    >();
  });

  test("works with inline destructuring (baseline)", () => {
    function testWithDestructuring<T extends { id: string }>(
      data: T[],
      key: T["id"],
    ) {
      return indexBy(data, ({ id }) => id)[key];
    }

    const result = testWithDestructuring([{ id: "a", name: "Alice" }], "a");

    expectTypeOf(result).toEqualTypeOf<
      { id: string; name: string } | undefined
    >();
  });
});
