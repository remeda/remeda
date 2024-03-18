import { purry } from "./purry";
import type {
  AllUnionKeys,
  WithPropOfType,
  AllPossiblePropValues,
  PlainObject,
  EnsureExtends,
} from "./_objectProps";
import { hasProp } from "./hasProp";

/**
 * Determines if an object or array has a property with the specified key that satisfies the predicate.
 * Will first check if the property exists, then if it is not undefined,
 * and lastly if the predicate returns true.
 *
 * @param key the property key to look for
 * @param predicate the predicate to satisfy.
 * @returns true if the object has the property and the predicate returns true, false otherwise
 * @signature
 *    R.hasProp(key, predicate)(obj)
 * @example
 *    [{ type: "foo" }, { type: "bar" }].filter(
 *     R.hasPropSatisfying("type", R.isEqual("foo"))
 *    ) // => [{ type: "foo" }]
 * @dataLast
 * @category Guard
 */
export function hasPropSatisfying<
  Obj extends PlainObject,
  Prop extends AllUnionKeys<Obj>,
  AfterPredicate extends AllPossiblePropValues<Obj, Prop>,
>(
  key: Prop,
  predicate: (prop: AllPossiblePropValues<Obj, Prop>) => prop is AfterPredicate,
): (
  obj: Obj,
) => obj is EnsureExtends<Obj, WithPropOfType<Obj, Prop, AfterPredicate>>;

/**
 * Determines if an object or array has a property with the specified key that satisfies the predicate.
 * Will first check if the property exists, then if it is not undefined,
 * and lastly if the predicate returns true.
 *
 * @param obj the object
 * @param key the property key to look for
 * @param predicate the predicate to satisfy.
 * @returns true if the object has the property and the predicate returns true, false otherwise
 * @signature
 *    R.hasProp(obj, key, predicate)
 * @example
 *    R.hasPropSatisfying({ type: "foo" }, "type", R.isEqual("foo")) // => true
 * @dataFirst
 * @category Guard
 */
export function hasPropSatisfying<
  Obj extends PlainObject,
  Prop extends AllUnionKeys<Obj>,
  AfterPredicate extends AllPossiblePropValues<Obj, Prop>,
>(
  obj: Obj,
  key: Prop,
  predicate: (prop: AllPossiblePropValues<Obj, Prop>) => prop is AfterPredicate,
): obj is EnsureExtends<Obj, WithPropOfType<Obj, Prop, AfterPredicate>>;

export function hasPropSatisfying(): unknown {
  return purry(hasPropSatisfyingImplementation, arguments);
}

function hasPropSatisfyingImplementation<
  Obj extends PlainObject,
  Prop extends AllUnionKeys<Obj>,
  AfterPredicate extends AllPossiblePropValues<Obj, Prop>,
>(
  obj: Obj,
  key: Prop,
  predicate: (prop: AllPossiblePropValues<Obj, Prop>) => prop is AfterPredicate,
): obj is EnsureExtends<Obj, WithPropOfType<Obj, Prop, AfterPredicate>> {
  if (!hasProp(obj, key)) {
    return false;
  }
  const value = obj[key] as AllPossiblePropValues<Obj, Prop>;
  return predicate(value);
}
