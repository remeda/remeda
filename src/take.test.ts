import { pipe } from "./pipe";
import { take } from "./take";

describe("data_first", () => {
  it("take", () => {
    expect(take([1, 2, 3, 4, 3, 2, 1], 3)).toEqual([1, 2, 3]);
  });

  it("returns the whole array if N is greater than length", () => {
    expect(take([1, 2, 3] as const, 10)).toEqual([1, 2, 3]);
  });

  it("returns an empty array if N is negative", () => {
    expect(take([1, 2, 3] as const, -1)).toEqual([]);
  });
});

describe("data_last", () => {
  it("take", () => {
    expect(take(3)([1, 2, 3, 4, 3, 2, 1])).toEqual([1, 2, 3]);
  });

  it("lazy evaluation of trivial n=1", () => {
    expect(pipe([1, 2, 3, 4, 3, 2, 1], take(0))).toEqual([]);
  });
});

describe("typings", () => {
  it("handles strict tuples", () => {
    const strict = ["1", 2, true] as [string, number, boolean];
    expectTypeOf(take(strict, 2)).toEqualTypeOf<[string, number]>();

    const strictReadonly = ["1", 2, true] as readonly [string, number, boolean];
    expectTypeOf(take(strictReadonly, 2)).toEqualTypeOf<[string, number]>();
  });

  it("handles literal unions", () => {
    const unions = ["cat", "mouse"] as ["cat" | "dog", "mouse" | "chicken"];
    expectTypeOf(take(unions, 1)).toEqualTypeOf<["cat" | "dog"]>();

    const unionsReadonly = ["cat", "mouse"] as readonly [
      "cat" | "dog",
      "mouse" | "chicken",
    ];
    expectTypeOf(take(unionsReadonly, 1)).toEqualTypeOf<["cat" | "dog"]>();
  });

  it("handles rest tails", () => {
    const restTail = ["1", 2, 3] as [string, ...Array<number>];
    expectTypeOf(take(restTail, 1)).toEqualTypeOf<[string]>();
    expectTypeOf(take(restTail, 2)).toEqualTypeOf<[string, ...Array<number>]>();

    const restTailReadonly = ["1", 2, 3] as readonly [string, ...Array<number>];
    expectTypeOf(take(restTailReadonly, 1)).toEqualTypeOf<[string]>();
    expectTypeOf(take(restTailReadonly, 2)).toEqualTypeOf<
      [string, ...Array<number>]
    >();
  });

  it("handles rest heads", () => {
    const restHead = [1, 2, 3, "foo"] as [...Array<number>, string];
    expectTypeOf(take(restHead, 3)).toEqualTypeOf<[...Array<number>, string]>();

    const restHeadReadonly = [1, 2, 3, "foo"] as readonly [
      ...Array<number>,
      string,
    ];
    expectTypeOf(take(restHeadReadonly, 3)).toEqualTypeOf<
      [...Array<number>, string]
    >();
  });

  it("handles a mix of unions and rest params", () => {
    const mix = ["cat", 123, 123, 456] as ["cat" | "dog", ...Array<123 | 456>];
    expectTypeOf(take(mix, 1)).toEqualTypeOf<["cat" | "dog"]>();
    expectTypeOf(take(mix, 3)).toEqualTypeOf<
      ["cat" | "dog", ...Array<123 | 456>]
    >();

    const mixReadonly = ["cat", 123, 123, 456] as readonly [
      "cat" | "dog",
      ...Array<123 | 456>,
    ];
    expectTypeOf(take(mixReadonly, 1)).toEqualTypeOf<["cat" | "dog"]>();
    expectTypeOf(take(mixReadonly, 3)).toEqualTypeOf<
      ["cat" | "dog", ...Array<123 | 456>]
    >();
  });

  it("handles N greater than tuple length", () => {
    const short = ["foo"] as [string];
    expectTypeOf(take(short, 10)).toEqualTypeOf<[string]>();

    const shortReadonly = ["foo"] as readonly [string];
    expectTypeOf(take(shortReadonly, 10)).toEqualTypeOf<[string]>();
  });

  it("handles shorter heads", () => {
    const shortHead = [1, "foo", true, false] as [
      number,
      string,
      ...Array<boolean>,
    ];
    expectTypeOf(take(shortHead, 3)).toEqualTypeOf<
      [number, string, ...Array<boolean>]
    >();

    const shortHeadReadonly = [1, "foo", true, false] as readonly [
      number,
      string,
      ...Array<boolean>,
    ];
    expectTypeOf(take(shortHeadReadonly, 3)).toEqualTypeOf<
      [number, string, ...Array<boolean>]
    >();
  });

  it("handles longer heads", () => {
    const longHead = [1, "foo", true, "foo", "bar"] as [
      number,
      string,
      boolean,
      ...Array<string>,
    ];

    expectTypeOf(take(longHead, 2)).toEqualTypeOf<[number, string]>();
    expectTypeOf(take(longHead, 6)).toEqualTypeOf<
      [number, string, boolean, ...Array<string>]
    >();

    const longHeadReadonly = [1, "foo", true, "foo", "bar"] as readonly [
      number,
      string,
      boolean,
      ...Array<string>,
    ];

    expectTypeOf(take(longHeadReadonly, 2)).toEqualTypeOf<[number, string]>();
    expectTypeOf(take(longHeadReadonly, 6)).toEqualTypeOf<
      [number, string, boolean, ...Array<string>]
    >();

    it("handles regular arrays", () => {
      const input = [1, 2, 3];
      expectTypeOf(take(input, 1)).toEqualTypeOf<Array<number>>();
      expectTypeOf(take(input, -1)).toEqualTypeOf<[]>();
      expectTypeOf(take(input, 10)).toEqualTypeOf<Array<number>>();
    });
  });

  it("infers types in pipe", () => {
    const input = [1, 2, 3, 4] as [1, 2, 3, 4];
    const result = pipe(input, take(2));

    expectTypeOf(result).toEqualTypeOf<[1, 2]>();

    const inputReadonly = [1, 2, 3, 4] as readonly [1, 2, 3, 4];
    const resultReadonly = pipe(inputReadonly, take(2));

    expectTypeOf(resultReadonly).toEqualTypeOf<[1, 2]>();
  });
});
