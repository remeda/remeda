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

test("callback function type does not match data array type", () => {
  const data = [1, 2, 3];
  // @ts-expect-error [ts2345]: Type 'number' is not assignable to type 'string'.
  countBy(data, (x: string) => x);
});

test("array with nullish values", () => {
  const data = [1, null, undefined];
  // @ts-expect-error [ts2322] - Type 'number | null | undefined' is not assignable to type 'PropertyKey'.
  countBy(data, (x) => x);
});
