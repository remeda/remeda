import type { Simplify } from "type-fest";
import { purry } from "./purry";
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
 * @param object - The object.
 * @signature
 *    invert(object)
 * @example
 *    invert({ a: "d", b: "e", c: "f" }) // => { d: "a", e: "b", f: "c" }
 * @dataFirst
 * @category Object
 */
export function invert<T extends object>(object: T): Inverted<T>;

/**
 * Returns an object whose keys and values are swapped. If the object contains duplicate values,
 * subsequent values will overwrite previous values.
 *
 * @signature
 *    invert()(object)
 * @example
 *    pipe({ a: "d", b: "e", c: "f" }, invert()); // => { d: "a", e: "b", f: "c" }
 * @dataLast
 * @category Object
 */
export function invert<T extends object>(): (object: T) => Inverted<T>;

export function invert(...args: readonly unknown[]): unknown {
  return purry(invertImplementation, args);
}

function invertImplementation(
  data: Readonly<Record<PropertyKey, PropertyKey>>,
): Record<PropertyKey, PropertyKey> {
  const result: Record<PropertyKey, PropertyKey> = {};

  for (const [key, value] of Object.entries(data)) {
    // `__proto__` is the one key with an inherited setter, so assigning it
    // would replace the prototype instead of defining an own property.
    if (value === "__proto__") {
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
