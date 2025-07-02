import { expect, it } from "vitest";
import {
  ALL_TYPES_DATA_PROVIDER,
  TYPES_DATA_PROVIDER,
} from "../test/typesDataProvider";
import { isString } from "./isString";

it("should work as type guard", () => {
  expect(isString(TYPES_DATA_PROVIDER.string)).toBe(true);
});

it("should work as type guard in array", () => {
  const data = ALL_TYPES_DATA_PROVIDER.filter(isString);

  expect(data.every((c) => typeof c === "string")).toBe(true);
});
