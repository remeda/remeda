import { dropLastWhile } from "./dropLastWhile";
import { pipe } from "./pipe";

describe("data first", () => {
  it("should return items until the last predicate failure", () => {
    expect(dropLastWhile([1, 2, 3, 4], (n) => n !== 2)).toStrictEqual([1, 2]);
  });

  it("should return an empty array when all items pass the predicate", () => {
    expect(dropLastWhile([1, 2, 3, 4], (n) => n > 0)).toStrictEqual([]);
  });

  it("should return an empty array when an empty array is passed", () => {
    expect(dropLastWhile([], (n) => n > 0)).toStrictEqual([]);
  });

  it("should return first item when first item fails the predicate", () => {
    expect(dropLastWhile([1, 2, 3, 4], (n) => n !== 1)).toStrictEqual([1]);
  });

  it("should return a copy of the array when the last item fails the predicate", () => {
    const data = [1, 2, 3, 4];
    const result = dropLastWhile(data, (n) => n !== 4);

    expect(result).toStrictEqual(data);
    expect(result).not.toBe(data);
  });
});

describe("data last", () => {
  it("should return items until the last predicate failure", () => {
    expect(
      pipe(
        [1, 2, 3, 4],
        dropLastWhile((n) => n !== 2),
      ),
    ).toStrictEqual([1, 2]);
  });

  it("should return an empty array when all items pass the predicate", () => {
    expect(
      pipe(
        [1, 2, 3, 4],
        dropLastWhile((n) => n > 0),
      ),
    ).toStrictEqual([]);
  });

  it("should return an empty array when an empty array is passed", () => {
    expect(
      pipe(
        [],
        dropLastWhile((n) => n > 0),
      ),
    ).toStrictEqual([]);
  });

  it("should return first item when first item fails the predicate", () => {
    expect(
      pipe(
        [1, 2, 3, 4],
        dropLastWhile((n) => n !== 1),
      ),
    ).toStrictEqual([1]);
  });

  it("should return a copy of the array when the last item fails the predicate", () => {
    const data = [1, 2, 3, 4];
    const result = pipe(
      data,
      dropLastWhile((n) => n !== 4),
    );

    expect(result).toStrictEqual(data);
    expect(result).not.toBe(data);
  });
});
