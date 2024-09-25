import { add } from "./add";
import { constant } from "./constant";
import { evolve } from "./evolve";
import { length } from "./length";
import { map } from "./map";
import { omit } from "./omit";
import { pipe } from "./pipe";
import { reduce } from "./reduce";
import { set } from "./set";

const sum = reduce((a, b: number) => add(a, b), 0);

describe("data first", () => {
  it("creates a new object by evolving the `data` according to the `transformation` functions", () => {
    expect(
      evolve(
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
      ),
    ).toStrictEqual({
      id: 2,
      quartile: 10,
      time: { elapsed: 101, remaining: 1399 },
    });
  });

  it("does not invoke function if `data` does not contain the key", () => {
    expect(evolve({} as { id?: number }, { id: add(1) })).toStrictEqual({});
  });

  it("is not destructive and is immutable", () => {
    const data = { n: 100 };
    const expected = { n: 101 };
    const result = evolve(data, { n: add(1) });

    expect(data).toStrictEqual({ n: 100 });
    expect(result).toStrictEqual(expected);
    expect(result).not.toBe(expected);
  });

  it("is recursive", () => {
    expect(
      evolve(
        { first: 1, nested: { second: 2, third: 3 } },
        { nested: { second: add(-1), third: add(1) } },
      ),
    ).toStrictEqual({ first: 1, nested: { second: 1, third: 4 } });
  });

  it("ignores undefined transformations", () => {
    expect(evolve({ n: 0 }, {})).toStrictEqual({ n: 0 });
  });

  it("can handle data that is complex nested objects", () => {
    expect(
      evolve(
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
      ),
    ).toStrictEqual({
      array: 3,
      nestedObj: { a: { b: "Set" } },
      objAry: [{ a: 0 }, { a: 1 }],
    });
  });

  it("accept function whose second and subsequent arguments are optional", () => {
    expect(
      evolve(
        { arg2Optional: 1, arg2arg3Optional: 1 },
        {
          arg2Optional: (_: number, arg2?: number) => arg2 === undefined,
          arg2arg3Optional: (_: number, arg2?: number, arg3?: number) =>
            arg2 === undefined && arg3 === undefined,
        },
      ),
    ).toStrictEqual({ arg2Optional: true, arg2arg3Optional: true });
  });

  it("doesn't evolve symbol keys", () => {
    const mock = vi.fn();
    const mySymbol = Symbol("a");
    // @ts-expect-error [ts2418] - We want to test the runtime even if the typing prevents it.
    evolve({ [mySymbol]: "hello" }, { [mySymbol]: mock });

    expect(mock).toHaveBeenCalledTimes(0);
  });

  it("ignore transformers for non-object values", () => {
    expect(
      evolve({ a: "hello" } as { a: string | { b: string } }, {
        a: { b: constant(3) },
      }),
    ).toStrictEqual({ a: "hello" });
  });
});

describe("data last", () => {
  it("creates a new object by evolving the `data` according to the `transformation` functions", () => {
    expect(
      pipe(
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
      ),
    ).toStrictEqual({
      id: 2,
      quartile: 10,
      time: { elapsed: 101, remaining: 1399 },
    });
  });

  it("does not invoke function if `data` does not contain the key", () => {
    expect(pipe({} as { id?: number }, evolve({ id: add(1) }))).toStrictEqual(
      {},
    );
  });

  it("is not destructive and is immutable", () => {
    const data = { n: 100 };
    const expected = { n: 101 };
    const result = pipe(data, evolve({ n: add(1) }));

    expect(data).toStrictEqual({ n: 100 });
    expect(result).toStrictEqual(expected);
    expect(result).not.toBe(expected);
  });

  it("is recursive", () => {
    expect(
      pipe(
        { first: 1, nested: { second: 2, third: 3 } },
        evolve({ nested: { second: add(-1), third: add(1) } }),
      ),
    ).toStrictEqual({ first: 1, nested: { second: 1, third: 4 } });
  });

  it("ignores undefined transformations", () => {
    expect(pipe({ n: 0 }, evolve({}))).toStrictEqual({ n: 0 });
  });

  it("can handle data that is complex nested objects", () => {
    expect(
      pipe(
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
      ),
    ).toStrictEqual({
      array: 3,
      nestedObj: { a: { b: "Set" } },
      objAry: [{ a: 0 }, { a: 1 }],
    });
  });

  it("accept function whose second and subsequent arguments are optional", () => {
    expect(
      pipe(
        { arg2Optional: 1, arg2arg3Optional: 1 },
        evolve({
          arg2Optional: (_: number, arg2?: number) => arg2 === undefined,
          arg2arg3Optional: (_: number, arg2?: number, arg3?: string) =>
            arg2 === undefined && arg3 === undefined,
        }),
      ),
    ).toStrictEqual({ arg2Optional: true, arg2arg3Optional: true });
  });
});
