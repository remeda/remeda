import { hasAtLeast } from "./hasAtLeast";

describe("dataFirst", () => {
  it("works on empty arrays", () => {
    expect(hasAtLeast([], 0)).toBe(true);
    expect(hasAtLeast([], 10)).toBe(false);
  });

  it("works on single item arrays", () => {
    expect(hasAtLeast([1], 0)).toBe(true);
    expect(hasAtLeast([1], 1)).toBe(true);
    expect(hasAtLeast([1], 2)).toBe(false);
  });

  it("works on large arrays", () => {
    const array = Array.from({ length: 1000 }, (_, i) => i);

    expect(hasAtLeast(array, 0)).toBe(true);
    expect(hasAtLeast(array, 1)).toBe(true);
    expect(hasAtLeast(array, 1000)).toBe(true);
    expect(hasAtLeast(array, 1001)).toBe(false);
  });

  it("works on sparse arrays", () => {
    const array = Array.from({ length: 1000 });

    expect(hasAtLeast(array, 0)).toBe(true);
    expect(hasAtLeast(array, 1)).toBe(true);
    expect(hasAtLeast(array, 1000)).toBe(true);
    expect(hasAtLeast(array, 1001)).toBe(false);
  });
});

describe("dataLast", () => {
  it("works on empty arrays", () => {
    expect(hasAtLeast(0)([])).toBe(true);
    expect(hasAtLeast(10)([])).toBe(false);
  });

  it("works on single item arrays", () => {
    expect(hasAtLeast(0)([1])).toBe(true);
    expect(hasAtLeast(1)([1])).toBe(true);
    expect(hasAtLeast(2)([1])).toBe(false);
  });

  it("works on large arrays", () => {
    const array = Array.from({ length: 1000 }, (_, i) => i);

    expect(hasAtLeast(0)(array)).toBe(true);
    expect(hasAtLeast(1)(array)).toBe(true);
    expect(hasAtLeast(1000)(array)).toBe(true);
    expect(hasAtLeast(1001)(array)).toBe(false);
  });

  it("works on sparse arrays", () => {
    const array = Array.from({ length: 1000 });

    expect(hasAtLeast(0)(array)).toBe(true);
    expect(hasAtLeast(1)(array)).toBe(true);
    expect(hasAtLeast(1000)(array)).toBe(true);
    expect(hasAtLeast(1001)(array)).toBe(false);
  });
});
