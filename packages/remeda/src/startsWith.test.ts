import { expect, test } from "vitest";
import { pipe } from "./pipe";
import { startsWith } from "./startsWith";

test("empty data", () => {
  expect(startsWith("", "")).toBe(true);
  expect(startsWith("", "hellO")).toBe(false);
});

test("starts with", () => {
  expect(startsWith("hello world", "hello")).toBe(true);
  expect(startsWith("hello world", "hello ")).toBe(true);
  expect(startsWith("hello world", "hello world")).toBe(true);
});

test("doesn't start with", () => {
  expect(startsWith("hello world", "hello world ")).toBe(false);
  expect(startsWith("hello world", "world")).toBe(false);
  expect(startsWith("hello world", "world ")).toBe(false);
});

test("matches case", () => {
  expect(startsWith("hello world", "hello")).toBe(true);
  expect(startsWith("hello world", "Hello")).toBe(false);
});

test("data-last", () => {
  expect(pipe("hello world", startsWith("hello"))).toBe(true);
});
