import { constant } from "./constant";
import { omitBy } from "./omitBy";
import { pipe } from "./pipe";

test("dataFirst", () => {
  expect(
    omitBy({ a: 1, b: 2, A: 3, B: 4 }, (_, key) => key.toUpperCase() === key),
  ).toStrictEqual({ a: 1, b: 2 });
});

test("dataLast", () => {
  expect(
    pipe(
      { a: 1, b: 2, A: 3, B: 4 },
      omitBy((_, key) => key.toUpperCase() === key),
    ),
  ).toStrictEqual({ a: 1, b: 2 });
});

test("number keys are converted to strings in the mapper", () => {
  omitBy({ 123: "hello" }, (_, key) => {
    expect(key).toBe("123");
    return true;
  });
});

test("symbols are passed through", () => {
  const mySymbol = Symbol("mySymbol");
  expect(omitBy({ [mySymbol]: 1 }, constant(true))).toStrictEqual({
    [mySymbol]: 1,
  });
});

test("symbols are not passed to the predicate", () => {
  const mock = vi.fn();
  const data = { [Symbol("mySymbol")]: 1, a: "hello" };
  omitBy(data, mock);
  expect(mock).toBeCalledTimes(1);
  expect(mock).toBeCalledWith("hello", "a", data);
});
