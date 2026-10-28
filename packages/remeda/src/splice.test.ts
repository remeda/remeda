import { describe, expect, test } from "vitest";
import { filter } from "./filter";
import { pipe } from "./pipe";
import { splice } from "./splice";
import { take } from "./take";

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

describe("regression tests", () => {
  describe("start at array start", () => {
    describe("no deletions", () => {
      test("without replacement", () => {
        expect(splice([1, 2], 0, 0, [])).toStrictEqual([1, 2]);
      });

      test("with replacement", () => {
        expect(splice([1, 2], 0, 0, [3])).toStrictEqual([3, 1, 2]);
      });
    });

    describe("delete some", () => {
      test("without replacement", () => {
        expect(splice([1, 2], 0, 1, [])).toStrictEqual([2]);
      });

      test("with replacement", () => {
        expect(splice([1, 2], 0, 1, [3])).toStrictEqual([3, 2]);
      });
    });

    describe("delete all", () => {
      test("without replacement", () => {
        expect(splice([1, 2], 0, 2, [])).toStrictEqual([]);
      });

      test("with replacement", () => {
        expect(splice([1, 2], 0, 2, [3])).toStrictEqual([3]);
      });
    });
  });

  describe("start within the array", () => {
    describe("no deletions", () => {
      test("without replacement", () => {
        expect(splice([1, 2], 1, 0, [])).toStrictEqual([1, 2]);
      });

      test("with replacement", () => {
        expect(splice([1, 2], 1, 0, [3])).toStrictEqual([1, 3, 2]);
      });
    });

    describe("delete some", () => {
      test("without replacement", () => {
        expect(splice([1, 2], 1, 1, [])).toStrictEqual([1]);
      });

      test("with replacement", () => {
        expect(splice([1, 2], 1, 1, [3])).toStrictEqual([1, 3]);
      });
    });

    describe("delete all", () => {
      test("without replacement", () => {
        expect(splice([1, 2], 1, 2, [])).toStrictEqual([1]);
      });

      test("with replacement", () => {
        expect(splice([1, 2], 1, 2, [3])).toStrictEqual([1, 3]);
      });
    });
  });

  describe("start at array end", () => {
    describe("no deletions", () => {
      test("without replacement", () => {
        expect(splice([1, 2], 2, 0, [])).toStrictEqual([1, 2]);
      });

      test("with replacement", () => {
        expect(splice([1, 2], 2, 0, [3])).toStrictEqual([1, 2, 3]);
      });
    });
  });

  describe("empty array", () => {
    describe("start at array start", () => {
      test("without replacement", () => {
        expect(splice([], 0, -1, [])).toStrictEqual([]);
      });

      test("with replacement", () => {
        expect(splice([] as number[], 0, -1, [3])).toStrictEqual([3]);
      });
    });
  });
});

describe("overflow indices", () => {
  describe("negative start", () => {
    describe("negative deleteCount", () => {
      test("without replacement", () => {
        expect(splice([1, 2], -1, -1, [])).toStrictEqual([1, 2]);
      });

      test("with replacement", () => {
        expect(splice([1, 2], -1, -1, [3])).toStrictEqual([1, 3, 2]);
      });
    });

    describe("no deletions", () => {
      test("without replacement", () => {
        expect(splice([1, 2], -1, 0, [])).toStrictEqual([1, 2]);
      });

      test("with replacement", () => {
        expect(splice([1, 2], -1, 0, [3])).toStrictEqual([1, 3, 2]);
      });
    });

    describe("delete some", () => {
      test("without replacement", () => {
        expect(splice([1, 2], -1, 1, [])).toStrictEqual([1]);
      });

      test("with replacement", () => {
        expect(splice([1, 2], -1, 1, [3])).toStrictEqual([1, 3]);
      });
    });

    describe("delete all", () => {
      test("without replacement", () => {
        expect(splice([1, 2], -1, 2, [])).toStrictEqual([1]);
      });

      test("with replacement", () => {
        expect(splice([1, 2], -1, 2, [3])).toStrictEqual([1, 3]);
      });
    });
  });

  describe("negative deleteCount", () => {
    describe("start at array start", () => {
      test("without replacement", () => {
        expect(splice([1, 2], 0, -1, [])).toStrictEqual([1, 2]);
      });

      test("with replacement", () => {
        expect(splice([1, 2], 0, -1, [3])).toStrictEqual([3, 1, 2]);
      });
    });

    describe("start within the array", () => {
      test("without replacement", () => {
        expect(splice([1, 2], 1, -1, [])).toStrictEqual([1, 2]);
      });

      test("with replacement", () => {
        expect(splice([1, 2], 1, -1, [3])).toStrictEqual([1, 3, 2]);
      });
    });

    describe("start at array end", () => {
      test("without replacement", () => {
        expect(splice([1, 2], 2, -1, [])).toStrictEqual([1, 2]);
      });

      test("with replacement", () => {
        expect(splice([1, 2], 2, -1, [3])).toStrictEqual([1, 2, 3]);
      });
    });
  });

  describe("empty array", () => {
    describe("negative start", () => {
      test("without replacement", () => {
        expect(splice([], -1, -1, [])).toStrictEqual([]);
      });

      test("with replacement", () => {
        expect(splice([] as number[], -1, -1, [3])).toStrictEqual([3]);
      });
    });

    describe("start > data.length", () => {
      test("without replacement", () => {
        expect(splice([], 1, -1, [])).toStrictEqual([]);
      });

      test("with replacement", () => {
        expect(splice([] as number[], 1, -1, [3])).toStrictEqual([3]);
      });
    });
  });

  describe("start > data.length", () => {
    test("without replacement", () => {
      expect(splice([1, 2], 5, 1, [])).toStrictEqual([1, 2]);
    });

    test("with replacement", () => {
      expect(splice([1, 2], 5, 1, [3])).toStrictEqual([1, 2, 3]);
    });
  });
});

describe("coerced indices", () => {
  test("fractional start and deleteCount truncate", () => {
    expect(splice([1, 2, 3, 4], 1.7, 1.9)).toStrictEqual([1, 3, 4]);
  });

  test("a fractional negative start truncates toward zero", () => {
    expect(splice([1, 2, 3], -1.5, 1)).toStrictEqual([1, 2]);
  });

  test("a start between -1 and 0 counts as 0", () => {
    expect(splice([1, 2, 3], -0.5, 1)).toStrictEqual([2, 3]);
  });

  test("a -0 start counts as 0", () => {
    expect(splice([1, 2, 3], -0, 1)).toStrictEqual([2, 3]);
  });

  test("a NaN start counts as 0", () => {
    expect(splice([1, 2, 3], NaN, 1)).toStrictEqual([2, 3]);
  });

  test("a NaN deleteCount counts as 0", () => {
    expect(splice([1, 2, 3], 1, NaN, [9])).toStrictEqual([1, 9, 2, 3]);
  });

  test("an infinite start appends the replacement", () => {
    expect(splice([1, 2], Infinity, 0, [3])).toStrictEqual([1, 2, 3]);
  });

  test("a -Infinity start counts as 0", () => {
    expect(splice([1, 2], -Infinity, 1, [3])).toStrictEqual([3, 2]);
  });

  test("a negative start past the beginning counts as 0", () => {
    expect(splice([1, 2], -5, 1, [3])).toStrictEqual([3, 2]);
  });

  test("an infinite deleteCount deletes the rest", () => {
    expect(splice([1, 2, 3], 1, Infinity, [9])).toStrictEqual([1, 9]);
  });
});

describe("items", () => {
  test("reads holes as undefined", () => {
    expect(
      splice(
        // eslint-disable-next-line no-sparse-arrays -- The hole is the case under test.
        [1, , 3],
        0,
        1,
      ),
    ).toStrictEqual([undefined, 3]);
  });

  test("keeps NaN and -0", () => {
    expect(splice([NaN, -0, 1], 2, 1)).toStrictEqual([NaN, -0]);
  });
});

test("a purried data-last implementation", () => {
  expect(pipe([1, 2, 3, 4, 5, 6, 7, 8], splice(2, 3, [9, 10]))).toStrictEqual([
    1, 2, 9, 10, 6, 7, 8,
  ]);
});

describe("replacement defaults to an empty array", () => {
  test("data-first", () => {
    expect(splice([1, 2, 3, 4, 5], 1, 2)).toStrictEqual(
      splice([1, 2, 3, 4, 5], 1, 2, []),
    );
  });

  test("data-last", () => {
    expect(pipe([1, 2, 3, 4, 5], splice(1, 2))).toStrictEqual(
      pipe([1, 2, 3, 4, 5], splice(1, 2, [])),
    );
  });
});

describe("in a pipe", () => {
  test("returns a new array", () => {
    const data = [1, 2, 3];

    expect(pipe(data, splice(0, 0, []))).not.toBe(data);
  });

  test("an empty array gives the replacement", () => {
    const data: number[] = [];

    expect(pipe(data, splice(0, 0, [1]))).toStrictEqual([1]);
  });

  test("an empty array gives the replacement for any start", () => {
    const data: number[] = [];

    expect(pipe(data, splice(3, 2, [1]))).toStrictEqual([1]);
  });

  test("inserts before the item at start when nothing is deleted", () => {
    expect(pipe([1, 2, 3], splice(1, 0, [9]))).toStrictEqual([1, 9, 2, 3]);
  });

  test("a start at the end appends the replacement", () => {
    expect(pipe([1, 2], splice(2, 0, [3]))).toStrictEqual([1, 2, 3]);
  });

  test("a start past the end appends the replacement", () => {
    expect(pipe([1, 2], splice(5, 1, [3]))).toStrictEqual([1, 2, 3]);
  });

  test("deletes up to the end", () => {
    expect(pipe([1, 2, 3], splice(1, 5, [9]))).toStrictEqual([1, 9]);
  });

  test("fractional start and deleteCount truncate", () => {
    expect(pipe([1, 2, 3, 4], splice(1.7, 1.9))).toStrictEqual([1, 3, 4]);
  });

  test("a -0 start counts as 0", () => {
    expect(pipe([1, 2, 3], splice(-0, 1))).toStrictEqual([2, 3]);
  });

  test("a start between -1 and 0 counts as 0", () => {
    expect(pipe([1, 2, 3], splice(-0.5, 1))).toStrictEqual([2, 3]);
  });

  test("a NaN start counts as 0", () => {
    expect(pipe([1, 2, 3], splice(NaN, 1))).toStrictEqual([2, 3]);
  });

  test("a NaN deleteCount counts as 0", () => {
    expect(pipe([1, 2, 3], splice(1, NaN, [9]))).toStrictEqual([1, 9, 2, 3]);
  });

  test("a negative deleteCount counts as 0", () => {
    expect(pipe([1, 2, 3], splice(1, -1, [9]))).toStrictEqual([1, 9, 2, 3]);
  });

  test("an infinite start appends the replacement", () => {
    expect(pipe([1, 2], splice(Infinity, 0, [3]))).toStrictEqual([1, 2, 3]);
  });

  test("an infinite deleteCount deletes the rest", () => {
    expect(pipe([1, 2, 3], splice(1, Infinity, [9]))).toStrictEqual([1, 9]);
  });

  test("reads holes as undefined", () => {
    expect(
      pipe(
        // eslint-disable-next-line no-sparse-arrays -- The hole is the case under test.
        [1, , 3],
        splice(0, 1),
      ),
    ).toStrictEqual([undefined, 3]);
  });

  test("counts positions among the items that reach it", () => {
    expect(
      pipe(
        [1, 2, 3, 4, 5],
        filter((x) => x % 2 === 1),
        splice(1, 1),
      ),
    ).toStrictEqual([1, 5]);
  });

  test("before a stopper that ends inside the replacement", () => {
    expect(pipe([1, 2, 3], splice(1, 1, [7, 8]), take(2))).toStrictEqual([
      1, 7,
    ]);
  });

  test("before a stopper that ends inside an appended replacement", () => {
    expect(pipe([1, 2, 3], splice(5, 0, [7, 8]), take(4))).toStrictEqual([
      1, 2, 3, 7,
    ]);
  });
});
