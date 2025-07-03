import { expect, test } from "vitest";
import {
  ALL_TYPES_DATA_PROVIDER,
  TYPES_DATA_PROVIDER,
} from "../test/typesDataProvider";
import { isNumber } from "./isNumber";

test("should work as type guard", () => {
  expect(isNumber(TYPES_DATA_PROVIDER.number)).toBe(true);
});

test("should work as type guard in filter", () => {
  const data = ALL_TYPES_DATA_PROVIDER.filter(isNumber);

  expect(data.every((c) => typeof c === "number")).toBe(true);
});
