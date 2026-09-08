import { expect, test } from "vitest";
import { endsWith } from "./endsWith";
import { pipe } from "./pipe";

test("empty data", () => {
  expect(endsWith("", "")).toBe(true);
  expect(endsWith("" as string, "hellO")).toBe(false);
});

test("ends with", () => {
  expect(endsWith("hello world", "world")).toBe(true);
  expect(endsWith("hello world", " world")).toBe(true);
  expect(endsWith("hello world", "hello world")).toBe(true);
});

test("doesn't ends with", () => {
  expect(endsWith("hello world" as string, "hello")).toBe(false);
  expect(endsWith("hello world" as string, "hello ")).toBe(false);
  expect(endsWith("hello world" as string, "hello world ")).toBe(false);
});

test("matches case", () => {
  expect(endsWith("hello world", "world")).toBe(true);
  expect(endsWith("hello world" as string, "World")).toBe(false);
});

test("data-last", () => {
  expect(pipe("hello world", endsWith("world"))).toBe(true);
});
