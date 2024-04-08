import { heapMaybeInsert } from "./_heap";

// TODO: This file only tests edge-cases which cannot be reached via the public
// functions that use the heap functions. We can expand the testing for heap so
// that we aren't dependant on those functions to test the core heap
// functionality.

describe("heapMaybeInsert", () => {
  describe("runtime", () => {
    test("it works trivially on an empty heap", () => {
      const heap = [] as Array<number>;
      expect(heapMaybeInsert(heap, (a, b) => a - b, 1)).toBeUndefined();
    });
  });
});
