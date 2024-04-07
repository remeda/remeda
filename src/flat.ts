import { lazyDataLastImpl } from "./_lazyDataLastImpl";
import type { IterableContainer } from "./_types";
import type { LazyEvaluator } from "./pipe";

// Copied from the TypeScript's typing for ES2019 Array lib. @see https://github.com/microsoft/TypeScript/blob/main/src/lib/es2019.array.d.ts#L1-L5
type FlatArray<T, Depth extends number> = {
  done: T;
  recur: T extends ReadonlyArray<infer InnerArr>
    ? FlatArray<
        InnerArr,
        [
          -1,
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12,
          13,
          14,
          15,
          16,
          17,
          18,
          19,
          20,
        ][Depth]
      >
    : T;
}[Depth extends -1 ? "done" : "recur"];

export function flat<T extends IterableContainer, D extends number = 1>(
  data: T,
  depth?: D,
): Array<FlatArray<T, D>>;

export function flat<D extends number = 1>(
  depth?: D,
): <T extends IterableContainer>(data: T) => Array<FlatArray<T, D>>;

export function flat(
  dataOrDepth: IterableContainer | number,
  depth?: number,
): unknown {
  if (typeof dataOrDepth === "object") {
    // TODO: Use the built-in `Array.prototype.flat` in V2.
    return flatImplementation(dataOrDepth, depth);
  }

  return lazyDataLastImpl(flatImplementation, arguments, lazyImplementation);
}

const lazyImplementation = (depth: number): LazyEvaluator =>
  depth <= 0
    ? lazyIdentity
    : (value) =>
        Array.isArray(value)
          ? {
              next: flatImplementation(value, depth - 1),
              hasNext: true,
              hasMany: true,
              done: false,
            }
          : { next: value, hasNext: true, done: false };

// This function is pulled out so that we don't generate a new arrow function
// each time. It acts as a lazy identity function by wrapping the value with a
// lazy object.
const lazyIdentity = <T>(value: T) =>
  ({ next: value, hasNext: true, done: false }) as const;

function flatImplementation(
  data: IterableContainer,
  depth = 1,
): IterableContainer {
  if (depth <= 0) {
    return data;
  }

  const output: Array<unknown> = [];

  for (const item of data) {
    if (Array.isArray(item)) {
      output.push(...flatImplementation(item, depth - 1));
    } else {
      output.push(item);
    }
  }

  return output;
}
