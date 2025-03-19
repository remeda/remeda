/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { describe, it, expect } from "vitest";
import doProduce from "./doProduce";

const impl = (data: Iterable<number>, arg1: number): Array<number> =>
  [...data].map((val) => val + arg1);

describe("doProduce", () => {
  it("should call the implementation with all arguments when lengths match", () => {
    const args = [[10, 20], 5];
    const result = doProduce(impl, args);

    expect(result).toStrictEqual([15, 25]);
  });

  it("should return a producer function when there is one argument missing", () => {
    const args = [5];
    const result = doProduce(impl, args) as any;

    expect(typeof result).toBe("function");
    expect(result.lazyKind).toBe("producer");
    expect(result([1, 2, 3])).toStrictEqual([6, 7, 8]);
  });

  it("should throw an error when there are too many arguments", () => {
    const args = [[10, 20], 5, 0];

    expect(() => doProduce(impl, args)).toThrow("Wrong number of arguments");
  });

  it("should throw an error when there are too few arguments", () => {
    const args: Array<unknown> = [];

    expect(() => doProduce(impl, args)).toThrow("Wrong number of arguments");
  });
});
