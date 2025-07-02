import { expect, test } from "vitest";
import { ALL_TYPES_DATA_PROVIDER, TestClass } from "../test/typesDataProvider";
import { isObjectType } from "./isObjectType";

test("accepts simple objects", () => {
  expect(isObjectType({ a: 123 })).toBe(true);
});

test("accepts trivial empty objects", () => {
  expect(isObjectType({})).toBe(true);
});

test("rejects strings", () => {
  expect(isObjectType("asd")).toBe(false);
});

test("rejects null", () => {
  expect(isObjectType(null)).toBe(false);
});

test("accepts arrays", () => {
  expect(isObjectType([1, 2, 3])).toBe(true);
});

test("accepts classes", () => {
  expect(isObjectType(new TestClass())).toBe(true);
});

test("accepts null prototypes", () => {
  expect(isObjectType(Object.create(null))).toBe(true);
});

test("everything from ALL_TYPES_DATA_PROVIDER", () => {
  expect(ALL_TYPES_DATA_PROVIDER.filter(isObjectType)).toMatchInlineSnapshot(`
      [
        [
          1,
          2,
          3,
        ],
        1985-07-24T07:40:00.000Z,
        [Error: asd],
        TestClass {},
        Map {},
        {
          "a": "asd",
        },
        Promise {},
        /test/gu,
        Set {},
        [
          1,
          2,
          3,
        ],
        Uint8Array [
          0,
        ],
      ]
    `);
});
