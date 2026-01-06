/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types, unicorn/consistent-function-scoping */
import { describe, expectTypeOf, test } from "vitest";
import { partialBind } from "./partialBind";

describe("simple case (all required, no rest params)", () => {
  const fn = (x: number, y: number, z: number | string): string =>
    `${x}, ${y}, and ${z}`;

  test("should correctly type 0 partial args", () => {
    expectTypeOf(partialBind(fn)).toEqualTypeOf<
      (x: number, y: number, z: number | string) => string
    >();
  });

  test("should correctly type 1 partial arg", () => {
    expectTypeOf(partialBind(fn, 1)).toEqualTypeOf<
      (y: number, z: number | string) => string
    >();
  });

  test("should correctly type all partial args", () => {
    expectTypeOf(partialBind(fn, 1, 2, "a")).toEqualTypeOf<() => string>();
  });

  test("should not accept wrong arg type", () => {
    // @ts-expect-error [ts2345] - wrong arg type
    partialBind(fn, "a");
  });

  test("should not accept too many args", () => {
    // @ts-expect-error [ts2345] - too many args
    partialBind(fn, 1, 2, 3, 4);
  });

  test("should not accept array typed partial", () => {
    // @ts-expect-error [ts2345] - don't know how many args are bound
    partialBind(fn, ...([] as number[]));
  });

  test("should not accept tuple typed partial with suffix", () => {
    // @ts-expect-error [ts2345] - wrong arg type
    partialBind(fn, ...([1, "a"] as [...number[], string]));
  });
});

describe("optional params", () => {
  const fn = (x: string, y = 123, z = true): string => `${x}, ${y}, and ${z}`;

  test("should correctly type 0 partial args", () => {
    expectTypeOf(partialBind(fn)).toEqualTypeOf<
      (x: string, y?: number, z?: boolean) => string
    >();
  });

  test("should correctly type 1 partial arg", () => {
    expectTypeOf(partialBind(fn, "hello")).toEqualTypeOf<
      (y?: number, z?: boolean) => string
    >();
  });

  test("should correctly type 2 partial args", () => {
    expectTypeOf(partialBind(fn, "hello", undefined)).toEqualTypeOf<
      (z?: boolean) => string
    >();
  });

  test("should correctly type all partial args", () => {
    expectTypeOf(partialBind(fn, "hello", undefined, false)).toEqualTypeOf<
      () => string
    >();
  });
});

describe("simple rest param case", () => {
  const fn = (...parts: string[]): string => parts.join("");

  test("should correctly type 0 partial args", () => {
    expectTypeOf(partialBind(fn)).toEqualTypeOf<
      (...parts: readonly string[]) => string
    >();
  });

  test("should correctly type 1 partial arg", () => {
    expectTypeOf(partialBind(fn, "hello")).toEqualTypeOf<
      (...parts: readonly string[]) => string
    >();
  });

  test("should not accept wrong arg type", () => {
    // @ts-expect-error [ts2345] - wrong arg type
    partialBind(fn, 1);
  });

  test("should accept tuple typed partial arg", () => {
    expectTypeOf(partialBind(fn, ...([] as string[]))).toEqualTypeOf<
      (...parts: readonly string[]) => string
    >();
  });

  test("should accept tuple typed partial arg with prefix", () => {
    expectTypeOf(
      partialBind(fn, ...(["hello"] as [string, ...string[]])),
    ).toEqualTypeOf<(...parts: readonly string[]) => string>();
  });

  test("should accept tuple typed partial arg with prefix and suffix", () => {
    expectTypeOf(
      partialBind(fn, ...(["hello", "world"] as [string, ...string[], string])),
    ).toEqualTypeOf<(...parts: readonly string[]) => string>();
  });

  test("should not accept tuple typed partial arg with incorrect prefix", () => {
    // @ts-expect-error [ts2345] - wrong arg type
    partialBind(fn, ...([1, "hello"] as [number?, ...string[]]));
  });

  test("should not accept tuple typed partial arg with incorrect suffix", () => {
    // @ts-expect-error [ts2345] - wrong arg type
    partialBind(fn, ...(["hello", 1] as [...string[], number]));
  });
});

describe("optional and rest param case", () => {
  const fn = (x: string, y = 123, ...parts: string[]): string =>
    `${x}, ${y}, and ${parts.join("")}`;

  test("should correctly type 0 partial args", () => {
    expectTypeOf(partialBind(fn)).toEqualTypeOf<
      (x: string, y?: number, ...parts: readonly string[]) => string
    >();
  });

  test("should correctly type 1 partial arg", () => {
    expectTypeOf(partialBind(fn, "hello")).toEqualTypeOf<
      (y?: number, ...parts: readonly string[]) => string
    >();
  });

  test("should correctly type 2 partial args", () => {
    expectTypeOf(partialBind(fn, "hello", undefined)).toEqualTypeOf<
      (...parts: readonly string[]) => string
    >();
  });

  test("should correctly type 3 partial args", () => {
    expectTypeOf(partialBind(fn, "hello", undefined, "world")).toEqualTypeOf<
      (...parts: readonly string[]) => string
    >();
  });

  test("should not accept wrong required arg type", () => {
    // @ts-expect-error [ts2345] - wrong arg type
    partialBind(fn, 1);
  });

  test("should not accept wrong optional arg type", () => {
    // @ts-expect-error [ts2345] - This is correct; "hello" would be the second argument of fn.
    partialBind(fn, "hello", "world");
  });

  test("should not accept wrong rest arg type", () => {
    // @ts-expect-error [ts2345] - wrong rest arg type
    partialBind(fn, "hello", 123, 1);
  });

  test("should not accept incorrect tuple typed partial arg", () => {
    // @ts-expect-error [ts2345] - doesn't match optional
    partialBind(fn, ...([] as string[]));
  });

  test("should accept correct tuple typed partial arg", () => {
    expectTypeOf(
      partialBind(fn, ...(["hello"] as [string, number?, ...string[]])),
    ).toEqualTypeOf<(...parts: readonly string[]) => string>();
  });
});

describe("known issues!", () => {
  test("does not support readonly rest params", () => {
    const fn = (...parts: readonly string[]): string => parts.join("");

    // @ts-expect-error [ts2345]: blocked on https://github.com/microsoft/TypeScript/issues/37193
    expectTypeOf(partialBind(fn)).toEqualTypeOf<
      // @ts-expect-error [ts2344]: blocked on https://github.com/microsoft/TypeScript/issues/37193
      (...parts: readonly string[]) => string
    >();
  });
});
