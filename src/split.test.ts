import { split } from "./split";
import { pipe } from "./pipe";

describe("runtime", () => {
  test("empty string, empty separator", () => {
    expect(split("", "")).toEqual([]);
  });

  test("empty string, non-empty separator", () => {
    expect(split("", ",")).toEqual([""]);
  });

  test("trivial split", () => {
    expect(split("a", ",")).toEqual(["a"]);
  });

  test("string contains separator", () => {
    expect(split(",", ",")).toEqual(["", ""]);
  });

  test("useful split", () => {
    expect(split("a,b,c", ",")).toEqual(["a", "b", "c"]);
  });

  test("regex split", () => {
    expect(split("a,b,c", /,/u)).toEqual(["a", "b", "c"]);
  });

  test("multiple types of separators", () => {
    expect(split("a,b;c", /[;,]/u)).toEqual(["a", "b", "c"]);
  });

  test("regex with limit", () => {
    expect(split("a,b,c", /,/u, 2)).toEqual(["a", "b"]);
  });

  test("limited split", () => {
    expect(split("a,b,c", ",", 2)).toEqual(["a", "b"]);
  });

  test("limit is higher than splits", () => {
    expect(split("a,b,c", ",", 5)).toEqual(["a", "b", "c"]);
  });

  test("multiple consecutive separators", () => {
    expect(split("a,,b", ",")).toEqual(["a", "", "b"]);
  });

  test("separator at the start and end", () => {
    expect(split(",a,b,", ",")).toEqual(["", "a", "b", ""]);
  });

  test("empty-string separator", () => {
    expect(split("abcdef", "")).toEqual(["a", "b", "c", "d", "e", "f"]);
  });

  test("undefined limit", () => {
    expect(split("a,b,c", ",", undefined)).toEqual(["a", "b", "c"]);
  });

  test("negative limit", () => {
    expect(split("a,b,c", ",", -1)).toEqual(["a", "b", "c"]);
  });

  test("fractional limits", () => {
    expect(split("a,b,c", ",", 1.5)).toEqual(["a"]);
  });

  test("0 limit", () => {
    expect(split("a,b,c", ",", 0)).toEqual([]);
  });

  describe("dataLast", () => {
    test("useful split", () => {
      expect(pipe("a,b,c", split(","))).toEqual(["a", "b", "c"]);
    });

    test("regex split", () => {
      expect(pipe("a,b,c", split(/,/u))).toEqual(["a", "b", "c"]);
    });

    test("limited split", () => {
      expect(pipe("a,b,c", split(",", 2))).toEqual(["a", "b"]);
    });

    test("regex with limit", () => {
      expect(pipe("a,b,c", split(/,/u, 2))).toEqual(["a", "b"]);
    });

    test("undefined limit", () => {
      expect(pipe("a,b,c", split(",", undefined))).toEqual(["a", "b", "c"]);
    });
  });
});

describe("typing", () => {
  test("non-literals", () => {
    const result = split("" as string, "" as string);
    expectTypeOf(result).toEqualTypeOf<Array<string>>();
  });

  test("non-literal data", () => {
    const result = split("" as string, ",");
    expectTypeOf(result).toEqualTypeOf<Array<string>>();
  });

  test("non-literal separator", () => {
    const result = split("", "," as string);
    expectTypeOf(result).toEqualTypeOf<Array<string>>();
  });

  test("non-literal limit", () => {
    const result = split("", "", 1 as number);
    expectTypeOf(result).toEqualTypeOf<Array<string>>();
  });

  test("literal empty strings", () => {
    const result = split("", "");
    expectTypeOf(result).toEqualTypeOf<[]>();
  });

  test("trivial literals", () => {
    const result = split("a", ",");
    expectTypeOf(result).toEqualTypeOf<["a"]>();
  });

  test("trivial literals", () => {
    const result = split("a", ",");
    expectTypeOf(result).toEqualTypeOf<["a"]>();
  });

  test("string contains separator", () => {
    const result = split(",", ",");
    expectTypeOf(result).toEqualTypeOf<["", ""]>();
  });

  test("useful split", () => {
    const result = split("a,b,c", ",");
    expectTypeOf(result).toEqualTypeOf<["a", "b", "c"]>();
  });

  test("regex split", () => {
    const result = split("a,b,c", /,/u);
    expectTypeOf(result).toEqualTypeOf<Array<string>>();
  });

  test("limited split", () => {
    const result = split("a,b,c", ",", 2);
    expectTypeOf(result).toEqualTypeOf<["a", "b"]>();
  });

  test("limit is higher than splits", () => {
    const result = split("a,b,c", ",", 5);
    expectTypeOf(result).toEqualTypeOf<["a", "b", "c"]>();
  });

  test("undefined limit", () => {
    const result = split("a,b,c", ",", undefined);
    expectTypeOf(result).toEqualTypeOf<["a", "b", "c"]>();
  });

  test("multiple consecutive separators", () => {
    const result = split("a,,b", ",");
    expectTypeOf(result).toEqualTypeOf<["a", "", "b"]>();
  });

  test("separator at the start and end", () => {
    const result = split(",a,b,", ",");
    expectTypeOf(result).toEqualTypeOf<["", "a", "b", ""]>();
  });

  test("empty string separator", () => {
    const result = split("abcdef", "");
    expectTypeOf(result).toEqualTypeOf<["a", "b", "c", "d", "e", "f"]>();
  });

  test("empty everything", () => {
    const result = split("", "");
    expectTypeOf(result).toEqualTypeOf<[]>();
  });

  test("literal string with multiple character separator", () => {
    const result = split("a--b--c", "--");
    expectTypeOf(result).toEqualTypeOf<["a", "b", "c"]>();
  });

  test("negative limit", () => {
    const result = split("a,b,c", ",", -1);
    expectTypeOf(result).toEqualTypeOf<["a", "b", "c"]>();
  });

  test("fractional limits", () => {
    const result = split("a,b,c", ",", 1.5);
    expectTypeOf(result).toEqualTypeOf<Array<string>>();
  });

  test("0 limit", () => {
    const result = split("a,b,c", ",", 0);
    expectTypeOf(result).toEqualTypeOf<[]>();
  });
});
