import { pipe } from "./pipe";
import { splice } from "./splice";

describe("typical cases", (): void => {
  test("removing a element", (): void => {
    expect(splice([1, 2, 3], 0, 1, [])).toStrictEqual([2, 3]);
  });

  test("inserting a element", (): void => {
    expect(splice([1, 2, 3], 0, 0, [4])).toStrictEqual([4, 1, 2, 3]);
  });

  test("removing elements and inserting elements", (): void => {
    expect(splice([1, 2, 3], 0, 2, [4, 5])).toStrictEqual([4, 5, 3]);
  });
});

test("immutability", () => {
  const data = [1, 2, 3];
  const result = splice(data, 0, 0, []);

  expect(result).toStrictEqual(data);
  expect(result).not.toBe(data);
});

describe("regression test including edge cases", () => {
  // prettier-ignore
  const testCases = [
      // items: multiple elements
      //              start: < 0
      //                         deleteCount: < 0
      { items: [1,2], start: -1, deleteCount: -1, replacement: [ ], expected: [1,2] },
      { items: [1,2], start: -1, deleteCount: -1, replacement: [3], expected: [1,3,2] },
      //                         deleteCount: = 0
      { items: [1,2], start: -1, deleteCount:  0, replacement: [ ], expected: [1,2] },
      { items: [1,2], start: -1, deleteCount:  0, replacement: [3], expected: [1,3,2] },
      //                         deleteCount: = 1
      { items: [1,2], start: -1, deleteCount:  1, replacement: [ ], expected: [1] },
      { items: [1,2], start: -1, deleteCount:  1, replacement: [3], expected: [1,3] },
      //                         deleteCount: = items.length
      { items: [1,2], start: -1, deleteCount:  2, replacement: [ ], expected: [1] },
      { items: [1,2], start: -1, deleteCount:  2, replacement: [3], expected: [1,3] },
      //              start: = 0
      { items: [1,2], start:  0, deleteCount: -1, replacement: [ ], expected: [1,2] },
      { items: [1,2], start:  0, deleteCount: -1, replacement: [3], expected: [3,1,2] },
      { items: [1,2], start:  0, deleteCount:  0, replacement: [ ], expected: [1,2] },
      { items: [1,2], start:  0, deleteCount:  0, replacement: [3], expected: [3,1,2] },
      { items: [1,2], start:  0, deleteCount:  1, replacement: [ ], expected: [2] },
      { items: [1,2], start:  0, deleteCount:  1, replacement: [3], expected: [3,2] },
      { items: [1,2], start:  0, deleteCount:  2, replacement: [ ], expected: [] },
      { items: [1,2], start:  0, deleteCount:  2, replacement: [3], expected: [3] },
      //              start: = 1
      { items: [1,2], start:  1, deleteCount: -1, replacement: [ ], expected: [1,2] },
      { items: [1,2], start:  1, deleteCount: -1, replacement: [3], expected: [1,3,2] },
      { items: [1,2], start:  1, deleteCount:  0, replacement: [ ], expected: [1,2] },
      { items: [1,2], start:  1, deleteCount:  0, replacement: [3], expected: [1,3,2] },
      { items: [1,2], start:  1, deleteCount:  1, replacement: [ ], expected: [1] },
      { items: [1,2], start:  1, deleteCount:  1, replacement: [3], expected: [1,3] },
      { items: [1,2], start:  1, deleteCount:  2, replacement: [ ], expected: [1] },
      { items: [1,2], start:  1, deleteCount:  2, replacement: [3], expected: [1,3] },
      //              start: = items.length
      { items: [1,2], start:  2, deleteCount: -1, replacement: [ ], expected: [1,2] },
      { items: [1,2], start:  2, deleteCount: -1, replacement: [3], expected: [1,2,3] },
      { items: [1,2], start:  2, deleteCount:  0, replacement: [ ], expected: [1,2] },
      { items: [1,2], start:  2, deleteCount:  0, replacement: [3], expected: [1,2,3] },
      { items: [1,2], start:  2, deleteCount:  1, replacement: [ ], expected: [1,2] },
      { items: [1,2], start:  2, deleteCount:  1, replacement: [3], expected: [1,2,3] },
      { items: [1,2], start:  2, deleteCount:  2, replacement: [ ], expected: [1,2] },
      { items: [1,2], start:  2, deleteCount:  2, replacement: [3], expected: [1,2,3] },
      //              start: > items.length
      { items: [1,2], start:  3, deleteCount: -1, replacement: [ ], expected: [1,2] },
      { items: [1,2], start:  3, deleteCount: -1, replacement: [3], expected: [1,2,3] },
      { items: [1,2], start:  3, deleteCount:  0, replacement: [ ], expected: [1,2] },
      { items: [1,2], start:  3, deleteCount:  0, replacement: [3], expected: [1,2,3] },
      { items: [1,2], start:  3, deleteCount:  1, replacement: [ ], expected: [1,2] },
      { items: [1,2], start:  3, deleteCount:  1, replacement: [3], expected: [1,2,3] },
      { items: [1,2], start:  3, deleteCount:  2, replacement: [ ], expected: [1,2] },
      { items: [1,2], start:  3, deleteCount:  2, replacement: [3], expected: [1,2,3] },

      // items: empty
      //              start: < 0
      { items: [   ], start: -1, deleteCount: -1, replacement: [ ], expected: [] },
      { items: [   ], start: -1, deleteCount: -1, replacement: [3], expected: [3] },
      { items: [   ], start: -1, deleteCount:  0, replacement: [ ], expected: [] },
      { items: [   ], start: -1, deleteCount:  0, replacement: [3], expected: [3] },
      { items: [   ], start: -1, deleteCount:  1, replacement: [ ], expected: [] },
      { items: [   ], start: -1, deleteCount:  1, replacement: [3], expected: [3] },
      //              start: = items.length = 0
      { items: [   ], start:  0, deleteCount: -1, replacement: [ ], expected: [] },
      { items: [   ], start:  0, deleteCount: -1, replacement: [3], expected: [3] },
      { items: [   ], start:  0, deleteCount:  0, replacement: [ ], expected: [] },
      { items: [   ], start:  0, deleteCount:  0, replacement: [3], expected: [3] },
      { items: [   ], start:  0, deleteCount:  1, replacement: [ ], expected: [] },
      { items: [   ], start:  0, deleteCount:  1, replacement: [3], expected: [3] },
      //              start: > items.length = 0
      { items: [   ], start:  1, deleteCount: -1, replacement: [ ], expected: [] },
      { items: [   ], start:  1, deleteCount: -1, replacement: [3], expected: [3] },
      { items: [   ], start:  1, deleteCount:  0, replacement: [ ], expected: [] },
      { items: [   ], start:  1, deleteCount:  0, replacement: [3], expected: [3] },
      { items: [   ], start:  1, deleteCount:  1, replacement: [ ], expected: [] },
      { items: [   ], start:  1, deleteCount:  1, replacement: [3], expected: [3] },
    ] as const;

  test.each(testCases)(
    "splice($items, $start, $deleteCount, $replacement) -> $expected",
    ({ items, start, deleteCount, replacement, expected }) => {
      expect(splice(items, start, deleteCount, replacement)).toStrictEqual(
        expected,
      );
    },
  );
});

test("a purried data-last implementation", () => {
  expect(pipe([1, 2, 3, 4, 5, 6, 7, 8], splice(2, 3, [9, 10]))).toStrictEqual([
    1, 2, 9, 10, 6, 7, 8,
  ]);
});
