import { expect, test } from "vitest";
import { ALL_TYPES_DATA_PROVIDER, TestClass } from "../test/typesDataProvider";
import { isPlainObject } from "./isPlainObject";

test("accepts simple objects", () => {
  expect(isPlainObject({ a: 123 })).toBe(true);
});

test("accepts trivial empty objects", () => {
  expect(isPlainObject({})).toBe(true);
});

test("rejects strings", () => {
  expect(isPlainObject("asd")).toBe(false);
});

test("rejects arrays", () => {
  expect(isPlainObject([1, 2, 3])).toBe(false);
});

test("rejects classes", () => {
  expect(isPlainObject(new TestClass())).toBe(false);
});

test("accepts null prototypes", () => {
  expect(isPlainObject(Object.create(null))).toBe(true);
});

test("everything from ALL_TYPES_DATA_PROVIDER", () => {
  expect(ALL_TYPES_DATA_PROVIDER.filter(isPlainObject)).toMatchInlineSnapshot(`
        [
          {
            "a": "asd",
          },
        ]
      `);
});
