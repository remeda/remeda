import { describe, expect, test } from "vitest";
import { pipe } from "./pipe";
import { reverse } from "./reverse";

describe("data first", () => {
  test("reverse", () => {
    const actual = reverse([1, 2, 3]);

    expect(actual).toStrictEqual([3, 2, 1]);
  });

  test("keeps holes", () => {
    // eslint-disable-next-line no-sparse-arrays -- The holes are the case under test.
    expect(reverse([1, , 3])).toStrictEqual([3, , 1]);
  });
});

describe("data last", () => {
  test("reverse", () => {
    const actual = pipe([1, 2, 3], reverse());

    expect(actual).toStrictEqual([3, 2, 1]);
  });
});
