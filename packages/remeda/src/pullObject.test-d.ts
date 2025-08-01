import { expectTypeOf, test } from "vitest";
import { constant } from "./constant";
import { identity } from "./identity";
import { pipe } from "./pipe";
import { pullObject } from "./pullObject";

test("string keys", () => {
  const data = ["a", "b"];

  expectTypeOf(pullObject(data, identity(), constant("value"))).toEqualTypeOf<
    Record<string, "value">
  >();
  expectTypeOf(
    pipe(data, pullObject(identity(), constant("value"))),
  ).toEqualTypeOf<Record<string, "value">>();
});

test("number keys", () => {
  const data = [1, 2];

  expectTypeOf(pullObject(data, identity(), constant(3))).toEqualTypeOf<
    Record<number, 3>
  >();
  expectTypeOf(pipe(data, pullObject(identity(), constant(3)))).toEqualTypeOf<
    Record<number, 3>
  >();
});

test("symbol keys", () => {
  const data = [Symbol("a"), Symbol("b")];

  const dataFirst = pullObject(data, identity(), constant(Symbol("c")));

  expectTypeOf(dataFirst).toEqualTypeOf<Record<symbol, symbol>>();

  const dataLast = pipe(data, pullObject(identity(), constant(Symbol("c"))));

  expectTypeOf(dataLast).toEqualTypeOf<Record<symbol, symbol>>();
});

test("number constants", () => {
  const data = [1, 2] as const;

  expectTypeOf(pullObject(data, identity(), constant("a"))).toEqualTypeOf<{
    1?: "a";
    2?: "a";
  }>();
  expectTypeOf(
    pipe(data, pullObject(identity(), constant("a"))),
  ).toEqualTypeOf<{ 1?: "a"; 2?: "a" }>();
});

test("string constants", () => {
  const data = ["a", "b"] as const;

  expectTypeOf(pullObject(data, identity(), constant("c"))).toEqualTypeOf<{
    a?: "c";
    b?: "c";
  }>();
  expectTypeOf(
    pipe(data, pullObject(identity(), constant("c"))),
  ).toEqualTypeOf<{ a?: "c"; b?: "c" }>();
});

test("literal unions keys", () => {
  const data = [1, 2];

  expectTypeOf(
    pullObject(
      data,
      (item) => (item % 2 === 0 ? "odd" : "even"),
      constant("c"),
    ),
  ).toEqualTypeOf<{ even?: "c"; odd?: "c" }>();
  expectTypeOf(
    pipe(
      data,
      pullObject((item) => (item % 2 === 0 ? "odd" : "even"), constant("c")),
    ),
  ).toEqualTypeOf<{ even?: "c"; odd?: "c" }>();
});

test("template string keys", () => {
  const data = [1, 2];

  expectTypeOf(
    pullObject(data, (item) => `prefix_${item}`, constant("value")),
  ).toEqualTypeOf<Record<`prefix_${number}`, "value">>();
  expectTypeOf(
    pipe(
      data,
      pullObject((item) => `prefix_${item}`, constant("value")),
    ),
  ).toEqualTypeOf<Record<`prefix_${number}`, "value">>();
});
