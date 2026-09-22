import { expect, test } from "vitest";
import { pipe } from "./pipe";
import { startsWith } from "./startsWith";

test("empty data", () => {
  expect(startsWith("", "")).toBe(true);
  expect(startsWith("" as string, "hellO")).toBe(false);
});

test("starts with", () => {
  expect(startsWith("hello world", "hello")).toBe(true);
  expect(startsWith("hello world", "hello ")).toBe(true);
  expect(startsWith("hello world", "hello world")).toBe(true);
});

test("doesn't start with", () => {
  expect(startsWith("hello world" as string, "hello world ")).toBe(false);
  expect(startsWith("hello world" as string, "world")).toBe(false);
  expect(startsWith("hello world" as string, "world ")).toBe(false);
});

test("matches case", () => {
  expect(startsWith("hello world", "hello")).toBe(true);
  expect(startsWith("hello world" as string, "Hello")).toBe(false);
});

test("data-last", () => {
  expect(pipe("hello world", startsWith("hello"))).toBe(true);
});

test("data-last, no match", () => {
  expect(pipe("hello world" as string, startsWith("world"))).toBe(false);
});
