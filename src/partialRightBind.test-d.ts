/* eslint-disable unicorn/consistent-function-scoping */
import { partialRightBind } from "./partialRightBind";

const fn = (x: number, y: number, z: number): string => `${x}, ${y}, and ${z}`;

test("should correctly type 0 partial args", () => {
  expectTypeOf(partialRightBind([], fn)).toEqualTypeOf<
    (x: number, y: number, z: number) => string
  >();
});

test("should correctly type 1 partial arg", () => {
  expectTypeOf(partialRightBind([1], fn)).toEqualTypeOf<
    (y: number, z: number) => string
  >();
});

test("should correctly type all partial args", () => {
  expectTypeOf(partialRightBind([1, 2, 3], fn)).toEqualTypeOf<() => string>();
});

it("should not accept wrong arg type", () => {
  expectTypeOf(partialRightBind([123], (x: string) => x)).toEqualTypeOf<
    (
      x: "RemedaTypeError(partialRightBind): Argument of the wrong type provided to function.",
    ) => string
  >();
});

it("should not accept too many args", () => {
  expectTypeOf(partialRightBind([123, 456], (x: number) => x)).toEqualTypeOf<
    (
      x: "RemedaTypeError(partialRightBind): Too many args provided to function.",
    ) => number
  >();
});

it("should allow refined types", () => {
  expectTypeOf(
    partialRightBind([123], (x: string | number) => x),
  ).toEqualTypeOf<() => string | number>();
});

it("should support optional params", () => {
  const foo = (x = true): boolean => x;
  expectTypeOf(partialRightBind([true], foo)).toEqualTypeOf<() => boolean>();
});

it("should support optional params after non-optional ones", () => {
  const foo = (x: string, y: number, z = true): string =>
    `${x}, ${y}, and ${z}`;

  expectTypeOf(partialRightBind([], foo)).toEqualTypeOf<
    (x: string, y: number, z?: boolean) => string
  >();

  expectTypeOf(partialRightBind([false], foo)).toEqualTypeOf<
    (x: string, y: number) => string
  >();
  expectTypeOf(partialRightBind([123, false], foo)).toEqualTypeOf<
    (x: string) => string
  >();
  expectTypeOf(partialRightBind(["hello", 123, false], foo)).toEqualTypeOf<
    () => string
  >();

  expectTypeOf(partialRightBind([123], foo)).toEqualTypeOf<
    // @ts-expect-error [ts2344]: unclear how to make this work...
    (x: string) => string
  >();
});

it("should support variadic params", () => {
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  const foo = (...parts: Array<string>): string => parts.join("");

  expectTypeOf(partialRightBind([], foo)).toEqualTypeOf<
    (...parts: ReadonlyArray<string>) => string
  >();
  expectTypeOf(partialRightBind(["hello"], foo)).toEqualTypeOf<
    (...parts: ReadonlyArray<string>) => string
  >();
  expectTypeOf(partialRightBind([123], foo)).toEqualTypeOf<
    (
      x: "RemedaTypeError(partialRightBind): Argument of the wrong type provided to function.",
    ) => string
  >();
  expectTypeOf(
    partialRightBind(["hello", "world"] as [string, ...Array<string>], foo),
  ).toEqualTypeOf<(...parts: ReadonlyArray<string>) => string>();
});

it("should support readonly variadic params", () => {
  const foo = (...parts: ReadonlyArray<string>): string => parts.join("");

  expectTypeOf(partialRightBind([], foo)).toEqualTypeOf<
    // @ts-expect-error [ts2344]: blocked on typescript #37193
    (...parts: ReadonlyArray<string>) => string
  >();
});
