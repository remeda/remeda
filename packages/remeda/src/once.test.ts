import { expect, test, vi } from "vitest";
import { constant } from "./constant";
import { once } from "./once";

test("should call only once", () => {
  const mock = vi.fn<() => object>(constant({}));
  const wrapped = once(mock);
  const ret1 = wrapped();

  expect(mock).toHaveBeenCalledTimes(1);

  const ret2 = wrapped();

  expect(mock).toHaveBeenCalledTimes(1);
  expect(ret1).toBe(ret2);
});
