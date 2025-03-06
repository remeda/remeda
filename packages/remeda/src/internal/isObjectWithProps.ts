import { isObjectType } from "../isObjectType";
import type { NarrowedTo } from "./types/NarrowedTo";

/**
 * Checks if the given parameter is an object with all of the given properties.
 *
 * TODO: Move this out of internal and add data-last signature?
 *
 * @param data - The variable to be checked.
 * @param props - The property or properties to check for.
 * @returns The input type with the given props guaranteed.
 * @signature
 *    R.isObjectType(data)
 * @example
 * @dataFirst
 * @category Guard
 */
export function isObjectWithProps<T, K extends PropertyKey>(
  data: T | object,
  props: K | ReadonlyArray<K>,
): data is NarrowedTo<T, Record<K, unknown>> {
  return isObjectType(data)
    ? Array.isArray(props)
      ? props.every((prop) => prop in data)
      : (props as K) in data
    : false;
}
