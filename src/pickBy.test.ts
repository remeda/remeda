import { constant } from "./constant";
import { pickBy } from "./pickBy";
import { pipe } from "./pipe";

describe("runtime", () => {
  test("dataFirst", () => {
    expect(
      pickBy({ a: 1, b: 2, A: 3, B: 4 }, (_, key) => key.toUpperCase() === key),
    ).toStrictEqual({ A: 3, B: 4 });
  });

  test("dataLast", () => {
    expect(
      pipe(
        { a: 1, b: 2, A: 3, B: 4 },
        pickBy((_, key) => key.toUpperCase() === key),
      ),
    ).toStrictEqual({ A: 3, B: 4 });
  });

  test("symbols are filtered out", () => {
    const mySymbol = Symbol("mySymbol");
    expect(pickBy({ [mySymbol]: 1 }, constant(true))).toStrictEqual({});
  });

  test("symbols are not passed to the predicate", () => {
    const mock = vi.fn();
    const data = { [Symbol("mySymbol")]: 1, a: "hello" };
    pickBy(data, mock);
    expect(mock).toBeCalledTimes(1);
    expect(mock).toBeCalledWith("hello", "a", data);
  });
});

describe("typing", () => {
  describe("data first", () => {
    test("it should pick props", () => {
      const data = { a: 1, b: 2, A: 3, B: 4 };
      const result = pickBy(data, constant(true));
      expectTypeOf(result).toEqualTypeOf<Partial<typeof data>>();
    });

    test("allow partial type", () => {
      const result = pickBy({} as { a?: string; b?: number }, constant(true));
      expectTypeOf(result).toEqualTypeOf<Partial<{ a: string; b: number }>>();
    });
  });

  describe("data last", () => {
    test("it should pick props", () => {
      const data = { a: 1, b: 2, A: 3, B: 4 };
      const result = pipe(data, pickBy(constant(true)));
      expectTypeOf(result).toEqualTypeOf<Partial<typeof data>>();
    });

    test("allow partial type", () => {
      const result = pipe(
        {} as { a?: string; b?: number },
        pickBy(constant(true)),
      );
      expectTypeOf(result).toEqualTypeOf<Partial<{ a: string; b: number }>>();
    });
  });

  test("symbols are filtered out", () => {
    const mySymbol = Symbol("mySymbol");
    const result = pickBy({ [mySymbol]: 1, a: 123 }, constant(true));
    expectTypeOf(result).toEqualTypeOf<{ a?: number }>();
  });

  test("symbols are not passed to the predicate", () => {
    pickBy({ [Symbol("mySymbol")]: 1, b: "hello", c: true }, (value, key) => {
      expectTypeOf(value).toEqualTypeOf<boolean | string>();
      expectTypeOf(key).toEqualTypeOf<"b" | "c">();
      return true;
    });
  });
});
