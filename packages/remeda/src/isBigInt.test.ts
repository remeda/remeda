import { expect, test } from "vitest";
import {
  ALL_TYPES_DATA_PROVIDER,
  TYPES_DATA_PROVIDER,
} from "../test/typesDataProvider";
import { isBigInt } from "./isBigInt";

test("should work as type guard", () => {
  expect(isBigInt(TYPES_DATA_PROVIDER.bigint)).toBe(true);
});

test("should work as type guard in filter", () => {
  const data = ALL_TYPES_DATA_PROVIDER.filter(isBigInt);

  expect(data.every((c) => typeof c === "bigint")).toBe(true);
});
