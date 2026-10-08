import { inspect } from "node:util";
import { describe, expect, test } from "vitest";
import { UNEXPECTED_ACCESS_SENTINEL } from "./unexpectedAccessSentinel";

describe("unexpected access sentinel", () => {
  // Typed the way the callbacks that receive it see it.
  const data: readonly number[] = UNEXPECTED_ACCESS_SENTINEL;

  test.each([
    ["index access", () => data[0]],
    ["length", () => data.length],
    ["`map`", () => data.map((value) => value)],
    ["`at`", () => data.at(0)],
    ["iteration", () => [...data]],
    ["string coercion", () => String(data)],
    ["serialization", () => JSON.stringify(data)],
    ["`in` with an index", () => 0 in data],
    ["`in` with an array method", () => "map" in data],
    ["key enumeration", () => Object.keys(data)],
    ["own index lookup", () => Object.hasOwn(data, 0)],
    ["assignment", () => Reflect.set(data, 0, 1)],
    [
      "property definition",
      () => Reflect.defineProperty(data, "key", { value: 1 }),
    ],
    ["deletion", () => Reflect.deleteProperty(data, "key")],
    ["preventing extensions", () => Reflect.preventExtensions(data)],
    [
      "prototype replacement",
      () => Reflect.setPrototypeOf(data, Array.prototype),
    ],
  ])("throws on %s", (_name, operation) => {
    expect(operation).toThrow(/^Remeda: /u);
  });

  // Curried functions (e.g. Ramda's) probe every argument they receive for a
  // placeholder marker, so one used as a callback probes `data` too.
  test("a placeholder probe reads nothing", () => {
    expect(Reflect.get(data, "@@functional/placeholder")).toBeUndefined();
  });

  test("a placeholder probe finds nothing", () => {
    expect("@@functional/placeholder" in data).toBe(false);
  });

  test("an own placeholder probe finds nothing", () => {
    expect(Object.hasOwn(data, "@@functional/placeholder")).toBe(false);
  });

  test("is an ordinary object", () => {
    expect(Object.getPrototypeOf(data)).toBe(Object.prototype);
  });

  test("is not an array", () => {
    expect(Array.isArray(data)).toBe(false);
  });

  test("explains itself when logged", () => {
    expect(inspect(data)).toContain("Remeda: ");
  });
});
