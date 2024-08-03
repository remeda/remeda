import { randomInt } from "./randomInt";

test("Infinity", () => {
  expect(() => randomInt(-Infinity, Infinity)).toThrow(
    new TypeError("from(-Infinity) is not a finite number"),
  );

  expect(() => randomInt(10, Infinity)).toThrow(
    new TypeError("to(Infinity) is not a finite number"),
  );
});

test("NaN", () => {
  expect(() => randomInt(Number.NaN, 10)).toThrow(
    new TypeError("from(NaN) is not a finite number"),
  );

  expect(() => randomInt(10, Number.NaN)).toThrow(
    new TypeError("to(NaN) is not a finite number"),
  );
});

test("Invalid range", () => {
  expect(() => randomInt(10, 0)).toThrow(
    new RangeError("to(0) should be greater than from(10)"),
  );

  expect(() => randomInt(10, 10)).toThrow(
    new RangeError("to(10) should be greater than from(10)"),
  );

  expect(() => randomInt(1.5, 1.6)).toThrow(
    new RangeError("there are no integers between from(1.5) and to(1.6)"),
  );

  expect(() => randomInt(10n, 0n)).toThrow(
    new RangeError("to(0) should be greater than from(10)"),
  );

  expect(() => randomInt(10n, 10n)).toThrow(
    new RangeError("to(10) should be greater than from(10)"),
  );
});

test("BigInt", () => {
  expect(randomInt(0n, 10n)).toBeGreaterThanOrEqual(0n);
  expect(randomInt(0n, 10n)).toBeLessThanOrEqual(10n);
});

test("Integer", () => {
  expect(randomInt(0, 10)).toBeGreaterThanOrEqual(0);
  expect(randomInt(0, 10)).toBeLessThanOrEqual(10);
});

test("Negative integers", () => {
  expect(randomInt(-10, 10)).toBeGreaterThanOrEqual(-10);
  expect(randomInt(-10, 10)).toBeLessThanOrEqual(10);
});
