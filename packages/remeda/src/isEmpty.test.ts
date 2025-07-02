import { expect, test } from "vitest";
import { isEmpty } from "./isEmpty";

test("returns true for an empty array", () => {
  expect(isEmpty([])).toBe(true);
});

test("returns false for a non-empty array", () => {
  expect(isEmpty([1, 2, 3])).toBe(false);
});

test("returns true for an empty string", () => {
  expect(isEmpty("")).toBe(true);
});

test("returns false for a non-empty string", () => {
  expect(isEmpty("test")).toBe(false);
});

test("returns true for an empty object", () => {
  expect(isEmpty({})).toBe(true);
});

test("returns false for a non-empty object", () => {
  expect(isEmpty({ length: 0 })).toBe(false);
});

test("returns true for undefined", () => {
  expect(isEmpty(undefined)).toBe(true);
});
