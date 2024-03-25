import { constant } from "./constant";
import { mapKeys } from "./mapKeys";
import { pipe } from "./pipe";

describe("runtime", () => {
  test("dataFirst", () => {
    expect(
      mapKeys({ a: 1, b: 2 }, (key, value) => `${key}${value}`),
    ).toStrictEqual({ a1: 1, b2: 2 });
  });

  test("dataLast", () => {
    expect(
      pipe(
        { a: 1, b: 2 },
        mapKeys((key, value) => `${key}${value}`),
      ),
    ).toStrictEqual({ a1: 1, b2: 2 });
  });

  test("symbols are filtered out", () => {
    expect(mapKeys({ [Symbol("mySymbol")]: 1 }, constant(3))).toStrictEqual({});
  });

  test("symbols are not passed to the mapper", () => {
    const mock = vi.fn();
    const data = { [Symbol("mySymbol")]: 1, a: "hello" };
    mapKeys(data, mock);
    expect(mock).toBeCalledTimes(1);
    expect(mock).toBeCalledWith("a", "hello", data);
  });

  test("symbols returned from the mapper are not ignored", () => {
    const mySymbol = Symbol("mySymbol");
    expect(mapKeys({ a: 1 }, constant(mySymbol))).toStrictEqual({
      [mySymbol]: 1,
    });
  });
});

describe("typing", () => {
  test("symbols are not passed to the mapper", () => {
    mapKeys({ [Symbol("mySymbol")]: 1, b: "hellO", c: true }, (key, value) => {
      expectTypeOf(key).toEqualTypeOf<"b" | "c">();
      expectTypeOf(value).toEqualTypeOf<boolean | string>();
      return 3;
    });
  });

  test("symbols can be used as the return value", () => {
    const mySymbol = Symbol("mySymbol");
    const result = mapKeys({ a: 1 }, constant(mySymbol));
    expectTypeOf(result).toEqualTypeOf<
      Partial<Record<typeof mySymbol, number>>
    >();
  });
});
