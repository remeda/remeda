import { mergeAll } from "./mergeAll";

test("merge objects", () => {
  expect(
    mergeAll([{ a: 1, b: 1 }, { b: 2, c: 3 }, { d: 10 }] as const),
  ).toStrictEqual({
    a: 1,
    b: 2,
    c: 3,
    d: 10,
  });
});

it("should return an empty object when the input is an empty array", () => {
  const input: ReadonlyArray<object> = [];

  const result = mergeAll(input);

  expect(result).toStrictEqual({});
});
