import { expect, test } from "vitest";
import {
  ALL_TYPES_DATA_PROVIDER,
  TYPES_DATA_PROVIDER,
} from "../test/typesDataProvider";
import { isNonNull } from "./isNonNull";

test("should work as type guard", () => {
  expect(isNonNull(TYPES_DATA_PROVIDER.date)).toBe(true);
});

test("should work as type guard in filter", () => {
  const data = ALL_TYPES_DATA_PROVIDER.filter(isNonNull);

  expect(data).toHaveLength(18);
});
