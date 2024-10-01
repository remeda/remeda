/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */
import { partialBindObj } from "./partialBindObj";

const fn = ({ x, y, z }: { x: number; y: number; z: number }): string =>
  `${x}, ${y}, and ${z}`;

test("should correctly type 0 partial args", () => {
  expectTypeOf(partialBindObj({}, fn)).toEqualTypeOf<
    (arg: { x: number; y: number; z: number }) => string
  >();
});

test("should correctly type 1 partial arg", () => {
  expectTypeOf(partialBindObj({ x: 1 }, fn)).toEqualTypeOf<
    (arg: { y: number; z: number }) => string
  >();
});

test("should correctly type all partial args", () => {
  expectTypeOf(partialBindObj({ x: 1, y: 2, z: 3 }, fn)).toEqualTypeOf<
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type -- Want to have empty object type; Record<PropertyKey, never> doesn't work.
    (arg: {}) => string
  >();
});

it("should not accept wrong prop type", () => {
  expectTypeOf(
    partialBindObj({ x: 1 }, ({ x }: { x: string }) => x),
  ).toEqualTypeOf<
    (arg: {
      x: "RemedaTypeError(partialBindObj): Property has wrong type.";
    }) => string
  >();
});

it("should not accept extra props", () => {
  expectTypeOf(
    partialBindObj({ x: 1, y: 2 }, ({ x }: { x: number }) => x),
  ).toEqualTypeOf<
    (arg: {
      y: "RemedaTypeError(partialBindObj): Key not in original object.";
    }) => number
  >();
});
