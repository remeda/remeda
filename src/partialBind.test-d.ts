/* eslint-disable unicorn/consistent-function-scoping */
import { partialBind } from "./partialBind";

const fn = (x: number, y: number, z: number): string => `${x}, ${y}, and ${z}`;

test("should correctly type 0 partial args", () => {
  expectTypeOf(partialBind([], fn)).toEqualTypeOf<
    (x: number, y: number, z: number) => string
  >();
});

test("should correctly type 1 partial arg", () => {
  expectTypeOf(partialBind([1], fn)).toEqualTypeOf<
    (y: number, z: number) => string
  >();
});

test("should correctly type all partial args", () => {
  expectTypeOf(partialBind([1, 2, 3], fn)).toEqualTypeOf<() => string>();
});

it("should not accept wrong arg type", () => {
  expectTypeOf(partialBind([123], (x: string) => x)).toEqualTypeOf<
    (
      x: "RemedaTypeError(partialBind): Argument of the wrong type provided to function.",
    ) => string
  >();
});

it("should not accept too many args", () => {
  expectTypeOf(partialBind([123, 456], (x: number) => x)).toEqualTypeOf<
    (
      x: "RemedaTypeError(partialBind): Too many args provided to function.",
    ) => number
  >();
});

it("should allow refined types", () => {
  expectTypeOf(partialBind([123], (x: string | number) => x)).toEqualTypeOf<
    () => string | number
  >();
});

it("should support optional params", () => {
  const foo = (x = true): boolean => x;
  expectTypeOf(partialBind([true], foo)).toEqualTypeOf<() => boolean>();
});

it("should support optional params after non-optional ones", () => {
  const foo = (x: string, y: number, z = true): string =>
    `${x}, ${y}, and ${z}`;

  expectTypeOf(partialBind([], foo)).toEqualTypeOf<
    (x: string, y: number, z?: boolean) => string
  >();
  expectTypeOf(partialBind(["hello"], foo)).toEqualTypeOf<
    (y: number, z?: boolean) => string
  >();
  expectTypeOf(partialBind(["hello", 123], foo)).toEqualTypeOf<
    (z?: boolean) => string
  >();
  expectTypeOf(partialBind(["hello", 123, false], foo)).toEqualTypeOf<
    () => string
  >();
});

it("should support variadic params", () => {
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  const foo = (...parts: Array<string>): string => parts.join("");

  expectTypeOf(partialBind([], foo)).toEqualTypeOf<
    (...parts: ReadonlyArray<string>) => string
  >();
  expectTypeOf(partialBind(["hello"], foo)).toEqualTypeOf<
    (...parts: ReadonlyArray<string>) => string
  >();
  expectTypeOf(partialBind([123], foo)).toEqualTypeOf<
    (
      x: "RemedaTypeError(partialBind): Argument of the wrong type provided to function.",
    ) => string
  >();
  expectTypeOf(
    partialBind(["hello", "world"] as [string, ...Array<string>], foo),
  ).toEqualTypeOf<(...parts: ReadonlyArray<string>) => string>();
});

it("should support readonly variadic params", () => {
  const foo = (...parts: ReadonlyArray<string>): string => parts.join("");

  expectTypeOf(partialBind([], foo)).toEqualTypeOf<
    // @ts-expect-error [ts2344]: blocked on typescript #37193
    (...parts: ReadonlyArray<string>) => string
  >();
});
