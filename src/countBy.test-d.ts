import { countBy } from "./countBy";
import { pipe } from "./pipe";

describe("dataFirst", () => {
  test("countBy", () => {
    const data = ["a", "b", "c", "B", "A", "a"];
    const result = countBy(data, (x) => x.toLowerCase());

    expectTypeOf(result).toEqualTypeOf<Record<string, number>>();
  });
});

describe("dataLast", () => {
  test("countBy", () => {
    const data = ["a", "b", "c", "B", "A", "a"];
    const result = pipe(
      data,
      countBy((x) => x.toLowerCase()),
    );

    expectTypeOf(result).toEqualTypeOf<Record<string, number>>();
  });
});

test("callback function type", () => {
  const data = [1, 2, 3];
  countBy(data, (x) => {
    expectTypeOf(x).toEqualTypeOf<number>();
    return x;
  });
});

test("literal unions", () => {
  const data = [] as Array<"cat" | "dog">;
  const result = countBy(data, (x) => x);

  expectTypeOf(result).toEqualTypeOf<Partial<Record<"cat" | "dog", number>>>();
});
