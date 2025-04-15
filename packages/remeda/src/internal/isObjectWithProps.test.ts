import {
  ALL_TYPES_DATA_PROVIDER,
  TestClass,
} from "../../test/typesDataProvider";
import { isObjectWithProps } from "./isObjectWithProps";

it("accepts simple objects", () => {
  expect(isObjectWithProps({ a: 123 }, "a")).toBe(true);
});

it("accepts trivial empty objects", () => {
  expect(isObjectWithProps({}, [])).toBe(true);
});

it("rejects strings", () => {
  expect(isObjectWithProps("asd", "length")).toBe(false);
});

it("rejects null", () => {
  expect(isObjectWithProps(null, [])).toBe(false);
});

it("accepts arrays", () => {
  expect(
    isObjectWithProps([1, 2, 3], [0, 1, 2, Symbol.iterator, "length"]),
  ).toBe(true);
});

it("accepts classes", () => {
  expect(isObjectWithProps(new TestClass(), "foo")).toBe(true);
});

it("accepts null prototypes", () => {
  expect(isObjectWithProps(Object.create(null), [])).toBe(true);
});

test("everything from ALL_TYPES_DATA_PROVIDER", () => {
  expect(ALL_TYPES_DATA_PROVIDER.filter((x) => isObjectWithProps(x, "size")))
    .toMatchInlineSnapshot(`
      [
        Map {},
        Set {},
      ]
    `);
});
