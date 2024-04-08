import { omit } from "./omit";
import { pipe } from "./pipe";

describe("runtime", () => {
  test("dataFirst", () => {
    const result = omit({ a: 1, b: 2, c: 3, d: 4 }, ["a", "d"] as const);
    expect(result).toEqual({ b: 2, c: 3 });
  });

  test("single removed prop works", () => {
    const obj: { a: number } = { a: 1 };
    const result = omit(obj, ["a"]);
    expect(result).toEqual({});
  });

  test("dataLast", () => {
    const result = pipe({ a: 1, b: 2, c: 3, d: 4 }, omit(["a", "d"] as const));
    expect(result).toEqual({ b: 2, c: 3 });
  });

  test("can omit symbol keys", () => {
    const mySymbol = Symbol("mySymbol");
    expect(omit({ [mySymbol]: 3 }, [mySymbol])).toStrictEqual({});
  });

  test("shallow clone the array when there's nothing to omit", () => {
    const obj = { a: 1, b: 2, c: 3, d: 4 };
    const result = omit(obj, []);
    expect(result).toStrictEqual(obj);
    expect(result).not.toBe(obj);
  });
});

describe("typing", () => {
  describe("data first", () => {
    test("non existing prop", () => {
      // @ts-expect-error [ts2322] -- should not allow non existing props
      omit({ a: 1, b: 2, c: 3, d: 4 }, ["not", "in"] as const);
    });

    test("complex type", () => {
      const obj = { a: 1 } as { a: number } | { a?: number; b: string };
      const result = omit(obj, ["a"]);
      expectTypeOf(result).toEqualTypeOf<
        Omit<{ a: number } | { a?: number; b: string }, "a">
      >();
    });
  });

  describe("data last", () => {
    test("non existing prop", () => {
      pipe(
        { a: 1, b: 2, c: 3, d: 4 },
        // @ts-expect-error [ts2345] -- should not allow non existing props
        omit(["not", "in"] as const),
      );
    });

    test("complex type", () => {
      const obj = { a: 1 } as { a: number } | { a?: number; b: string };
      const result = pipe(obj, omit(["a"]));
      expectTypeOf(result).toEqualTypeOf<
        Omit<{ a: number } | { a?: number; b: string }, "a">
      >();
    });
  });

  test("multiple keys", () => {
    type Data = { aProp: string; bProp: string };

    const obj: Data = {
      aProp: "p1",

      bProp: "p2",
    };

    const result = pipe(obj, omit(["aProp", "bProp"]));

    expectTypeOf(result).toEqualTypeOf<Omit<Data, "aProp" | "bProp">>();
  });
});
