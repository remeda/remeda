import { expect, test } from "vitest";
import {
  ALL_TYPES_DATA_PROVIDER,
  TYPES_DATA_PROVIDER,
} from "../test/typesDataProvider";
import { isDefined } from "./isDefined";

test("should work as type guard", () => {
  expect(isDefined(TYPES_DATA_PROVIDER.date)).toBe(true);
});

test("should work as type guard in filter", () => {
  const data = ALL_TYPES_DATA_PROVIDER.filter(isDefined);

  expect(data).toHaveLength(18);
});
