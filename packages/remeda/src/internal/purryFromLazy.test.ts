import { describe, expect, test } from "vitest";
import { lastLazyValue } from "./lazyControl";
import { purryFromLazy } from "./purryFromLazy";
import { toSingle } from "./toSingle";

describe("an implementation wrapped with `toSingle`", () => {
  test("dataFirst", () => {
    expect(firstPurried([1, 2, 3])).toBe(1);
  });

  test("dataLast", () => {
    expect(firstPurried()([1, 2, 3])).toBe(1);
  });

  test("nothing to emit", () => {
    expect(firstPurried([])).toBeUndefined();
  });
});

// Overloaded by hand the way the real utilities are, so that the data-last
// result is callable here.
// @ts-expect-error [ts2322] -- Our purry functions don't infer the correct return type, the overloads on this declaration are what force it.
const firstPurried: {
  (data: readonly number[]): number | undefined;
  (): (data: readonly number[]) => number | undefined;
} = (...args: readonly unknown[]) => purryFromLazy(firstLazyImpl, args);

const firstLazyImpl = toSingle(() => lastLazyValue);
