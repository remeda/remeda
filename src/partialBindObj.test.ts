/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */
import { partialBindObj } from "./partialBindObj";

const fn = ({ x, y, z }: { x: number; y: number; z: number }): string =>
  `${x}, ${y}, and ${z}`;

test("should partially apply 0 args", () => {
  expect(partialBindObj({}, fn)({ x: 1, y: 2, z: 3 })).toBe(
    fn({ x: 1, y: 2, z: 3 }),
  );
});

test("should partially apply 1 arg", () => {
  expect(partialBindObj({ x: 1 }, fn)({ y: 2, z: 3 })).toBe(
    fn({ x: 1, y: 2, z: 3 }),
  );
});

test("should partially apply all args", () => {
  expect(partialBindObj({ x: 1, y: 2, z: 3 }, fn)({})).toBe(
    fn({ x: 1, y: 2, z: 3 }),
  );
});
