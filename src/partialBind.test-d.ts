/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types, unicorn/consistent-function-scoping */
import { partialBind } from "./partialBind";
import type { RemedaTypeError } from "./internal/types";

type PartialBindError<Message extends string | number> = RemedaTypeError<
  "partialBind",
  Message
>;

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
    expectTypeOf(partialBind(fn, "a")).toEqualTypeOf<
      (
        x: PartialBindError<"Given type does not match positional argument">,
      ) => string
    >();
  });

  test("should not accept too many args", () => {
    expectTypeOf(partialBind(fn, 1, 2, 3, 4)).toEqualTypeOf<
      (x: PartialBindError<"Too many args provided to function">) => string
    >();
  });

  test("should not accept array typed partial", () => {
    expectTypeOf(partialBind(fn, ...([] as Array<number>))).toEqualTypeOf<
      (
        x?: number,
        y?: number,
        z?: number | string,
        // @ts-expect-error [ts1016]: This *is* the produced type, with a
        // required param after optional params. The resulting function type
        // is unusable anyway.
        w: PartialBindError<"Too many args provided to function">,
      ) => string
    >();
  });

  test("should not accept tuple typed partial with suffix", () => {
    expectTypeOf(
      partialBind(fn, ...([1, "a"] as [...Array<number>, string])),
    ).toEqualTypeOf<
      (
        x: PartialBindError<"Can't construct signature from provided args">,
      ) => string
    >();
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
  const fn = (...parts: Array<string>): string => parts.join("");

  test("should correctly type 0 partial args", () => {
    expectTypeOf(partialBind(fn)).toEqualTypeOf<
      (...parts: ReadonlyArray<string>) => string
    >();
  });

  test("should correctly type 1 partial arg", () => {
    expectTypeOf(partialBind(fn, "hello")).toEqualTypeOf<
      (...parts: ReadonlyArray<string>) => string
    >();
  });

  test("should not accept wrong arg type", () => {
    expectTypeOf(partialBind(fn, 1)).toEqualTypeOf<
      (
        x: PartialBindError<"Given type does not match optional or rest argument">,
      ) => string
    >();
  });

  test("should accept tuple typed partial arg", () => {
    expectTypeOf(partialBind(fn, ...([] as Array<string>))).toEqualTypeOf<
      (...parts: ReadonlyArray<string>) => string
    >();
  });

  test("should accept tuple typed partial arg with prefix", () => {
    expectTypeOf(
      partialBind(fn, ...(["hello"] as [string, ...Array<string>])),
    ).toEqualTypeOf<(...parts: ReadonlyArray<string>) => string>();
  });

  test("should accept tuple typed partial arg with prefix and suffix", () => {
    expectTypeOf(
      partialBind(
        fn,
        ...(["hello", "world"] as [string, ...Array<string>, string]),
      ),
    ).toEqualTypeOf<(...parts: ReadonlyArray<string>) => string>();
  });

  test("should not accept tuple typed partial arg with incorrect prefix", () => {
    expectTypeOf(
      partialBind(fn, ...([1, "hello"] as [number?, ...Array<string>])),
    ).toEqualTypeOf<
      (
        x: PartialBindError<"Given type does not match optional or rest argument">,
      ) => string
    >();
  });

  test("should not accept tuple typed partial arg with incorrect suffix", () => {
    expectTypeOf(
      partialBind(fn, ...(["hello", 1] as [...Array<string>, number])),
    ).toEqualTypeOf<
      (
        x: PartialBindError<"Given type does not match optional and rest argument">,
      ) => string
    >();
  });
});

describe("optional and rest param case", () => {
  const fn = (x: string, y = 123, ...parts: Array<string>): string =>
    `${x}, ${y}, and ${parts.join("")}`;

  test("should correctly type 0 partial args", () => {
    expectTypeOf(partialBind(fn)).toEqualTypeOf<
      (x: string, y?: number, ...parts: ReadonlyArray<string>) => string
    >();
  });

  test("should correctly type 1 partial arg", () => {
    expectTypeOf(partialBind(fn, "hello")).toEqualTypeOf<
      (y?: number, ...parts: ReadonlyArray<string>) => string
    >();
  });

  test("should correctly type 2 partial args", () => {
    expectTypeOf(partialBind(fn, "hello", undefined)).toEqualTypeOf<
      (...parts: ReadonlyArray<string>) => string
    >();
  });

  test("should correctly type 3 partial args", () => {
    expectTypeOf(partialBind(fn, "hello", undefined, "world")).toEqualTypeOf<
      (...parts: ReadonlyArray<string>) => string
    >();
  });

  test("should not accept wrong required arg type", () => {
    expectTypeOf(partialBind(fn, 1)).toEqualTypeOf<
      (
        x: PartialBindError<"Given type does not match positional argument">,
      ) => string
    >();
  });

  test("should not accept wrong optional arg type", () => {
    // This is correct; "hello" would be the second argument of fn.
    expectTypeOf(partialBind(fn, "hello", "world")).toEqualTypeOf<
      (
        x: PartialBindError<"Given type does not match optional or rest argument">,
      ) => string
    >();
  });

  test("should not accept wrong rest arg type", () => {
    expectTypeOf(partialBind(fn, "hello", 123, 1)).toEqualTypeOf<
      (
        x: PartialBindError<"Given type does not match optional or rest argument">,
      ) => string
    >();
  });

  test("should not accept incorrect tuple typed partial arg", () => {
    expectTypeOf(partialBind(fn, ...([] as Array<string>))).toEqualTypeOf<
      (
        x?: string,
        // @ts-expect-error [ts1016]: This *is* the produced type, with a
        // required param after optional params. The resulting function type
        // is unusable anyway.
        y: PartialBindError<"Given type does not match optional and rest argument">,
      ) => string
    >();
  });

  test("should accept correct tuple typed partial arg", () => {
    expectTypeOf(
      partialBind(fn, ...(["hello"] as [string, number?, ...Array<string>])),
    ).toEqualTypeOf<(...parts: ReadonlyArray<string>) => string>();
  });
});

describe("KNOWN ISSUES", () => {
  test("does not support readonly rest params", () => {
    const fn = (...parts: ReadonlyArray<string>): string => parts.join("");

    expectTypeOf(partialBind(fn)).toEqualTypeOf<
      // @ts-expect-error [ts2344]: blocked on https://github.com/microsoft/TypeScript/issues/37193
      (...parts: ReadonlyArray<string>) => string
    >();
  });
});
