import { purry } from "./purry";
import type {
  AllUnionKeys,
  EnsureExtends,
  PlainObject,
  WithRequiredProp,
} from "./_objectProps";

/**
 * Determines if an object or array has a property with the specified key.
 * Will first check if the property exists, then if it is not undefined.
 *
 * @param key the property key to look for
 * @returns true if the object has the property, false otherwise
 * @signature
 *    R.hasProp(key)(obj)
 * @example
 *    [{ id: 1 }, { id: 2, completedAt: new Date() }].filter(
 *      R.hasProp('completedAt'),
 *    ) // => [{ id: 2, completedAt: new Date() }]
 * @example
 *    [[1], [1, 2]].filter(
 *      R.hasProp(1),
 *    ) // => [[1, 2]]
 * @dataLast
 * @category Guard
 */
export function hasProp<
  Obj extends PlainObject,
  Prop extends AllUnionKeys<Obj>,
>(
  key: Prop,
): (obj: Obj) => obj is EnsureExtends<Obj, WithRequiredProp<Obj, Prop>>;

/**
 * Determines if an object has a property with the specified key.
 * Will first check if the property exists, then if it is not undefined.
 *
 * @param obj the object
 * @param key the property key to look for
 * @returns true if the object has the property, false otherwise
 * @signature
 *    R.hasProp(obj, key);
 * @example
 *    R.hasProp({ id: 1 }, 'id') // => true
 * @example
 *   R.hasProp([0, 1, 2], 3) // => false
 * @dataFirst
 * @category Guard
 */
export function hasProp<
  Obj extends PlainObject,
  Prop extends AllUnionKeys<Obj>,
>(obj: Obj, key: Prop): obj is EnsureExtends<Obj, WithRequiredProp<Obj, Prop>>;

export function hasProp(...args: Array<any>): any {
  return purry(hasPropImpl, args);
}

function hasPropImpl<Obj extends object, Prop extends AllUnionKeys<Obj>>(
  obj: Obj,
  key: Prop,
) {
  return key in obj && obj[key] !== undefined;
}
