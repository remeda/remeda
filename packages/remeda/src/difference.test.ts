import { difference } from "./difference";
import { identity } from "./identity";
import { map } from "./map";
import { pipe } from "./pipe";
import { take } from "./take";

it("returns empty array on empty input", () => {
  expect(difference([], [1, 2, 3])).toStrictEqual([]);
});

it("removes nothing on empty other array", () => {
  expect(difference([1, 2, 3], [])).toStrictEqual([1, 2, 3]);
});

it("returns a shallow clone when nothing is removed", () => {
  const data = [1, 2, 3];
  const result = difference(data, [4, 5, 6]);

  expect(result).toStrictEqual(data);
  expect(result).not.toBe(data);
});

it("removes an item that is in the input", () => {
  expect(difference([1], [1])).toStrictEqual([]);
});

it("doesn't remove items that are not in the other array", () => {
  expect(difference([1], [2])).toStrictEqual([1]);
});

it("maintains multi-set semantics (removes only one copy)", () => {
  expect(difference([1, 1, 2, 2], [1])).toStrictEqual([1, 2, 2]);
});

it("works if the other array has more copies than the input", () => {
  expect(difference([1], [1, 1])).toStrictEqual([]);
});

it("preserves the original order in source array", () => {
  expect(difference([3, 1, 2, 2, 4], [2])).toStrictEqual([3, 1, 2, 4]);
});

it("accounts and removes multiple copies", () => {
  expect(difference([1, 2, 3, 1, 2, 3, 1, 2, 3], [1, 2, 1, 2])).toStrictEqual([
    3, 3, 1, 2, 3,
  ]);
});

it("works with strings", () => {
  expect(difference(["a", "b", "c"], ["b"])).toStrictEqual(["a", "c"]);
});

it("works with objects", () => {
  const item = { a: 2 };

  expect(difference([item, { b: 3 }, item], [item, item])).toStrictEqual([
    { b: 3 },
  ]);
});

it("compares objects by reference", () => {
  expect(difference([{ a: 2 }, { b: 3 }], [{ a: 2 }])).toStrictEqual([
    { a: 2 },
    { b: 3 },
  ]);
});

test("lazy", () => {
  const mock = vi.fn<(x: number) => number>(identity());
  const result = pipe(
    [1, 2, 3, 4, 5, 6],
    map(mock),
    difference([2, 3]),
    take(2),
  );

  expect(mock).toHaveBeenCalledTimes(4);
  expect(result).toStrictEqual([1, 4]);
});
