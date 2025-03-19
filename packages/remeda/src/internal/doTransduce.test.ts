/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { describe, it, expect } from "vitest";
import doTransduce from "./doTransduce";
import type {
  EagerTransducerImpl,
  LazyTransducerImpl,
  Transducer,
} from "./types/LazyFunc";
import { multiply } from "../multiply";

const lazyImpl: LazyTransducerImpl<number, [(x: number) => number], number> = (
  data,
  fn,
) => [...data].map(fn);

const eagerImpl: EagerTransducerImpl<
  number,
  [(x: number) => number],
  number
> = (data, fn) => data.map(fn);

describe("doTransduce", () => {
  it("works with data-first signature", () => {
    const result = doTransduce(undefined, lazyImpl, [[1, 2, 3], multiply(2)]);

    expect(result).toStrictEqual([2, 4, 6]);
  });

  it("works with data-last signature", () => {
    const transducer = doTransduce(undefined, lazyImpl, [
      multiply(2),
    ]) as Transducer<number, number>;
    const result = transducer([1, 2, 3]);

    expect(result).toStrictEqual([2, 4, 6]);
  });

  it("throws error for too few arguments", () => {
    expect(() => doTransduce(undefined, lazyImpl, [])).toThrow(
      "Wrong number of arguments",
    );
  });

  it("throws error for too many arguments", () => {
    expect(() => doTransduce(undefined, lazyImpl, [1, 2, 3])).toThrow(
      "Wrong number of arguments",
    );
  });

  it("works with eager transducer", () => {
    const result = doTransduce(eagerImpl, lazyImpl, [[1, 2, 3], multiply(2)]);

    expect(result).toStrictEqual([2, 4, 6]);
  });

  it("works with lazy transducer", () => {
    const transducer = doTransduce(undefined, lazyImpl, [
      multiply(2),
    ]) as Transducer<number, number>;
    const result = transducer([1, 2, 3]);

    expect(result).toStrictEqual([2, 4, 6]);
  });

  it("returns lazy transducer with correct properties", () => {
    const transducer = doTransduce(
      undefined,
      lazyImpl,
      [multiply(2)],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ) as any;

    expect(transducer.lazyKind).toBe("transducer");
    expect(typeof transducer.lazy).toBe("function");
  });
});
