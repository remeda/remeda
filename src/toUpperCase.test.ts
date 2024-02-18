import { toUpperCase } from "./toUpperCase";

test("keep uppercase as-is", () => {
  expect(toUpperCase("UPPERCASE")).toEqual("UPPERCASE");
});

test("uppercase lowercase", () => {
  expect(toUpperCase("hello")).toEqual("HELLO");
});

test("uppercase capitalized", () => {
  expect(toUpperCase("Hello")).toEqual("HELLO");
});

test("keep empty string as-is", () => {
  expect(toUpperCase("")).toEqual("");
});

test("keep special characters as-is", () => {
  // eslint-disable-next-line no-useless-escape
  expect(toUpperCase(`¯\_(ツ)_/¯`)).toEqual(`¯\_(ツ)_/¯`);
});
