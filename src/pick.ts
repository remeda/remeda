import type { Simplify } from "type-fest";
import type { TupleParts } from "./internal/types/TupleParts";
import { purry } from "./purry";

type PickFromArray<T, Keys extends ReadonlyArray<keyof T>> = Simplify<
  // The keys that are in the fixed parts of the Keys array will always be part
  // of the result.
  Pick<
    T,
    TupleParts<Keys>["required"][number] | TupleParts<Keys>["suffix"][number]
  > &
    // The keys in the optional parts of the Keys array might be part of the
    // result or not, so we need to make this part of the result partial to
    // reflect that.
    Partial<
      Pick<T, TupleParts<Keys>["optional"][number] | TupleParts<Keys>["item"]>
    >
>;

/**
 * Creates an object composed of the picked `data` properties.
 *
 * @param keys - The property names.
 * @signature R.pick([prop1, prop2])(object)
 * @example
 *    R.pipe({ a: 1, b: 2, c: 3, d: 4 }, R.pick(['a', 'd'])) // => { a: 1, d: 4 }
 * @dataLast
 * @category Object
 */
export function pick<
  T extends object,
  const Keys extends ReadonlyArray<keyof T>,
>(keys: Keys): (data: T) => PickFromArray<T, Keys>;

/**
 * Creates an object composed of the picked `data` properties.
 *
 * @param data - The target object.
 * @param keys - The property names.
 * @signature R.pick(object, [prop1, prop2])
 * @example
 *    R.pick({ a: 1, b: 2, c: 3, d: 4 }, ['a', 'd']) // => { a: 1, d: 4 }
 * @dataFirst
 * @category Object
 */
export function pick<
  T extends object,
  const Keys extends ReadonlyArray<keyof T>,
>(data: T, keys: Keys): PickFromArray<T, Keys>;

export function pick(...args: ReadonlyArray<unknown>): unknown {
  return purry(pickImplementation, args);
}

function pickImplementation<
  T extends object,
  Keys extends ReadonlyArray<keyof T>,
>(object: T, keys: Keys): PickFromArray<T, Keys> {
  const out: Partial<Pick<T, Keys[number]>> = {};
  for (const key of keys) {
    if (key in object) {
      out[key] = object[key];
    }
  }
  // @ts-expect-error [ts2322] - We build the type incrementally, there's no way to make typescript infer that we "finished" building the object and to treat it as such.
  return out;
}
