import { inspect } from "node:util";
import { expect, test, describe } from "vitest";
import { isDeepEqual } from "../isDeepEqual";
import { UNEXPECTED_ACCESS_SENTINEL } from "./unexpectedAccessSentinel";

// Typed the way the callbacks that receive it see it.
const DATA: readonly number[] = UNEXPECTED_ACCESS_SENTINEL;

describe("throws", () => {
  test.each([
    ["index access", () => DATA[0]],
    ["length", () => DATA.length],
    ["`map`", () => DATA.map((value) => value)],
    ["`at`", () => DATA.at(0)],
    ["iteration", () => [...DATA]],
    ["string coercion", () => String(DATA)],
    ["serialization", () => JSON.stringify(DATA)],
    // eslint-disable-next-line unicorn/prefer-spread -- `concat` is the subject: unlike a spread, it only spreads arguments that are arrays.
    ["`concat` spreading it", () => [1].concat(DATA)],
    ["`flat` spreading it", () => [DATA].flat()],
    ["deep equality", () => isDeepEqual(DATA, [])],
    ["`in` with an index", () => 0 in DATA],
    ["`in` with an array method", () => "map" in DATA],
    ["key enumeration", () => Object.keys(DATA)],
    ["own index lookup", () => Object.hasOwn(DATA, 0)],
    ["assignment", () => Reflect.set(DATA, 0, 1)],
    [
      "property definition",
      () => Reflect.defineProperty(DATA, "key", { value: 1 }),
    ],
    ["deletion", () => Reflect.deleteProperty(DATA, "key")],
    ["preventing extensions", () => Reflect.preventExtensions(DATA)],
    [
      "prototype replacement",
      () => Reflect.setPrototypeOf(DATA, Array.prototype),
    ],
  ])("throws on %s", (_name, operation) => {
    expect(operation).toThrow(/^Remeda: /u);
  });
});

describe("allows through", () => {
  test("accessing a specific prop", () => {
    expect(Reflect.get(DATA, "key")).toBeUndefined();
  });

  test("checking a specific prop exists (in)", () => {
    expect("key" in DATA).toBe(false);
  });

  test("checking a specific prop exists (hasOwn)", () => {
    expect(Object.hasOwn(DATA, "key")).toBe(false);
  });
});

describe("looks like an array", () => {
  test("inherits from `Array.prototype`", () => {
    expect(Object.getPrototypeOf(DATA)).toBe(Array.prototype);
  });

  test("is an array", () => {
    expect(Array.isArray(DATA)).toBe(true);
  });

  test("is tagged as an array", () => {
    expect(Object.prototype.toString.call(DATA)).toBe("[object Array]");
  });
});

test("renders the error message when viewed by debuggers", () => {
  expect(inspect(DATA)).toContain("Remeda: ");
});
