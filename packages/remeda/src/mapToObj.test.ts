/* eslint-disable @typescript-eslint/no-deprecated --
 * This utility is going away in v3!
 */

import { describe, expect, test } from "vitest";
import { mapToObj } from "./mapToObj";
import { pipe } from "./pipe";

describe("data_first", () => {
  test("mapToObj", () => {
    const result = mapToObj([1, 2, 3], (x) => [String(x), x * 2]);

    expect(result).toStrictEqual({ 1: 2, 2: 4, 3: 6 });
  });

  test("indexed", () => {
    const result = mapToObj([0, 0, 0], (_, i) => [i, i]);

    expect(result).toStrictEqual({ 0: 0, 1: 1, 2: 2 });
  });
});

describe("data_last", () => {
  test("mapToObj", () => {
    const result = pipe(
      [1, 2, 3],
      mapToObj((x) => [String(x), x * 2]),
    );

    expect(result).toStrictEqual({ 1: 2, 2: 4, 3: 6 });
  });

  test("indexed", () => {
    const result = pipe(
      [0, 0, 0],
      mapToObj((_, i) => [i, i]),
    );

    expect(result).toStrictEqual({ 0: 0, 1: 1, 2: 2 });
  });
});
