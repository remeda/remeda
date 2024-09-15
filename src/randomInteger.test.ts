import { randomInteger } from "./randomInteger";

const ITERATIONS = 1000;

test("from is greater than to", () => {
  expect(() => randomInteger(10, 0)).toThrow(
    new RangeError("randomInteger: The range [10,0] contains no integer"),
  );
});

test("from and to are decimals with same whole number", () => {
  expect(() => expect(randomInteger(1.5, 1.6))).toThrow(
    new RangeError("randomInteger: The range [1.5,1.6] contains no integer"),
  );
});

test("non-negative integers", () => {
  for (const v of randomIntegers(0, 10)) {
    expect(v).toBeGreaterThanOrEqual(0);
    expect(v).toBeLessThanOrEqual(10);
  }
});

test("negative integers", () => {
  for (const v of randomIntegers(-10, -5)) {
    expect(v).toBeGreaterThanOrEqual(-10);
    expect(v).toBeLessThanOrEqual(-5);
  }
});

test("positive decimals", () => {
  for (const v of randomIntegers(0.1, 10.9)) {
    expect(v).toBeGreaterThanOrEqual(0.1);
    expect(v).toBeLessThanOrEqual(10.9);
  }
});

test("negative decimals", () => {
  for (const v of randomIntegers(-10.9, -0.1)) {
    expect(v).toBeGreaterThanOrEqual(-10.9);
    expect(v).toBeLessThanOrEqual(-0.1);
  }
});

test("integers with same value", () => {
  for (const v of randomIntegers(10, 10)) {
    expect(v).toBe(10);
  }
});

function* randomIntegers(from: number, to: number): Generator<number> {
  for (let i = 0; i < ITERATIONS; i += 1) {
    yield randomInteger(from, to);
  }
}
