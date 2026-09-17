/* eslint-disable @typescript-eslint/explicit-function-return-type --
 * purry is all about functions, so we need to turn these off to make it easy
 * to write the tests.
 */

import { describe, expect, test } from "vitest";
import { purryFromLazy } from "./purryFromLazy";
import { toSingle } from "./toSingle";
import type { LazyEvaluator } from "./types/LazyEvaluator";
import { doneWith } from "./utilityEvaluators";

test("throws on wrong number of arguments", () => {
  expect(() =>
    zeroArgsPurried(
      // The first argument to the lazy purried function will always be an
      // array.
      ["hello"],
      // But from the second param and onward the params belong to the lazy
      // impl. Because our lazy impl takes 0 args, this extra param should
      // throw.
      "world",
    ),
  ).toThrow("Wrong number of arguments");
});

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

const firstLazyImpl = toSingle(() => doneWith);

const zeroArgsPurried = (...args: readonly unknown[]) =>
  purryFromLazy(zeroArgsLazyImpl, args);

/* v8 ignore next 4 -- We only need the function pointer, we never call it! */
const zeroArgsLazyImpl = () => evaluator;
const evaluator: LazyEvaluator = () => {
  throw new Error("unreachable");
};
