import { constant } from "./constant";
import { omitBy } from "./omitBy";
import { pipe } from "./pipe";

describe("runtime", () => {
  test("dataFirst", () => {
    expect(
      omitBy({ a: 1, b: 2, A: 3, B: 4 }, (_, key) => key.toUpperCase() === key),
    ).toStrictEqual({ a: 1, b: 2 });
  });

  test("dataLast", () => {
    expect(
      pipe(
        { a: 1, b: 2, A: 3, B: 4 },
        omitBy((_, key) => key.toUpperCase() === key),
      ),
    ).toStrictEqual({ a: 1, b: 2 });
  });

  test("symbols are passed through", () => {
    const mySymbol = Symbol("mySymbol");
    expect(omitBy({ [mySymbol]: 1 }, constant(true))).toStrictEqual({
      [mySymbol]: 1,
    });
  });

  test("symbols are not passed to the predicate", () => {
    const mock = vi.fn();
    const data = { [Symbol("mySymbol")]: 1, a: "hello" };
    omitBy(data, mock);
    expect(mock).toBeCalledTimes(1);
    expect(mock).toBeCalledWith("hello", "a", data);
  });
});

describe("typing", () => {
  describe("data first", () => {
    test("it should omit props", () => {
      const result = omitBy(
        { a: 1, b: 2, A: 3, B: 4 },
        (_, key) => key.toUpperCase() === key,
      );
      expectTypeOf(result).toEqualTypeOf<
        Record<"A" | "a" | "B" | "b", number>
      >();
    });

    test("allow partial type", () => {
      const result = omitBy(
        {} as Partial<{ a: string; b: number }>,
        (_, key) => key === "a",
      );
      expectTypeOf(result).toEqualTypeOf<Partial<{ a: string; b: number }>>();
    });
  });

  describe("data last", () => {
    test("it should omit props", () => {
      const result = pipe(
        { a: 1, b: 2, A: 3, B: 4 },
        omitBy((_, key) => key.toUpperCase() === key),
      );
      expectTypeOf(result).toEqualTypeOf<
        Record<"A" | "a" | "B" | "b", number>
      >();
    });

    test("allow partial type", () => {
      const result = pipe(
        {} as Partial<{ a: string; b: number }>,
        omitBy((_, key) => key.toUpperCase() === key),
      );
      expectTypeOf(result).toEqualTypeOf<Partial<{ a: string; b: number }>>();
    });
  });

  test("symbols are passed through", () => {
    const mySymbol = Symbol("mySymbol");
    const result = omitBy({ [mySymbol]: 1 }, constant(true));
    expectTypeOf(result).toEqualTypeOf<{ [mySymbol]: number }>();
  });

  test("symbols are not passed to the predicate", () => {
    omitBy({ [Symbol("mySymbol")]: 1, b: "hello", c: true }, (value, key) => {
      expectTypeOf(value).toEqualTypeOf<boolean | string>();
      expectTypeOf(key).toEqualTypeOf<"b" | "c">();
      return true;
    });
  });
});
