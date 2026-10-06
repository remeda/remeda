import { test } from "vitest";
import { purry } from "./purry";

test("doesn't accept a lazy implementation", () => {
  // @ts-expect-error [ts2554] -- Lazy evaluation is private to Remeda's own utilities; functions built with `purry` run eagerly inside `pipe`.
  purry(subtract, [1], lazyImplementation);
});

function subtract(minuend: number, subtrahend: number): number {
  return minuend - subtrahend;
}

const identity = (value: unknown): unknown => value;

const lazyImplementation = (): typeof identity => identity;
