import { pipe } from "./pipe";
import { endsWith } from "./endsWith";

test("empty data", () => {
  expect(endsWith("", "")).toBe(true);
  expect(endsWith("", "hellO")).toBe(false);
});

test("ends with", () => {
  expect(endsWith("hello world", "world")).toBe(true);
  expect(endsWith("hello world", " world")).toBe(true);
  expect(endsWith("hello world", "hello world")).toBe(true);
});

test("doesn't ends with", () => {
  expect(endsWith("hello world", "hello")).toBe(false);
  expect(endsWith("hello world", "hello ")).toBe(false);
  expect(endsWith("hello world", "hello world ")).toBe(false);
});

test("matches case", () => {
  expect(endsWith("hello world", "world")).toBe(true);
  expect(endsWith("hello world", "World")).toBe(false);
});

test("data-last", () => {
  expect(pipe("hello world", endsWith("world"))).toBe(true);
});
