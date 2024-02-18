import { capitalize } from "./capitalize";

test("keep capitalized as-is", () => {
  expect(capitalize("Capitalized")).toEqual("Capitalized");
});

test("keep uppercase as-is", () => {
  expect(capitalize("HELLO")).toEqual("HELLO");
});

test("capitalize lowercase", () => {
  expect(capitalize("hello")).toEqual("Hello");
});

test("keep empty string as-is", () => {
  expect(capitalize("")).toEqual("");
});

test("keep special characters as-is", () => {
  expect(capitalize(`😩`)).toEqual(`😩`);
});
