//! IMPORTANT: It's impossible to verify that a function does nothing without checking it's implementation, so there aren't any obvious way to expect some result. This clashes with the expectations of the vitest eslint plugin rule vitest/valid-expect. To work around this we wrapped all our calls and expect them not to throw. It doesn't mean we think this function would throw in **any** case!

import { expect, test } from "vitest";
import { doNothing } from "./doNothing";

test("does nothing when called with no arguments", () => {
  const doesNothing = doNothing();

  expect(() => {
    doesNothing();
  }).not.toThrow();
});

test("ignores any parameters sent to the function", () => {
  const doesNothing = doNothing();

  expect(() => {
    doesNothing(1);
  }).not.toThrow();

  expect(() => {
    doesNothing(1, 2);
  }).not.toThrow();

  expect(() => {
    doesNothing(1, 2, "a");
  }).not.toThrow();

  expect(() => {
    doesNothing(undefined);
  }).not.toThrow();

  expect(() => {
    doesNothing(["a"]);
  }).not.toThrow();
});
