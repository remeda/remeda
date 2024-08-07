import { randomInt } from "./randomInt";

test("from is greater than to", () => {
  expect(() => randomInt(10, 0)).toThrow(
    new RangeError("randomInt: The range [10,0] contains no integer"),
  );
});

test("from and to are decimals with same whole number", () => {
  expect(() => expect(randomInt(1.5, 1.6))).toThrow(
    new RangeError("randomInt: The range [1.5,1.6] contains no integer"),
  );
});

test("non-negative integers", () => {
  const randoms = createRandomsArray(0, 10);

  for (const v of randoms) {
    expect(v).toBeGreaterThanOrEqual(0);
    expect(v).toBeLessThanOrEqual(10);
  }
});

test("negative integers", () => {
  const randoms = createRandomsArray(-10, -5);

  for (const v of randoms) {
    expect(v).toBeGreaterThanOrEqual(-10);
    expect(v).toBeLessThanOrEqual(-5);
  }
});

test("positive decimals", () => {
  const randoms = createRandomsArray(0.1, 10.9);

  for (const v of randoms) {
    expect(v).toBeGreaterThanOrEqual(0.1);
    expect(v).toBeLessThanOrEqual(10.9);
  }
});

test("negative decimals", () => {
  const randoms = createRandomsArray(-10.9, -0.1);

  for (const v of randoms) {
    expect(v).toBeGreaterThanOrEqual(-10.9);
    expect(v).toBeLessThanOrEqual(-0.1);
  }
});

test("integers with same value", () => {
  const randoms = createRandomsArray(10, 10);

  for (const v of randoms) {
    expect(v).toBe(10);
  }
});

test("max int", () => {
  const randoms = createRandomsArray(0, Number.MAX_SAFE_INTEGER);

  for (const v of randoms) {
    expect(v).toBeGreaterThanOrEqual(0);
    expect(v).toBeLessThanOrEqual(Number.MAX_SAFE_INTEGER);
  }
});

function createRandomsArray(from: number, to: number): Array<number> {
  return Array.from({ length: 10 }).map(() => randomInt(from, to));
}
