import { expect, test } from "vitest";
import { ALL_TYPES_DATA_PROVIDER } from "../test/typesDataProvider";
import { isNullish } from "./isNullish";

test("accepts nulls", () => {
  expect(isNullish(null)).toBe(true);
});

test("accepts undefined", () => {
  expect(isNullish(undefined)).toBe(true);
});

test("rejects anything else", () => {
  for (const data of ALL_TYPES_DATA_PROVIDER) {
    if (data === null || data === undefined) {
      continue;
    }

    expect(isNullish(data)).toBe(false);
  }
});
