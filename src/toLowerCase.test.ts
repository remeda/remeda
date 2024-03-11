/* eslint-disable no-useless-escape */
import { toLowerCase } from "./toLowerCase";

test("keep lowercase as-is", () => {
  expect(toLowerCase("lowercase")).toEqual("lowercase");
});

test("lowercase uppercase", () => {
  expect(toLowerCase("HELLO")).toEqual("hello");
});

test("lowercase capitalized", () => {
  expect(toLowerCase("Hello")).toEqual("hello");
});

test("keep empty string as-is", () => {
  expect(toLowerCase("")).toEqual("");
});

test("keep special characters as-is", () => {
  expect(
    toLowerCase(`
😎
/|\__👍
/'\ `),
  ).toEqual(`
😎
/|\__👍
/'\ `);
});
