import { objOf } from "./objOf";

describe("data first", () => {
  test("wrap value", () => {
    const actual = objOf(10, "a");

    expect(actual.a).toBe(10);
    expect(actual).toStrictEqual({ a: 10 });
  });
});

describe("data last", () => {
  test("wrap value", () => {
    const actual = objOf("a")(10);

    expect(actual.a).toBe(10);
    expect(actual).toStrictEqual({ a: 10 });
  });
});
