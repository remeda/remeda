import type { Simplify } from "type-fest";
import { purry1 } from "./internal/purryByArity";
import type { ToString } from "./internal/types/ToString";

type Inverted<T extends object> = Simplify<{
  -readonly [
    K in keyof T as K extends number | string
      ? Required<T>[K] extends PropertyKey
        ? Required<T>[K]
        : never
      : never
  ]: ToString<K>;
}>;

/**
 * Returns an object whose keys and values are swapped. If the object contains duplicate values,
 * subsequent values will overwrite previous values.
 *
 * @param data - The object.
 * @signature
 *    invert(data)
 * @example
 *    invert({ a: "d", b: "e", c: "f" }) // => { d: "a", e: "b", f: "c" }
 * @dataFirst
 * @category Object
 */
export function invert<T extends object>(data: T): Inverted<T>;

/**
 * Returns an object whose keys and values are swapped. If the object contains duplicate values,
 * subsequent values will overwrite previous values.
 *
 * @signature
 *    invert()(data)
 * @example
 *    pipe({ a: "d", b: "e", c: "f" }, invert()); // => { d: "a", e: "b", f: "c" }
 * @dataLast
 * @category Object
 */
export function invert<T extends object>(): (data: T) => Inverted<T>;

export function invert(data?: object): unknown {
  return purry1(invertImplementation, arguments.length, data);
}

function invertImplementation(
  data: Readonly<Record<PropertyKey, PropertyKey>>,
): Record<PropertyKey, PropertyKey> {
  const result: Record<PropertyKey, PropertyKey> = {};

  for (const entry of Object.entries(data)) {
    const key = entry[0];
    const value = entry[1];
    if (value === "__proto__") {
      // We want `__proto__` to act just like any other key, but assigning it
      // runs the setter inherited from `Object.prototype` instead of creating
      // a property. Defining it directly creates the same own data property
      // that assigning creates for all *other* keys.
      Object.defineProperty(result, "__proto__", {
        value: key,
        configurable: true,
        enumerable: true,
        writable: true,
      });
    } else {
      result[value] = key;
    }
  }

  return result;
}
