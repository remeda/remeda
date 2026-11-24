import { describe, expectTypeOf, test } from "vitest";
import { $typed } from "../test/$typed";
import { map } from "./map";
import { pipe } from "./pipe";
import { prop } from "./prop";
import { sortBy } from "./sortBy";
import { stringToPath } from "./stringToPath";

declare const SYMBOL: unique symbol;
declare const NESTED: { a: { b: { c: { d: number } }[] } };

interface InterfaceWithIndexSignature {
  [key: string]: number;
  a: 1;
}

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
    expectTypeOf(prop([] as "cat"[], 3)).toEqualTypeOf<"cat" | undefined>();
  });

  test("prefix array", () => {
    expectTypeOf(prop([1] as [number, ...string[]], 10)).toEqualTypeOf<
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
    expectTypeOf(prop([] as string[] | number[], 10)).toEqualTypeOf<
      string | number | undefined
    >();
  });

  test("arrays of unions", () => {
    expectTypeOf(prop([] as ("cat" | "dog")[], 100)).toEqualTypeOf<
      "cat" | "dog" | undefined
    >();
  });

  test("union of tuples", () => {
    expectTypeOf(
      prop([1, "foo"] as [number, string] | [string, boolean], 1),
    ).toEqualTypeOf<string | boolean>();
  });

  test("union of array and object", () => {
    const data = { a: 1 } as readonly "cat"[] | { a: 1 };

    expectTypeOf(prop(data, "a")).toEqualTypeOf<1 | undefined>();
    expectTypeOf(prop(data, 100)).toEqualTypeOf<"cat" | undefined>();
    expectTypeOf(prop(data, "a" as "a" | number)).toEqualTypeOf<
      1 | "cat" | undefined
    >();
  });
});

describe("stored partial application", () => {
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
    const data = [[[[]]]] as "cat"[][][][];

    expectTypeOf(prop(data, 10)).toExtend<"cat"[][][] | undefined>();
    expectTypeOf(prop(data, 10, 20)).toExtend<"cat"[][] | undefined>();
    expectTypeOf(prop(data, 10, 20, 30)).toExtend<"cat"[] | undefined>();
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

// @see https://github.com/remeda/remeda/issues/1274
describe("unbounded records (issue #1274)", () => {
  test("unbounded string record", () => {
    expectTypeOf(prop({} as Record<string, number>, "x")).toEqualTypeOf<
      number | undefined
    >();
  });

  test("unbounded number record", () => {
    expectTypeOf(prop({} as Record<number, boolean>, 123)).toEqualTypeOf<
      boolean | undefined
    >();
  });

  test("unbounded symbol record", () => {
    const result = prop({} as Record<symbol, Date>, SYMBOL);

    expectTypeOf(result).toEqualTypeOf<Date | undefined>();
  });

  test("template-literal record", () => {
    expectTypeOf(
      prop({} as Record<`data-${string}`, number>, "data-foo"),
    ).toEqualTypeOf<number | undefined>();
  });

  test("bounded record", () => {
    expectTypeOf(
      prop({} as Record<"a" | "b", number>, "a"),
    ).toEqualTypeOf<number>();
  });

  test("partial bounded record", () => {
    expectTypeOf(
      prop({} as Partial<Record<"a" | "b", number>>, "a"),
    ).toEqualTypeOf<number | undefined>();
  });

  test("declared props alongside an index signature", () => {
    const data = {} as { [key: string]: number; a: 1 };

    expectTypeOf(prop(data, "a")).toEqualTypeOf<1>();
    expectTypeOf(prop(data, "b")).toEqualTypeOf<number | undefined>();
  });

  test("declared props alongside a template-literal index signature", () => {
    const data = {} as { [key: `data-${string}`]: number; a: 1 };

    expectTypeOf(prop(data, "a")).toEqualTypeOf<1>();
    expectTypeOf(prop(data, "data-foo")).toEqualTypeOf<number | undefined>();
  });

  test("record intersected with declared props", () => {
    const data = {} as Record<string, number> & { a: boolean };

    expectTypeOf(prop(data, "a")).toEqualTypeOf<boolean>();
    expectTypeOf(prop(data, "b")).toEqualTypeOf<number | undefined>();
  });

  test("interface with an index signature", () => {
    const data = {} as InterfaceWithIndexSignature;

    expectTypeOf(prop(data, "a")).toEqualTypeOf<1>();
    expectTypeOf(prop(data, "b")).toEqualTypeOf<number | undefined>();
  });

  test("union of records", () => {
    expectTypeOf(
      prop({} as Record<string, number> | Record<string, boolean>, "x"),
    ).toEqualTypeOf<number | boolean | undefined>();
  });

  test("record in a deep path", () => {
    const data = {} as {
      a: Record<string, { b: { c: "hello"; d: boolean; e: string } }>;
    };
    const recordEntry = prop(data, "a", "x");
    const insideRecordEntry = prop(data, "a", "x", "b");

    expectTypeOf(prop(data, "a")).toEqualTypeOf<
      Record<string, { b: { c: "hello"; d: boolean; e: string } }>
    >();
    expectTypeOf(recordEntry).toEqualTypeOf<
      { b: { c: "hello"; d: boolean; e: string } } | undefined
    >();
    expectTypeOf(insideRecordEntry).toEqualTypeOf<
      { c: "hello"; d: boolean; e: string } | undefined
    >();
    expectTypeOf(prop(data, "a", "x", "b", "c")).toEqualTypeOf<
      "hello" | undefined
    >();
    expectTypeOf(prop(data, "a", "x", "b", "d")).toEqualTypeOf<
      boolean | undefined
    >();
  });

  test("data-last", () => {
    expectTypeOf(pipe({} as Record<string, number>, prop("x"))).toEqualTypeOf<
      number | undefined
    >();
    expectTypeOf(
      pipe({} as { a: Record<string, number> }, prop("a", "x")),
    ).toEqualTypeOf<number | undefined>();
  });
});

test("wide key without an index signature", () => {
  // @ts-expect-error [ts2769] -- without a spread every key is validated, and `string` isn't a key of the data
  prop({} as { a: number }, $typed<string>());
});

describe("with stringToPath", () => {
  test("with valid paths", () => {
    expectTypeOf(prop(NESTED, ...stringToPath("a"))).toEqualTypeOf<{
      b: { c: { d: number } }[];
    }>();
    expectTypeOf(prop(NESTED, ...stringToPath("a.b"))).toEqualTypeOf<
      { c: { d: number } }[]
    >();
    expectTypeOf(prop(NESTED, ...stringToPath("a.b[0]"))).toExtend<
      { c: { d: number } } | undefined
    >();
    expectTypeOf(prop(NESTED, ...stringToPath("a.b[0].c"))).toExtend<
      { d: number } | undefined
    >();
    expectTypeOf(prop(NESTED, ...stringToPath("a.b[0].c.d"))).toEqualTypeOf<
      number | undefined
    >();
  });

  test("with invalid paths", () => {
    // @ts-expect-error [ts2769] -- 'x' is not a key of NESTED
    prop(NESTED, ...stringToPath("x.y"));
    // @ts-expect-error [ts2769] -- 'e' is not a key of NESTED.a.b[0].c.d
    prop(NESTED, ...stringToPath("a.b[0].c.d.e"));
    // @ts-expect-error [ts2769] -- 1 is not a key of NESTED.a.b[0].c.d
    prop(NESTED, ...stringToPath("a.b[0].c.d[1]"));
  });
});

describe("path of unknown length", () => {
  test("non-empty array", () => {
    expectTypeOf(
      prop(NESTED, ...$typed<[string, ...string[]]>()),
    ).toBeUnknown();
  });

  test("stringToPath on a non-literal string", () => {
    expectTypeOf(prop(NESTED, ...stringToPath($typed<string>()))).toBeUnknown();
  });

  test("generic data", () => {
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/no-unnecessary-type-parameters, unicorn/consistent-function-scoping -- only how `Data` reaches `prop` matters here, not how the wrapper is written.
    const propAt = <Data extends { a: unknown }>(data: Data) =>
      prop(data, ...$typed<string[]>());

    expectTypeOf(propAt({ a: 1 })).toBeUnknown();
  });

  describe("keys before the spread", () => {
    test("valid literal keys", () => {
      expectTypeOf(
        prop(NESTED, "a", "b", 0, ...$typed<string[]>()),
      ).toBeUnknown();
    });

    test("invalid first key", () => {
      prop(
        NESTED,
        // @ts-expect-error [ts2345] -- 'x' is not a key of NESTED
        "x",
        ...$typed<string[]>(),
      );
    });

    test("invalid deep key", () => {
      prop(
        NESTED,
        // @ts-expect-error [ts2345] -- 'x' is not a key of NESTED.a.b[0]; TypeScript reports it on the first key of the path
        "a",
        "b",
        0,
        "x",
        ...$typed<string[]>(),
      );
    });

    test("invalid key after a wide key", () => {
      prop(
        $typed<Record<string, { a: number }>>(),
        // @ts-expect-error [ts2345] -- 'x' is not a key of the record's values; TypeScript reports it on the first key of the path
        $typed<string>(),
        "x",
        ...$typed<string[]>(),
      );
    });

    test("key of one member after a union key", () => {
      expectTypeOf(
        prop(
          $typed<{ a: { b: number }; c: { d: number } }>(),
          $typed<"a" | "c">(),
          "b",
          ...$typed<string[]>(),
        ),
      ).toBeUnknown();
    });

    test("template-literal key", () => {
      prop(
        $typed<{ a: number }>(),
        // @ts-expect-error [ts2345] -- `a${string}` is checked like a literal key, and it isn't a key of the data
        $typed<`a${string}`>(),
        ...$typed<string[]>(),
      );
    });

    test("ten literal keys", () => {
      expectTypeOf(
        prop(
          $typed<{
            a: {
              b: {
                c: { d: { e: { f: { g: { h: { i: { j: { k: 11 } } } } } } } };
              };
            };
          }>(),
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
          ...$typed<string[]>(),
        ),
      ).toBeUnknown();
    });
  });

  describe("data-last", () => {
    test("possibly empty path", () => {
      pipe(
        NESTED,
        prop(
          // @ts-expect-error [ts2556] -- no data-last overload takes a spread that might be empty
          ...$typed<string[]>(),
        ),
      );
    });

    test("non-empty path", () => {
      pipe(
        NESTED,
        prop(
          // @ts-expect-error [ts2345] -- the call resolves against the data-first overload, which reads the first key as the data
          ...$typed<[string, ...string[]]>(),
        ),
      );
    });
  });

  test("string data", () => {
    prop(
      // @ts-expect-error [ts2345] -- strings can't be used as data: a string first argument dispatches to data-last at runtime
      "hello",
      ...$typed<string[]>(),
    );
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
    prop(SYMBOL, "description");
  });
});

describe("known issues!", () => {
  test("data typed `{}`", () => {
    // Data typed `{}` (e.g., `unknown` without `null` and `undefined`) is
    // accepted with a path of unknown length, but when it's a string or a
    // number at runtime the call returns a function instead of the property.
    // Narrowing with `typeof data === "object"` avoids it.
    expectTypeOf(
      // eslint-disable-next-line @typescript-eslint/no-empty-object-type -- `{}` is what `unknown` narrows to without `null` and `undefined`, the type this pins.
      prop($typed<{}>(), ...$typed<string[]>()),
    ).toBeUnknown();
  });

  test("generic data with literal keys before the spread", () => {
    // Inside a generic function, a literal key before a spread is rejected even
    // when the data's constraint has it. Casting the data to its constraint
    // (e.g., `data as { a: unknown }`) works.
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type, unicorn/consistent-function-scoping -- the issue only shows up inside a generic function wrapper; only how `Data` reaches `prop` matters here, not how the wrapper is written.
    const propA = <Data extends { a: unknown }>(data: Data) =>
      prop(
        data,
        // @ts-expect-error [ts2345] -- every `Data` has `a`, but the key is rejected
        "a",
        ...$typed<string[]>(),
      );

    propA({ a: 1 });
  });

  test("union of literal paths", () => {
    // A union of paths is rejected even when each of them is a valid path.
    // Calling `prop` once per path works.
    prop(
      $typed<{ a: { b: number } }>(),
      // @ts-expect-error [ts2345] -- both paths are valid, but the union is rejected
      ...$typed<["a"] | ["a", "b"]>(),
    );
  });

  test("generic path of unknown length", () => {
    // Inside a generic function, a path typed by a type parameter is rejected
    // even when its constraint is a plain array. Casting the path to its
    // constraint (e.g., `path as readonly string[]`) works.
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/no-unnecessary-type-parameters, unicorn/consistent-function-scoping -- the issue only shows up inside a generic function wrapper; only how `Path` reaches `prop` matters here, not how the wrapper is written.
    const propAt = <Path extends readonly string[]>(path: Path) =>
      prop(
        { a: 1 },
        // @ts-expect-error [ts2345] -- `prop` accepts `Path`'s constraint, `readonly string[]`, but not `Path` itself
        ...path,
      );

    propAt(["a"]);
  });

  test("stringToPath on a generic string", () => {
    // Inside a generic function, `stringToPath` on a string typed by a type
    // parameter is rejected even when its constraint is a plain `string`.
    // Casting the string to its constraint (e.g.,
    // `stringToPath(path as string)`) works.
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/no-unnecessary-type-parameters, unicorn/consistent-function-scoping -- the issue only shows up inside a generic function wrapper; only how `Path` reaches `prop` matters here, not how the wrapper is written.
    const propAt = <Path extends string>(path: Path) =>
      prop(
        { a: 1 },
        // @ts-expect-error [ts2345] -- `prop` accepts `stringToPath` on a plain `string`, but not on `Path`
        ...stringToPath(path),
      );

    propAt("a");
  });
});
