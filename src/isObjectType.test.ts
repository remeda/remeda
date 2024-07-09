import { ALL_TYPES_DATA_PROVIDER, TestClass } from "../test/typesDataProvider";
import { isObjectType } from "./isObjectType";

it("accepts simple objects", () => {
  expect(isObjectType({ a: 123 })).toEqual(true);
});

it("accepts trivial empty objects", () => {
  expect(isObjectType({})).toEqual(true);
});

it("rejects strings", () => {
  expect(isObjectType("asd")).toEqual(false);
});

it("rejects null", () => {
  expect(isObjectType(null)).toEqual(false);
});

it("accepts arrays", () => {
  expect(isObjectType([1, 2, 3])).toEqual(true);
});

it("accepts classes", () => {
  expect(isObjectType(new TestClass())).toEqual(true);
});

it("accepts null prototypes", () => {
  expect(isObjectType(Object.create(null))).toEqual(true);
});

test("ALL_TYPES_DATA_PROVIDER", () => {
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
