/* eslint-disable unicorn/consistent-function-scoping */
import { partialLastBind } from "./partialLastBind";

describe("simple case (all required, no rest params)", () => {
  const fn = (x: number, y: number, z: number | string): string =>
    `${x}, ${y}, and ${z}`;

  test("should correctly type 0 partial args", () => {
    expectTypeOf(partialLastBind(fn, [])).toEqualTypeOf<
      (x: number, y: number, z: number | string) => string
    >();
  });

  test("should correctly type 1 partial arg", () => {
    expectTypeOf(partialLastBind(fn, [3])).toEqualTypeOf<
      (x: number, y: number) => string
    >();
  });

  test("should correctly type all partial args", () => {
    expectTypeOf(partialLastBind(fn, [1, 2, 3])).toEqualTypeOf<() => string>();
  });

  test("should allow refined types", () => {
    expectTypeOf(partialLastBind(fn, [1, 2, "c"])).toEqualTypeOf<
      () => string
    >();
  });

  test("should not accept wrong arg type", () => {
    expectTypeOf(partialLastBind(fn, ["b", "c"])).toEqualTypeOf<
      (
        x: "RemedaTypeError(partialRightBind): Argument of the wrong type provided to function.",
      ) => string
    >();
  });

  test("should not accept too many args", () => {
    expectTypeOf(partialLastBind(fn, [1, 2, 3, 4])).toEqualTypeOf<
      (
        x: "RemedaTypeError(partialRightBind): Too many args provided to function.",
      ) => string
    >();
  });

  test("should not accept array typed partial", () => {
    expectTypeOf(partialLastBind(fn, [] as Array<number>)).toEqualTypeOf<
      (
        w: "RemedaTypeError(partialRightBind): Too many args provided to function.",
        x?: number,
        y?: number,
        z?: number | string,
      ) => string
    >();
  });

  test("should not accept tuple typed partial with prefix", () => {
    expectTypeOf(
      partialLastBind(fn, ["a", 1] as [string, ...Array<number>]),
    ).toEqualTypeOf<
      (
        x: "RemedaTypeError(partialRightBind): Can't infer type of provided args.",
        y?: number | string,
      ) => string
    >();
  });
});

describe("optional params", () => {
  const fn = (x: string, y = 123, z = true): string => `${x}, ${y}, and ${z}`;

  test("should correctly type 0 partial args", () => {
    expectTypeOf(partialLastBind(fn, [])).toEqualTypeOf<
      (x: string, y?: number, z?: boolean) => string
    >();
  });

  test("should correctly type 1 partial arg", () => {
    expectTypeOf(partialLastBind(fn, [false])).toEqualTypeOf<
      (x: string, y?: number) => string
    >();
  });

  test("should correctly type 2 partial args", () => {
    expectTypeOf(partialLastBind(fn, [undefined, false])).toEqualTypeOf<
      (x: string) => string
    >();
  });

  test("should correctly type all partial args", () => {
    expectTypeOf(
      partialLastBind(fn, ["hello", undefined, false]),
    ).toEqualTypeOf<() => string>();
  });
});

describe("simple rest param case", () => {
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  const fn = (...parts: Array<string>): string => parts.join("");

  test("should correctly type 0 partial args", () => {
    expectTypeOf(partialLastBind(fn, [])).toEqualTypeOf<
      (...parts: ReadonlyArray<string>) => string
    >();
  });

  test("should correctly type 1 partial arg", () => {
    expectTypeOf(partialLastBind(fn, ["hello"])).toEqualTypeOf<
      (...parts: ReadonlyArray<string>) => string
    >();
  });

  test("should not accept wrong arg type", () => {
    expectTypeOf(partialLastBind(fn, [1])).toEqualTypeOf<
      (
        x: "RemedaTypeError(partialRightBind): Argument of the wrong type provided to function.",
      ) => string
    >();
  });

  test("should accept tuple typed partial arg", () => {
    expectTypeOf(partialLastBind(fn, [] as [...Array<string>])).toEqualTypeOf<
      (...parts: ReadonlyArray<string>) => string
    >();
  });

  test("should accept tuple typed partial arg with prefix", () => {
    expectTypeOf(
      partialLastBind(fn, ["hello"] as [string, ...Array<string>]),
    ).toEqualTypeOf<(...parts: ReadonlyArray<string>) => string>();
  });

  test("should accept tuple typed partial arg with prefix and suffix", () => {
    expectTypeOf(
      partialLastBind(fn, ["hello", "world"] as [
        string,
        ...Array<string>,
        string,
      ]),
    ).toEqualTypeOf<(...parts: ReadonlyArray<string>) => string>();
  });

  test("should not accept tuple typed partial arg with incorrect prefix", () => {
    expectTypeOf(
      partialLastBind(fn, [1, "hello"] as [number?, ...Array<string>]),
    ).toEqualTypeOf<
      (
        x: "RemedaTypeError(partialRightBind): Argument of the wrong type provided to function.",
      ) => string
    >();
  });

  test("should not accept tuple typed partial arg with incorrect suffix", () => {
    expectTypeOf(
      partialLastBind(fn, ["hello", 1] as [...Array<string>, number]),
    ).toEqualTypeOf<
      (
        x: "RemedaTypeError(partialRightBind): Argument of the wrong type provided to function.",
      ) => string
    >();
  });
});

describe("KNOWN ISSUES", () => {
  test("does not support readonly rest params", () => {
    const fn = (...parts: ReadonlyArray<string>): string => parts.join("");

    expectTypeOf(partialLastBind(fn, [])).toEqualTypeOf<
      // @ts-expect-error [ts2344]: blocked on https://github.com/microsoft/TypeScript/issues/37193
      (...parts: ReadonlyArray<string>) => string
    >();
  });

  describe("does not support optional AND rest params", () => {
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    const fn = (x: string, y = 123, ...parts: Array<string>): string =>
      `${x}, ${y}, and ${parts.join("")}`;

    expectTypeOf(partialLastBind(fn, ["hello"])).toEqualTypeOf<
      // @ts-expect-error [ts2344]: I don't think this is possible on the type-level?
      // We don't know whether "hello" is in x or parts.
      (x: string, y?: number, ...parts: ReadonlyArray<string>) => string
    >();
  });
});
