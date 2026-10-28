import { describe, expect, test } from "vitest";
import { heapMaybeInsert } from "./heap";

// TODO: The heap functions are mostly tested through the public functions that use them (`takeFirstBy` and `dropFirstBy`), this file only adds edge-cases. We can expand the testing for heap so that we aren't dependent on those functions to test the core heap functionality.

describe(heapMaybeInsert, () => {
  test("returns the item on an empty heap", () => {
    expect(heapMaybeInsert([] as number[], (a, b) => a - b, 1)).toBe(1);
  });
});
