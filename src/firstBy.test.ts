import { firstBy } from "./firstBy";
import { identity } from "./identity";
import { pipe } from "./pipe";

describe("runtime (dataFirst)", () => {
  it("returns undefined on empty", () => {
    expect(firstBy([], identity())).toBeUndefined();
  });

  it("returns the item on a single item array", () => {
    expect(firstBy([1], identity())).toBe(1);
  });

  it("finds the minimum", () => {
    expect(firstBy([2, 1, 4, 3, 5], identity())).toBe(1);
  });

  it("finds the minimum with a non-trivial order rule", () => {
    expect(firstBy(["aa", "a", "aaaa", "aaa", "aaaaa"], (x) => x.length)).toBe(
      "a",
    );
  });

  it("finds the max with 'desc' order rules", () => {
    expect(firstBy([2, 1, 4, 3, 5], [identity(), "desc"])).toBe(5);
  });

  it("finds the max with non-trivial 'desc' order rules", () => {
    expect(
      firstBy(["aa", "a", "aaaa", "aaa", "aaaaa"], [identity(), "desc"]),
    ).toBe("aaaaa");
  });

  it("breaks ties with multiple order rules", () => {
    const data = ["a", "bb", "b", "aaaa", "bbb", "aa", "aaa", "bbbb"];

    expect(firstBy(data, (x) => x.length, identity())).toBe("a");
    expect(firstBy(data, [(x) => x.length, "desc"], identity())).toBe("aaaa");
    expect(firstBy(data, (x) => x.length, [identity(), "desc"])).toBe("b");
    expect(firstBy(data, [(x) => x.length, "desc"], [identity(), "desc"])).toBe(
      "bbbb",
    );
  });

  it("can compare strings", () => {
    expect(firstBy(["b", "a", "c"], identity())).toBe("a");
  });

  it("can compare numbers", () => {
    expect(firstBy([2, 1, 3], identity())).toBe(1);
  });

  it("can compare booleans", () => {
    expect(firstBy([true, false, true, true, false], identity())).toBe(false);
  });

  it("can compare valueOfs", () => {
    expect(
      firstBy([new Date(), new Date(1), new Date(2)], identity()),
    ).toStrictEqual(new Date(1));
  });
});

describe("runtime (dataLast)", () => {
  it("returns undefined on empty", () => {
    expect(pipe([], firstBy(identity()))).toBeUndefined();
  });

  it("returns the item on a single item array", () => {
    expect(pipe([1], firstBy(identity()))).toBe(1);
  });

  it("finds the minimum", () => {
    expect(pipe([2, 1, 4, 3, 5], firstBy(identity()))).toBe(1);
  });

  it("finds the minimum with a non-trivial order rule", () => {
    expect(
      pipe(
        ["aa", "a", "aaaa", "aaa", "aaaaa"],
        firstBy((x) => x.length),
      ),
    ).toBe("a");
  });

  it("finds the max with 'desc' order rules", () => {
    expect(pipe([2, 1, 4, 3, 5], firstBy([identity(), "desc"]))).toBe(5);
  });

  it("finds the max with non-trivial 'desc' order rules", () => {
    expect(
      pipe(["aa", "a", "aaaa", "aaa", "aaaaa"], firstBy([identity(), "desc"])),
    ).toBe("aaaaa");
  });

  it("breaks ties with multiple order rules", () => {
    const data = ["a", "bb", "b", "aaaa", "bbb", "aa", "aaa", "bbbb"];

    expect(
      pipe(
        data,
        firstBy((x) => x.length, identity()),
      ),
    ).toBe("a");
    expect(pipe(data, firstBy([(x) => x.length, "desc"], identity()))).toBe(
      "aaaa",
    );
    expect(
      pipe(
        data,
        firstBy((x) => x.length, [identity(), "desc"]),
      ),
    ).toBe("b");
    expect(
      pipe(
        data,
        firstBy([(x: string) => x.length, "desc"], [identity(), "desc"]),
      ),
    ).toBe("bbbb");
  });

  it("can compare strings", () => {
    expect(pipe(["b", "a", "c"], firstBy(identity()))).toBe("a");
  });

  it("can compare numbers", () => {
    expect(pipe([2, 1, 3], firstBy(identity()))).toBe(1);
  });

  it("can compare booleans", () => {
    expect(pipe([true, false, true, true, false], firstBy(identity()))).toBe(
      false,
    );
  });

  it("can compare valueOfs", () => {
    expect(
      pipe([new Date(), new Date(1), new Date(2)], firstBy(identity())),
    ).toStrictEqual(new Date(1));
  });
});
