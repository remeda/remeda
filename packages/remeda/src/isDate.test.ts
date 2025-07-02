import { expect, test } from "vitest";
import {
  ALL_TYPES_DATA_PROVIDER,
  TYPES_DATA_PROVIDER,
} from "../test/typesDataProvider";
import { isDate } from "./isDate";

test("should work as type guard", () => {
  expect(isDate(TYPES_DATA_PROVIDER.date)).toBe(true);
});

test("should work as type guard in filter", () => {
  const data = ALL_TYPES_DATA_PROVIDER.filter(isDate);

  expect(data.every((c) => c instanceof Date)).toBe(true);
});
