import { expect, test } from "vitest";
import {
  ALL_TYPES_DATA_PROVIDER,
  TYPES_DATA_PROVIDER,
} from "../test/typesDataProvider";
import { isNonNullish } from "./isNonNullish";

test("should work as type guard", () => {
  expect(isNonNullish(TYPES_DATA_PROVIDER.date)).toBe(true);
});

test("should work as type guard in filter", () => {
  const data = ALL_TYPES_DATA_PROVIDER.filter(isNonNullish);

  expect(data).toHaveLength(17);
});
