/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { describe, it, expect } from "vitest";
import doReduce from "./doReduce";
import type { LazyReducerImpl } from "./types/LazyFunc";

const impl: LazyReducerImpl<number, [number], number> = (data, arg1) =>
  [...data].reduce((acc, val) => acc + val, arg1);

describe("doReduce", () => {
  it("should call the implementation with all arguments when lengths match", () => {
    const args = [[10], 0];
    const result = doReduce(impl, args);

    expect(result).toBe(10);
  });

  it("should return a reducer function when there is one argument missing", () => {
    const args = [0];
    const result = doReduce(impl, args) as any;

    expect(typeof result).toBe("function");
    expect(result.lazyKind).toBe("reducer");
    expect(result([1, 2, 3])).toBe(6);
  });

  it("should throw an error when there are too many arguments missing", () => {
    const args = [[10, 20], 0, 0];

    expect(() => doReduce(impl, args)).toThrow("Wrong number of arguments");
  });
});
