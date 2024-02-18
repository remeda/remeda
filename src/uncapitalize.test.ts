import { uncapitalize } from "./uncapitalize";

test("keep uncapitalized as-is", () => {
  expect(uncapitalize("not capitalized LOL")).toEqual("not capitalized LOL");
});

test("keep lowercaze as-is", () => {
  expect(uncapitalize("hello")).toEqual("hello");
});

test("uncapitalize uppercase", () => {
  expect(uncapitalize("HELLO")).toEqual("hELLO");
});

test("keep empty string as-is", () => {
  expect(uncapitalize("")).toEqual("");
});

test("keep special characters as-is", () => {
  expect(uncapitalize(`☞😋☜`)).toEqual(`☞😋☜`);
});
