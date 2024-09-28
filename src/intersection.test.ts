import { identity } from "./identity";
import { intersection } from "./intersection";
import { map } from "./map";
import { pipe } from "./pipe";

it("returns empty array trivially", () => {
  expect(intersection([], [])).toStrictEqual([]);
});

it("returns empty array on empty input", () => {
  expect(intersection([], [1, 2, 3])).toStrictEqual([]);
  expect(intersection([1, 2, 3], [])).toStrictEqual([]);
});

it("returns empty array on disjoint arrays", () => {
  expect(intersection([1], [2])).toStrictEqual([]);
});

it("works trivially on a single item", () => {
  expect(intersection([1], [1])).toStrictEqual([1]);
});

it("maintains multi-set semantics (returns only one copy)", () => {
  expect(intersection([1, 1], [1])).toStrictEqual([1]);
  expect(intersection([1], [1, 1])).toStrictEqual([1]);
});

it("maintains multi-set semantics (returns as many copies as available)", () => {
  expect(intersection([1, 1, 1, 1, 1], [1, 1])).toStrictEqual([1, 1]);
  expect(intersection([1, 1], [1, 1, 1, 1, 1])).toStrictEqual([1, 1]);
});

it("preserves the original order in source array", () => {
  expect(intersection([3, 2, 1], [1, 2, 3])).toStrictEqual([3, 2, 1]);
});

it("maintains order for multiple copies", () => {
  expect(intersection([3, 2, 2, 2, 2, 2, 1], [1, 2, 3])).toStrictEqual([
    3, 2, 1,
  ]);
});

it("returns a shallow copy even when all items match", () => {
  const data = [1, 2, 3];
  const result = intersection(data, [1, 2, 3]);

  expect(result).toStrictEqual(data);
  expect(result).not.toBe(data);
});

describe("piping", () => {
  test("lazy", () => {
    const mock = vi.fn(identity());
    const result = pipe([1, 2, 3, 4, 5, 6], map(mock), intersection([4, 2]));

    expect(mock).toHaveBeenCalledTimes(4);
    expect(result).toStrictEqual([2, 4]);
  });
});
