import { expect, test } from "vitest";
import {
  ALL_TYPES_DATA_PROVIDER,
  TYPES_DATA_PROVIDER,
} from "../test/typesDataProvider";
import { isArray } from "./isArray";

test("should work as type guard", () => {
  expect(isArray(TYPES_DATA_PROVIDER.array)).toBe(true);
});

test("should work as type guard in filter", () => {
  const data = ALL_TYPES_DATA_PROVIDER.filter(isArray);

  expect(data.every((c) => Array.isArray(c))).toBe(true);
});
