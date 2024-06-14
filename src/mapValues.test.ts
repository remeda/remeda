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

  test("symbols are filtered out", () => {
    expect(
      mapValues({ [Symbol("mySymbol")]: 1 }, constant("hello")),
    ).toStrictEqual({});
  });

  test("symbols are not passed to the mapper", () => {
    mapValues({ [Symbol("mySymbol")]: 1, a: "hello" }, (value, key) => {
      expect(value).toBe("hello");
      expect(key).toBe("a");
      return "world";
    });
  });

  test("number keys are converted to string in the mapper", () => {
    mapValues({ 123: 456 }, (value, key) => {
      expect(value).toBe(456);
      expect(key).toBe("123");
      return "world";
    });
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

  describe("branded types", () => {
    test("should infer types correctly in the mapper", () => {
      type Branded<K, T> = K & { _type: T };
      type UserID = Branded<string, "UserId">;

      const userValues: Record<UserID, number> = {
        ["U1" as UserID]: 1,
        ["U2" as UserID]: 2,
      };

      mapValues(userValues, (value, key) => {
        expectTypeOf(value).toEqualTypeOf<number>();
        // TODO: If possible, use `toEqualTypeOf`
        expectTypeOf(key).toMatchTypeOf<`${UserID}`>();
      });
    });
  });

  test("symbols are filtered out", () => {
    const mySymbol = Symbol("mySymbol");
    const result = mapValues({ [mySymbol]: 1, a: "hello" }, constant(true));
    expectTypeOf(result).toEqualTypeOf<{ a: boolean }>();
  });

  test("symbols are ignored by the mapper", () => {
    mapValues({ [Symbol("a")]: "hello", b: 1, c: true }, (value, key) => {
      expectTypeOf(value).toEqualTypeOf<boolean | number>();
      expectTypeOf(key).toEqualTypeOf<"b" | "c">();
    });
  });

  test("objects with just symbol keys are still well defined", () => {
    const result = mapValues({ [Symbol("a")]: 1 }, constant(true));
    // eslint-disable-next-line @typescript-eslint/ban-types
    expectTypeOf(result).toEqualTypeOf<{}>();
  });

  test("number keys are converted to string in the mapper", () => {
    mapValues({ 123: 456 }, (value, key) => {
      expectTypeOf(value).toEqualTypeOf<number>();
      expectTypeOf(key).toEqualTypeOf<"123">();
      return "world";
    });
  });

  test("maintains partiality", () => {
    const result = mapValues(
      {} as { a?: number; b?: string; c: number; d: string },
      constant(true),
    );
    expectTypeOf(result).toEqualTypeOf<{
      a?: boolean;
      b?: boolean;
      c: boolean;
      d: boolean;
    }>();
  });

  test("unions of records", () => {
    const data = {} as Record<number, unknown> | Record<string, unknown>;

    const dataFirst = mapValues(data, constant("hello" as string));
    expectTypeOf(dataFirst).toEqualTypeOf<
      Record<`${number}`, string> | Record<string, string>
    >();

    const dataLast = pipe(data, mapValues(constant("hello" as string)));
    expectTypeOf(dataLast).toEqualTypeOf<
      Record<`${number}`, string> | Record<string, string>
    >();
  });
});
