import { expect, test, vi } from "vitest";
import { forEach } from "./forEach";
import { pipe } from "./pipe";
import { take } from "./take";

test("dataFirst", () => {
  const data = [1, 2, 3];
  const cb = vi.fn<(x: number) => void>();

  forEach(data, cb);

  expect(cb).toHaveBeenCalledWith(1, 0, data);
  expect(cb).toHaveBeenCalledWith(2, 1, data);
  expect(cb).toHaveBeenCalledWith(3, 2, data);
});

test("dataLast", () => {
  const data = [1, 2, 3];
  const cb = vi.fn<(x: number) => void>();

  // Because the callback is used before forEach "sees" `data`, we need to
  // explicitly tell it the how to type the `data` param..
  const result = forEach<typeof data>(cb)(data);

  expect(cb).toHaveBeenCalledWith(1, 0, data);
  expect(cb).toHaveBeenCalledWith(2, 1, data);
  expect(cb).toHaveBeenCalledWith(3, 2, data);

  // dataLast used directly, we return the same reference.
  expect(result).toBe(data);
});

test("pipe", () => {
  const data = [1, 2, 3];

  const cb = vi.fn<(x: number) => void>();

  const result = pipe(data, forEach(cb));

  expect(cb).toHaveBeenCalledWith(1, 0, data);
  expect(cb).toHaveBeenCalledWith(2, 1, data);
  expect(cb).toHaveBeenCalledWith(3, 2, data);

  expect(result).toStrictEqual(data);
  // The pipe reconstructs the array because it runs lazily.
  expect(result).not.toBe(data);
});

test("with take", () => {
  const count = vi.fn<() => void>();
  const result = pipe(
    [1, 2, 3],
    forEach(() => {
      count();
    }),
    take(2),
  );

  expect(count).toHaveBeenCalledTimes(2);
  expect(result).toStrictEqual([1, 2]);
});
