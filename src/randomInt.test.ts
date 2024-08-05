import { randomInt } from "./randomInt";

test("Invalid range", () => {
  expect(() => randomInt(10, 0)).toThrow(
    new RangeError("randomInt: to(0) should be greater than from(10)"),
  );
});

test("Integers", () => {
  expect(randomInt(0, 10)).toBeGreaterThanOrEqual(0);
  expect(randomInt(0, 10)).toBeLessThanOrEqual(10);

  expect(randomInt(-10, 10)).toBeGreaterThanOrEqual(-10);
  expect(randomInt(-10, 10)).toBeLessThanOrEqual(10);
});

test("Floats", () => {
  expect(randomInt(0.1, 10.9)).toBeGreaterThanOrEqual(0);
  expect(randomInt(0.1, 10.9)).toBeLessThanOrEqual(10);
  expect(randomInt(1.5, 1.6)).toBe(1);
});

test("Same Value", () => {
  expect(randomInt(10, 10)).toBe(10);
  expect(randomInt(10.1, 10.1)).toBe(10);
});
