import { isArray } from "../isArray";

export function toReadonlyArray<T>(input: Iterable<T>): ReadonlyArray<T> {
  return isArray(input) ? input : [...input];
}
