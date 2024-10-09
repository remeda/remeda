/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types, unicorn/consistent-function-scoping */
import { partialLastBind } from "./partialLastBind";

describe("simple case (all required, no rest params)", () => {
  const fn = (x: number, y: number, z: number | string): string =>
    `${x}, ${y}, and ${z}`;

  test("should correctly type 0 partial args", () => {
    expectTypeOf(partialLastBind(fn)).toEqualTypeOf<
      (x: number, y: number, z: number | string) => string
    >();
  });

  test("should correctly type 1 partial arg", () => {
    expectTypeOf(partialLastBind(fn, 3)).toEqualTypeOf<
      (x: number, y: number) => string
    >();
  });

  test("should correctly type all partial args", () => {
    expectTypeOf(partialLastBind(fn, 1, 2, "c")).toEqualTypeOf<() => string>();
  });

  test("should not accept wrong arg type", () => {
    // @ts-expect-error - wrong arg type
    partialLastBind(fn, "b", "c");
  });

  test("should not accept too many args", () => {
    // @ts-expect-error - too many args
    partialLastBind(fn, 1, 2, 3, 4);
  });

  test("should not accept array typed partial", () => {
    // @ts-expect-error - don't know how many args are bound
    partialLastBind(fn, ...([] as Array<number>));
  });

  test("should not accept tuple typed partial with prefix", () => {
    // @ts-expect-error - wrong arg type
    partialLastBind(fn, ...(["a", 1] as [string, ...Array<number>]));
  });
});

describe("optional params", () => {
  const fn = (x: string, y = 123, z = true): string => `${x}, ${y}, and ${z}`;

  test("should correctly type 0 partial args", () => {
    expectTypeOf(partialLastBind(fn)).toEqualTypeOf<
      (x: string, y?: number, z?: boolean) => string
    >();
  });

  test("should correctly type 1 partial arg", () => {
    expectTypeOf(partialLastBind(fn, false)).toEqualTypeOf<
      (x: string, y?: number) => string
    >();
  });

  test("should correctly type 2 partial args", () => {
    expectTypeOf(partialLastBind(fn, undefined, false)).toEqualTypeOf<
      (x: string) => string
    >();
  });

  test("should correctly type all partial args", () => {
    expectTypeOf(partialLastBind(fn, "hello", undefined, false)).toEqualTypeOf<
      () => string
    >();
  });
});

describe("simple rest param case", () => {
  const fn = (...parts: Array<string>): string => parts.join("");

  test("should correctly type 0 partial args", () => {
    expectTypeOf(partialLastBind(fn)).toEqualTypeOf<
      (...parts: ReadonlyArray<string>) => string
    >();
  });

  test("should correctly type 1 partial arg", () => {
    expectTypeOf(partialLastBind(fn, "hello")).toEqualTypeOf<
      (...parts: ReadonlyArray<string>) => string
    >();
  });

  test("should not accept wrong arg type", () => {
    // @ts-expect-error - wrong arg type
    partialLastBind(fn, 1);
  });

  test("should accept tuple typed partial arg", () => {
    expectTypeOf(
      partialLastBind(fn, ...([] as [...Array<string>])),
    ).toEqualTypeOf<(...parts: ReadonlyArray<string>) => string>();
  });

  test("should accept tuple typed partial arg with prefix", () => {
    expectTypeOf(
      partialLastBind(fn, ...(["hello"] as [string, ...Array<string>])),
    ).toEqualTypeOf<(...parts: ReadonlyArray<string>) => string>();
  });

  test("should accept tuple typed partial arg with prefix and suffix", () => {
    expectTypeOf(
      partialLastBind(
        fn,
        ...(["hello", "world"] as [string, ...Array<string>, string]),
      ),
    ).toEqualTypeOf<(...parts: ReadonlyArray<string>) => string>();
  });

  test("should not accept tuple typed partial arg with incorrect prefix", () => {
    // @ts-expect-error - wrong arg type
    partialLastBind(fn, ...([1, "hello"] as [number?, ...Array<string>]));
  });

  test("should not accept tuple typed partial arg with incorrect suffix", () => {
    // @ts-expect-error - wrong arg type
    partialLastBind(fn, ...(["hello", 1] as [...Array<string>, number]));
  });
});

describe("KNOWN ISSUES", () => {
  test("does not support readonly rest params", () => {
    const fn = (...parts: ReadonlyArray<string>): string => parts.join("");

    // @ts-expect-error [ts2344]: blocked on https://github.com/microsoft/TypeScript/issues/37193
    expectTypeOf(partialLastBind(fn)).toEqualTypeOf<
      // @ts-expect-error [ts2344]: blocked on https://github.com/microsoft/TypeScript/issues/37193
      (...parts: ReadonlyArray<string>) => string
    >();
  });

  describe("does not support optional AND rest params", () => {
    const fn = (x: string, y = 123, ...parts: Array<string>): string =>
      `${x}, ${y}, and ${parts.join("")}`;

    expectTypeOf(partialLastBind(fn, "hello")).toEqualTypeOf<
      // @ts-expect-error [ts2344]: I don't think this is possible on the type-level?
      // We don't know whether "hello" is in x or parts.
      (x: string, y?: number, ...parts: ReadonlyArray<string>) => string
    >();
  });
});
