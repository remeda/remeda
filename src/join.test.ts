import { join } from "./join";

describe("joins same-typed items", () => {
  it("number", () => {
    const array = [1, 2, 3, 4, 5];
    const result = join(array, ",");

    expect(result).toBe("1,2,3,4,5");
  });

  it("string", () => {
    const array = ["a", "b", "c", "d", "e"];
    const result = join(array, ",");

    expect(result).toBe("a,b,c,d,e");
  });

  it("bigint", () => {
    const array = [1n, 2n, 3n, 4n, 5n];
    const result = join(array, ",");

    expect(result).toBe("1,2,3,4,5");
  });

  it("boolean", () => {
    const array = [true, false, true, false, true];
    const result = join(array, ",");

    expect(result).toBe("true,false,true,false,true");
  });

  it("null", () => {
    const array = [null, null, null, null, null];
    const result = join(array, ",");

    expect(result).toBe(",,,,");
  });

  it("undefined", () => {
    const array = [undefined, undefined, undefined, undefined, undefined];
    const result = join(array, ",");

    expect(result).toBe(",,,,");
  });
});

it("joins different-typed items", () => {
  const array = [1, "2", 3n, true, null, undefined];
  const result = join(array, ",");

  expect(result).toBe("1,2,3,true,,");
});

describe("edge-cases", () => {
  it("empty glue", () => {
    const array = [1, 2, 3, 4, 5];
    const result = join(array, "");

    expect(result).toBe("12345");
  });

  it("empty array", () => {
    const array: Array<number> = [];
    const result = join(array, ",");

    expect(result).toBe("");
  });

  it("doesnt add glue on single item", () => {
    const array = [1];
    const result = join(array, ",");

    expect(result).toBe("1");
  });
});
