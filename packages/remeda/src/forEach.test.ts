import { expect, test, vi } from "vitest";
import { forEach } from "./forEach";
import type { LazyCallback } from "./internal/types/LazyCallback";
import { pipe } from "./pipe";
import { take } from "./take";

test("dataFirst", () => {
  const data = [1, 2, 3];
  const cb = vi.fn<(x: number) => void>();

  forEach(data, cb);

  expect(cb).toHaveBeenNthCalledWith(1, 1, 0, data);
  expect(cb).toHaveBeenNthCalledWith(2, 2, 1, data);
  expect(cb).toHaveBeenNthCalledWith(3, 3, 2, data);
});

test("dataLast", () => {
  const data = [1, 2, 3];
  const cb = vi.fn<(x: number) => void>();

  // Because the callback is used before forEach "sees" `data`, we need to
  // explicitly tell it the how to type the `data` param..
  const result = forEach<typeof data>(cb)(data);

  expect(cb).toHaveBeenNthCalledWith(1, 1, 0, data);
  expect(cb).toHaveBeenNthCalledWith(2, 2, 1, data);
  expect(cb).toHaveBeenNthCalledWith(3, 3, 2, data);

  // dataLast used directly, we return the same reference.
  expect(result).toBe(data);
});

test("pipe", () => {
  const data = [1, 2, 3];

  const cb = vi.fn<(x: number) => void>();

  const result = pipe(data, forEach(cb));

  expect(cb).toHaveBeenNthCalledWith(1, 1, 0, data);
  expect(cb).toHaveBeenNthCalledWith(2, 2, 1, data);
  expect(cb).toHaveBeenNthCalledWith(3, 3, 2, data);

  // Alone in the pipe the step runs eagerly, like the dataLast function used
  // directly, so we return the same reference.
  expect(result).toBe(data);
});

test("pipe with another lazy step", () => {
  const data = [1, 2, 3];

  const result = pipe(
    data,
    // Keeps the step lazy: on an array, a run fuses only when one of its
    // steps can stop early, as `take` can.
    take(Infinity),
    forEach(vi.fn<(x: number) => void>()),
  );

  expect(result).toStrictEqual(data);
  // The pipe reconstructs the array because it runs lazily.
  expect(result).not.toBe(data);
});

test("pipe with another lazy step that can't stop early", () => {
  const data = [1, 2, 3];

  const result = pipe(
    data,
    forEach(vi.fn<(x: number) => void>()),
    forEach(vi.fn<(x: number) => void>()),
  );

  // Neither step can stop early, so each one runs eagerly, like the dataLast
  // function used directly, and passes on the reference it got.
  expect(result).toBe(data);
});

test("provides the items processed so far to the callback", () => {
  const callback = vi.fn<LazyCallback<unknown[], unknown>>(
    (_value, _index, data) => [...data],
  );
  pipe(
    [1, 2, 3],
    // Keeps the step lazy: on an array, a run fuses only when one of its
    // steps can stop early, as `take` can.
    take(Infinity),
    forEach(callback),
  );

  expect(callback).toHaveNthReturnedWith(1, [1]);
  expect(callback).toHaveNthReturnedWith(2, [1, 2]);
  expect(callback).toHaveNthReturnedWith(3, [1, 2, 3]);
});

test("doesn't collect the items processed so far for a callback without `data`", () => {
  // `vi.fn` keeps its implementation's `length`, which is all the arity
  // check reads.
  const callback = vi.fn<
    (value: number, index: number, data: readonly number[]) => void
  >((value, index) => value + index);
  pipe(
    [1, 2, 3],
    // Keeps the step lazy: on an array, a run fuses only when one of its
    // steps can stop early, as `take` can.
    take(Infinity),
    forEach(callback),
  );

  expect(() => callback.mock.calls[0]?.[2]?.at(0)).toThrow(/^Remeda: /u);
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
