import { pipe } from "./pipe";
import { sumBy } from "./sumBy";

const array = [{ a: 1 }, { a: 2 }, { a: 4 }, { a: 5 }, { a: 3 }] as const;
const expected = 15;

describe("data first", () => {
  test("sumBy", () => {
    expect(sumBy(array, (x) => x.a)).toEqual(expected);
  });

  test("sumBy.indexed", () => {
    expect(sumBy.indexed(array, (x, idx) => x.a + idx)).toEqual(25);
  });
});

describe("data last", () => {
  test("sumBy", () => {
    expect(
      pipe(
        array,
        sumBy((x) => x.a),
      ),
    ).toEqual(expected);
  });

  test("sumBy.indexed", () => {
    const actual = pipe(
      array,
      sumBy.indexed((x, idx) => x.a + idx),
    );
    expect(actual).toEqual(25);
  });
});
