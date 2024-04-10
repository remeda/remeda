import { _reduceLazy } from "./_reduceLazy";

// _reduceLazy is tested via the functions that call it, but those tests lack
// several edge cases which need to be tested on their own.
describe("generic tests", () => {
  it("handles hasMany", () => {
    expect(
      _reduceLazy([1, 2, 3], (value) => ({
        hasNext: true,
        hasMany: true,
        next: [value, value, value],
        done: false,
      })),
    ).toStrictEqual([1, 1, 1, 2, 2, 2, 3, 3, 3]);
  });
});
