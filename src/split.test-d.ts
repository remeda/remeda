import { split } from "./split";

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
