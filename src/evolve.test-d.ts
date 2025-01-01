import { add } from "./add";
import { evolve } from "./evolve";
import { identity } from "./identity";
import { length } from "./length";
import { map } from "./map";
import { omit } from "./omit";
import { pipe } from "./pipe";
import { reduce } from "./reduce";
import { set } from "./set";

describe("data first", () => {
  it("creates a new object by evolving the `data` according to the `transformation` functions", () => {
    const result = evolve(
      {
        id: 1,
        quartile: [1, 2, 3, 4],
        time: { elapsed: 100, remaining: 1400 },
      },
      {
        id: add(1),
        quartile: sum,
        time: { elapsed: add(1), remaining: add(-1) },
      },
    );

    expectTypeOf(result).toEqualTypeOf<{
      id: number;
      quartile: number;
      time: { elapsed: number; remaining: number };
    }>();
  });

  it("is not destructive and is immutable", () => {
    const result = evolve({ n: 100 }, { n: add(1) });

    expectTypeOf(result).toEqualTypeOf<{ n: number }>();
  });

  it("is recursive", () => {
    const result = evolve(
      { first: 1, nested: { second: 2, third: 3 } },
      { nested: { second: add(-1), third: add(1) } },
    );

    expectTypeOf(result).toEqualTypeOf<{
      first: number;
      nested: { second: number; third: number };
    }>();
  });

  it("can handle data that is complex nested objects", () => {
    const result = evolve(
      {
        array: ["1", "2", "3"],
        nestedObj: { a: { b: "c" } },
        objAry: [
          { a: 0, b: 0 },
          { a: 1, b: 1 },
        ],
      },
      {
        array: length(),
        nestedObj: { a: (x) => set(x, "b", "Set") },
        objAry: (x) => map(x, omit(["b"])),
      },
    );

    expectTypeOf(result).toEqualTypeOf<{
      array: number;
      nestedObj: { a: { b: string } };
      objAry: Array<{ a: number }>;
    }>();
  });

  describe("type reflection", (): void => {
    it("can reflect type of data to function of evolver object", () => {
      const result = evolve(
        {
          id: 1,
          quartile: [1, 2, 3, 4],
          time: { elapsed: 100, remaining: 1400 },
        } as {
          id: number;
          quartile: Array<number>;
          time?: { elapsed: number; remaining?: number };
        },
        {
          // type of parameter is required because `count` property is not
          // defined in data
          count: (x: number) => x,
          quartile: (x) => x,
          time: (x) => x,
        },
      );

      expectTypeOf(result).toEqualTypeOf<{
        id: number;
        quartile: Array<number>;
        time?: { elapsed: number; remaining?: number };
      }>();
    });

    it("can reflect type of data to function of nested evolver object", () => {
      const result = evolve(
        {
          id: 1,
          quartile: [1, 2, 3, 4],
          time: { elapsed: 100, remaining: 1400 },
        } as {
          id: number;
          quartile: Array<number>;
          time?: { elapsed: number; remaining?: number };
        },
        {
          // type of parameter is required because `count` property is not
          // defined in data
          count: (x: number) => x,
          quartile: (x) => x,
          time: { elapsed: (x) => x, remaining: (x) => x },
        },
      );

      expectTypeOf(result).toEqualTypeOf<{
        id: number;
        quartile: Array<number>;
        time?: { elapsed: number; remaining?: number };
      }>();
    });
  });

  it("can detect mismatch of parameters and arguments", () => {
    evolve(
      {
        number: "1",
        array: ["1", "2", "3"],
        nestedObj: { a: { b: "c" } },
        objAry: [
          { a: "0", b: 0 },
          { a: 1, b: 1 },
        ],
      },
      {
        // @ts-expect-error [ts2322] - Type 'string' is not assignable to type 'number'.
        number: add(1),
        // @ts-expect-error [ts2322] - Type 'string' is not assignable to type 'number'.
        array: (array: ReadonlyArray<number>) => array.length,
        // @ts-expect-error [ts2322] - Type 'string' is not assignable to type 'number'.
        nestedObj: { a: set<{ b: number }, "b">("b", 0) },
        // @ts-expect-error [ts2322] - Type 'string' is not assignable to type 'number'.
        objAry: map(omit<{ a: number; b: number }, "b">(["b"])),
      },
    );
  });

  it("does not accept function that require multiple arguments", () => {
    evolve(
      { requiring2Args: 1, requiring3Args: 1 },
      {
        // @ts-expect-error [ts2322] - Target signature provides too few arguments. Expected 2 or more, but got 1.
        requiring2Args: (a: number, b: number) => a + b,
        // @ts-expect-error [ts2322] - Target signature provides too few arguments. Expected 3 or more, but got 1.
        requiring3Args: (a: number, b: number | undefined, c: number) =>
          a + (b ?? 0) + c,
      },
    );
  });

  it("accept function whose second and subsequent arguments are optional", () => {
    const result = evolve(
      { arg2Optional: 1, arg2arg3Optional: 1 },
      {
        arg2Optional: (_: number, arg2?: number) => arg2 === undefined,
        arg2arg3Optional: (_: number, arg2?: number, arg3?: number) =>
          arg2 === undefined && arg3 === undefined,
      },
    );

    expectTypeOf(result).toEqualTypeOf<{
      arg2Optional: boolean;
      arg2arg3Optional: boolean;
    }>();
  });

  it("can not handle function arrays.", () => {
    evolve(
      { quartile: [1, 2] },
      {
        // @ts-expect-error [ts2322] - Type '((value: number) => number)[]' provides no match for the signature '(data: number[]): unknown'.
        quartile: [add(1), add(-1)],
      },
    );
  });

  it("doesn't provide typing for symbol key evolvers", () => {
    const mySymbol = Symbol("a");
    evolve(
      { [mySymbol]: "hello" },
      {
        // @ts-expect-error [ts2418] - mySymbol shouldn't be usable.
        [mySymbol]: identity(),
      },
    );
  });
});

describe("data last", () => {
  it("creates a new object by evolving the `data` according to the `transformation` functions", () => {
    const result = pipe(
      {
        id: 1,
        quartile: [1, 2, 3, 4],
        time: { elapsed: 100, remaining: 1400 },
      },
      evolve({
        id: add(1),
        quartile: sum,
        time: { elapsed: add(1), remaining: add(-1) },
      }),
    );

    expectTypeOf(result).toEqualTypeOf<{
      id: number;
      quartile: number;
      time: { elapsed: number; remaining: number };
    }>();
  });

  it("is not destructive and is immutable", () => {
    const result = pipe({ n: 100 }, evolve({ n: add(1) }));

    expectTypeOf(result).toEqualTypeOf<{ n: number }>();
  });

  it("is recursive", () => {
    const result = pipe(
      { first: 1, nested: { second: 2, third: 3 } },
      evolve({ nested: { second: add(-1), third: add(1) } }),
    );

    expectTypeOf(result).toEqualTypeOf<{
      first: number;
      nested: { second: number; third: number };
    }>();
  });

  it("ignores undefined transformations", () => {
    const result = pipe({ n: 0 }, evolve({}));

    expectTypeOf(result).toEqualTypeOf<{ n: number }>();
  });

  it("can handle data that is complex nested objects", () => {
    const result = pipe(
      {
        array: ["1", "2", "3"],
        nestedObj: { a: { b: "c" } },
        objAry: [
          { a: 0, b: 0 },
          { a: 1, b: 1 },
        ],
      },
      evolve({
        array: length(),
        nestedObj: { a: (x) => set(x, "b", "Set") },
        objAry: (x) => map(x, omit(["b"])),
      }),
    );

    expectTypeOf(result).toEqualTypeOf<{
      array: number;
      nestedObj: { a: { b: string } };
      objAry: Array<{ a: number }>;
    }>();
  });

  describe("it can detect mismatch of parameters and arguments", () => {
    it('detect property "number" are incompatible', () => {
      pipe(
        { number: "1", array: ["1", "2", "3"] },
        // @ts-expect-error [ts2345] - Evolver isn't the right type.
        evolve({
          // @ts-expect-error [ts2345] - Type 'string' is not assignable to type 'number | undefined'.
          number: add(1),
          array: length(),
        }),
      );
    });

    it('detect property "array" are incompatible', () => {
      pipe(
        { number: 1, array: ["1", "2", "3"] },
        // @ts-expect-error [ts2345] - Evolver isn't the right type.
        evolve({
          number: add(1),
          // @ts-expect-error [ts2345] - Type 'string[]' is not assignable to type 'readonly number[]'.
          array: (array: ReadonlyArray<number>) => array.length,
        }),
      );
    });
  });

  it("does not accept function that require multiple arguments", () => {
    pipe(
      { requiring2Args: 1 },
      // @ts-expect-error [ts2345] - Type '{ requiring2Args: any; }' provides no match for the signature '(input: { requiring2Args: number; }): unknown'.
      evolve({
        // @ts-expect-error [ts2322] - Target signature provides too few arguments. Expected 2 or more, but got 1.
        requiring2Args: (a: number, b: number) => a + b,
      }),
    );
  });

  it("accept function whose second and subsequent arguments are optional", () => {
    const result = pipe(
      { arg2Optional: 1, arg2arg3Optional: 1 },
      evolve({
        arg2Optional: (_: number, arg2?: number) => arg2 === undefined,
        arg2arg3Optional: (_: number, arg2?: number, arg3?: string) =>
          arg2 === undefined && arg3 === undefined,
      }),
    );

    expectTypeOf(result).toEqualTypeOf<{
      arg2Optional: boolean;
      arg2arg3Optional: boolean;
    }>();
  });

  it("can not handle function arrays.", () => {
    pipe(
      { quartile: [1, 2] },
      // @ts-expect-error [ts2345] - Type '{ quartile: ((value: number) => number)[]; }' provides no match for the signature '(input: { quartile: number[]; }): unknown'.
      evolve({
        // @ts-expect-error [ts2322] - Type '((value: number) => number)[]' provides no match for the signature '(data: number[]): unknown'.
        quartile: [add(1), add(-1)],
      }),
    );
  });
});

const sum = reduce((a, b: number) => add(a, b), 0);
