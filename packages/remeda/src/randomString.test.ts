import { expect, test } from "vitest";
import { pipe } from "./pipe";
import { randomString } from "./randomString";

test("randomString", () => {
  expect(randomString(10)).toHaveLength(10);
});

test("data-last", () => {
  expect(pipe(8, randomString())).toHaveLength(8);
});
