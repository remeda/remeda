import { ALL_TYPES_DATA_PROVIDER, TestClass } from "../test/typesDataProvider";
import { isPlainObject } from "./isPlainObject";

it("accepts simple objects", () => {
  expect(isPlainObject({ a: 123 })).toEqual(true);
});

it("accepts trivial empty objects", () => {
  expect(isPlainObject({})).toEqual(true);
});

it("rejects strings", () => {
  expect(isPlainObject("asd")).toEqual(false);
});

it("rejects arrays", () => {
  expect(isPlainObject([1, 2, 3])).toEqual(false);
});

it("rejects classes", () => {
  expect(isPlainObject(new TestClass())).toEqual(false);
});

it("accepts null prototypes", () => {
  expect(isPlainObject(Object.create(null))).toEqual(true);
});

test("ALL_TYPES_DATA_PROVIDER", () => {
  expect(ALL_TYPES_DATA_PROVIDER.filter(isPlainObject)).toMatchInlineSnapshot(`
        [
          {
            "a": "asd",
          },
        ]
      `);
});
