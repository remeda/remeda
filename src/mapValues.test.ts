import { constant } from "./constant";
import { mapValues } from "./mapValues";
import { pipe } from "./pipe";

describe("runtime", () => {
  test("dataFirst", () => {
    expect(
      mapValues({ a: 1, b: 2 }, (value, key) => `${value}${key}`),
    ).toStrictEqual({ a: "1a", b: "2b" });
  });

  test("dataLast", () => {
    expect(
      pipe(
        { a: 1, b: 2 },
        mapValues((value, key) => `${value}${key}`),
      ),
    ).toStrictEqual({ a: "1a", b: "2b" });
  });

  test("symbols are passed through", () => {
    const mySymbol = Symbol("mySymbol");
    expect({ [mySymbol]: 1 }).toStrictEqual({ [mySymbol]: 1 });
  });

  test("symbols are not passed to the mapper", () => {
    const mock = vi.fn();
    const data = { [Symbol("mySymbol")]: 1, a: "hello" };
    mapValues(data, mock);
    expect(mock).toBeCalledTimes(1);
    expect(mock).toBeCalledWith("hello", "a", data);
  });
});

describe("typing", () => {
  describe("interface", () => {
    test("should set the type of the key to be the union of the keys of the object", () => {
      mapValues({} as { foo: unknown; bar: unknown }, (_, key) =>
        expectTypeOf(key).toEqualTypeOf<"bar" | "foo">(),
      );
    });

    test("should exclude symbols from keys", () => {
      const mySymbol = Symbol("mySymbol");
      mapValues(
        {} as { [mySymbol]: unknown; foo: unknown; bar: unknown },
        (_, key) => expectTypeOf(key).toEqualTypeOf<"bar" | "foo">(),
      );
    });
  });

  describe("mapped type", () => {
    test("should work with string keys", () => {
      mapValues({} as { [K in string]: unknown }, (_, key) => {
        expectTypeOf(key).toEqualTypeOf<string>();
      });
    });
    test("should work with number keys", () => {
      mapValues({} as { [K in number]: unknown }, (_, key) => {
        expectTypeOf(key).toEqualTypeOf<`${number}`>();
      });
    });
    test("should work with template literal string keys", () => {
      mapValues({} as { [K in `prefix${string}`]: unknown }, (_, key) => {
        expectTypeOf(key).toEqualTypeOf<`prefix${string}`>();
      });
    });
    test("should not work with symbol keys", () => {
      mapValues({} as { [K in symbol]: unknown }, (_, key) => {
        expectTypeOf(key).toEqualTypeOf<never>();
      });
    });
  });

  describe("indexed signature", () => {
    test("should work with string keys", () => {
      mapValues({} as Record<string, unknown>, (_, key) => {
        expectTypeOf(key).toEqualTypeOf<string>();
      });
    });
    test("should work with number keys", () => {
      mapValues({} as Record<number, unknown>, (_, key) => {
        expectTypeOf(key).toEqualTypeOf<`${number}`>();
      });
    });
    test("should work with template literal string keys", () => {
      mapValues({} as Record<`prefix${string}`, unknown>, (_, key) => {
        expectTypeOf(key).toEqualTypeOf<`prefix${string}`>();
      });
    });
    test("should not work with symbol keys", () => {
      mapValues({} as Record<symbol, unknown>, (_, key) => {
        expectTypeOf(key).toEqualTypeOf<never>();
      });
    });
  });

  test("symbols are passed through", () => {
    const mySymbol = Symbol("mySymbol");
    const result = mapValues({ [mySymbol]: 1, a: "hello" }, constant(true));
    expectTypeOf(result).toEqualTypeOf<{ [mySymbol]: number; a: boolean }>();
  });

  test("symbols are ignored by the mapper", () => {
    mapValues({ [Symbol("a")]: "hello", b: 1, c: true }, (value, key) => {
      expectTypeOf(value).toEqualTypeOf<boolean | number>();
      expectTypeOf(key).toEqualTypeOf<"b" | "c">();
    });
  });
});
