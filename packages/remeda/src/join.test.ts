import { describe, expect, test } from "vitest";
import { join } from "./join";

describe("joins same-typed items", () => {
  test("number", () => {
    const array = [1, 2, 3, 4, 5];
    const result = join(array, ",");

    expect(result).toBe("1,2,3,4,5");
  });

  test("string", () => {
    const array = ["a", "b", "c", "d", "e"];
    const result = join(array, ",");

    expect(result).toBe("a,b,c,d,e");
  });

  test("bigint", () => {
    const array = [1n, 2n, 3n, 4n, 5n];
    const result = join(array, ",");

    expect(result).toBe("1,2,3,4,5");
  });

  test("boolean", () => {
    const array = [true, false, true, false, true];
    const result = join(array, ",");

    expect(result).toBe("true,false,true,false,true");
  });

  test("null", () => {
    const array = [null, null, null, null, null];
    const result = join(array, ",");

    expect(result).toBe(",,,,");
  });

  test("undefined", () => {
    const array = [undefined, undefined, undefined, undefined, undefined];
    const result = join(array, ",");

    expect(result).toBe(",,,,");
  });
});

test("joins different-typed items", () => {
  const array = [1, "2", 3n, true, null, undefined];
  const result = join(array, ",");

  expect(result).toBe("1,2,3,true,,");
});

describe("edge-cases", () => {
  test("empty glue", () => {
    const array = [1, 2, 3, 4, 5];
    const result = join(array, "");

    expect(result).toBe("12345");
  });

  test("empty array", () => {
    const array: Array<number> = [];
    const result = join(array, ",");

    expect(result).toBe("");
  });

  test("doesnt add glue on single item", () => {
    const array = [1];
    const result = join(array, ",");

    expect(result).toBe("1");
  });
});
