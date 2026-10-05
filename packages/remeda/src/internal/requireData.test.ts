import { inspect } from "node:util";
import { describe, expect, test } from "vitest";
import { UNEXPECTED_ACCESS_SENTINEL } from "./requireData";

describe("unexpected access sentinel", () => {
  // Typed the way the callbacks that receive it see it.
  const data: readonly number[] = UNEXPECTED_ACCESS_SENTINEL;

  test.each([
    ["index access", () => data[0]],
    ["length", () => data.length],
    ["method call", () => data.at(0)],
    ["iteration", () => [...data]],
    ["string coercion", () => String(data)],
    ["serialization", () => JSON.stringify(data)],
    ["`in`", () => 0 in data],
    ["key enumeration", () => Object.keys(data)],
    [
      "prototype lookup",
      () => {
        Object.getPrototypeOf(data);
      },
    ],
    ["assignment", () => Reflect.set(data, 0, 1)],
  ])("throws on %s", (_name, operation) => {
    expect(operation).toThrow(/^Remeda: /u);
  });

  test("is not an array", () => {
    expect(Array.isArray(data)).toBe(false);
  });

  test("explains itself when logged", () => {
    expect(inspect(data)).toContain("Remeda: ");
  });
});
