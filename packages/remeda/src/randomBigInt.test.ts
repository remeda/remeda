/* eslint-disable vitest/no-hooks --
 * This utility relies on the execution environment (node). These APIs need to
 * be mocked for our tests, which is done via hooks.
 */

import { afterAll, beforeAll, describe, expect, test, vi } from "vitest";
import { randomBigInt } from "./randomBigInt";

const ITERATIONS = 10_000;

const HUGE_NUMBER = 9_999_999_999_999_999_999_999n;

test("from is greater than to", () => {
  expect(() => randomBigInt(10n, 0n)).toThrow(
    new RangeError("randomBigInt: The range [10,0] is empty."),
  );
});

test("non-negative bigints", () => {
  for (const v of randomBigInts(0n, 10n)) {
    expect(v).toBeGreaterThanOrEqual(0n);
    expect(v).toBeLessThanOrEqual(10n);
  }
});

test("negative bigints", () => {
  const values = randomBigInts(-10n, -5n);
  for (const value of values) {
    expect(value).toBeGreaterThanOrEqual(-10n);
    expect(value).toBeLessThanOrEqual(-5n);
  }
});

test("bigints with same value", () => {
  for (const v of randomBigInts(10n, 10n)) {
    expect(v).toBe(10n);
  }
});

test("huge bigints", () => {
  for (const v of randomBigInts(
    // This is Number.MAX_SAFE_INTEGER + 1
    9_007_199_254_740_992n,
    HUGE_NUMBER,
  )) {
    expect(v).toBeGreaterThanOrEqual(9_007_199_254_740_992n);
    expect(v).toBeLessThanOrEqual(HUGE_NUMBER);
  }
});

test("tiny ranges with huge numbers", () => {
  const values = randomBigInts(HUGE_NUMBER, HUGE_NUMBER + 1n);
  for (const value of values) {
    expect(value).toBeGreaterThanOrEqual(HUGE_NUMBER);
    expect(value).toBeLessThanOrEqual(HUGE_NUMBER + 1n);
  }
});

test("results are varied", () => {
  expect(new Set<bigint>(randomBigInts(1n, 10n))).toHaveLength(10);
});

describe("crypto module polyfill", () => {
  beforeAll(() => {
    vi.stubGlobal("crypto", undefined);
  });

  afterAll(() => {
    vi.unstubAllGlobals();
  });

  test("non-negative bigints", () => {
    for (const v of randomBigInts(0n, 10n)) {
      expect(v).toBeGreaterThanOrEqual(0n);
      expect(v).toBeLessThanOrEqual(10n);
    }
  });

  test("negative bigints", () => {
    const values = randomBigInts(-10n, -5n);
    for (const value of values) {
      expect(value).toBeGreaterThanOrEqual(-10n);
      expect(value).toBeLessThanOrEqual(-5n);
    }
  });

  test("bigints with same value", () => {
    for (const v of randomBigInts(10n, 10n)) {
      expect(v).toBe(10n);
    }
  });

  test("huge bigints", () => {
    for (const v of randomBigInts(
      // This is Number.MAX_SAFE_INTEGER + 1
      9_007_199_254_740_992n,
      HUGE_NUMBER,
    )) {
      expect(v).toBeGreaterThanOrEqual(9_007_199_254_740_992n);
      expect(v).toBeLessThanOrEqual(HUGE_NUMBER);
    }
  });

  test("tiny ranges with huge numbers", () => {
    const values = randomBigInts(HUGE_NUMBER, HUGE_NUMBER + 1n);
    for (const value of values) {
      expect(value).toBeGreaterThanOrEqual(HUGE_NUMBER);
      expect(value).toBeLessThanOrEqual(HUGE_NUMBER + 1n);
    }
  });

  test("results are varied", () => {
    expect(new Set<bigint>(randomBigInts(1n, 10n))).toHaveLength(10);
  });
});

function* randomBigInts(from: bigint, to: bigint): Generator<bigint> {
  for (let i = 0; i < ITERATIONS; i += 1) {
    yield randomBigInt(from, to);
  }
}
