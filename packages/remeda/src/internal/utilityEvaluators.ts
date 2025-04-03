import { isArray } from "../isArray";
import type { ArrayMethodCallback } from "./types/ArrayMethodCallback";

export function* mapCallback<T, U>(
  data: Iterable<T>,
  callbackfn: ArrayMethodCallback<ReadonlyArray<T>, U>,
): Iterable<[T, U]> {
  let index = 0;
  let writableData: Array<T> | undefined;
  const dataArg: ReadonlyArray<T> = isArray(data) ? data : (writableData = []);
  for (const value of data) {
    if (writableData !== undefined) {
      writableData.push(value);
    }
    yield [value, callbackfn(value, index++, dataArg)];
  }
}
