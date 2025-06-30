import type { EmptyObject, Simplify } from "type-fest";
import type { IsUnion } from "type-fest/source/internal";
import type { TupleParts } from "./internal/types/TupleParts";
import { purry } from "./purry";
import type { If } from "./internal/types/If";

type PickFromArray<
  T,
  Keys extends ReadonlyArray<keyof T>,
> = Keys extends readonly []
  ? EmptyObject
  : Simplify<
      Pick<T, ItemsByUnion<TupleParts<Keys>["required"]>["single"]> &
        Pick<T, ItemsByUnion<TupleParts<Keys>["suffix"]>["single"]> &
        Partial<Pick<T, ItemsByUnion<TupleParts<Keys>["required"]>["union"]>> &
        Partial<Pick<T, TupleParts<Keys>["item"]>> &
        Partial<Pick<T, ItemsByUnion<TupleParts<Keys>["suffix"]>["union"]>>
    >;

type ItemsByUnion<T, Single = never, Union = never> = T extends readonly [
  infer Head,
  ...infer Rest,
]
  ? If<
      IsUnion<Head>,
      ItemsByUnion<Rest, Single, Union | Head>,
      ItemsByUnion<Rest, Single | Head, Union>
    >
  : { single: Single; union: Union };

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
