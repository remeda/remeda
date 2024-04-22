import { purry } from "./purry";

/**
 * Performs a deep *semantic* comparison between two values to determine if they
 * are equivalent. For primitive values this is equivalent to `===`, for arrays
 * the check would be performed on every item recursively, in order, and for
 * objects all props will be compared recursively. The built-in Date and RegExp
 * are special-cased and will be compared by their values.
 *
 * !IMPORTANT: TypedArrays and symbol properties of objects are
 * not supported right now and might result in unexpected behavior. Please open
 * an issue in the Remeda github project if you need support for these types.
 *
 * The result would be narrowed to the second value so that the function can be
 * used as a type guard.
 *
 * @param data - The first value to compare.
 * @param other - The second value to compare.
 * @signature
 *    R.isDeepEqual(data, other)
 * @example
 *    R.isDeepEqual(1, 1) //=> true
 *    R.isDeepEqual(1, '1') //=> false
 *    R.isDeepEqual([1, 2, 3], [1, 2, 3]) //=> true
 * @dataFirst
 * @category Guard
 */
export function isDeepEqual<T, S extends T>(
  data: T,
  other: T extends Exclude<T, S> ? S : never,
): data is S;
export function isDeepEqual<T, S extends T = T>(data: T, other: S): boolean;

/**
 * Performs a deep *semantic* comparison between two values to determine if they
 * are equivalent. For primitive values this is equivalent to `===`, for arrays
 * the check would be performed on every item recursively, in order, and for
 * objects all props will be compared recursively. The built-in Date and RegExp
 * are special-cased and will be compared by their values.
 *
 * !IMPORTANT: Sets, TypedArrays, and symbol properties of objects are not
 * supported right now and might result in unexpected behavior. Please open an
 * issue in the Remeda github project if you need support for these types.
 *
 * The result would be narrowed to the second value so that the function can be
 * used as a type guard.
 *
 * @param other - The second value to compare.
 * @signature
 *    R.isDeepEqual(other)(data)
 * @example
 *    R.pipe(1, R.isDeepEqual(1)); //=> true
 *    R.pipe(1, R.isDeepEqual('1')); //=> false
 *    R.pipe([1, 2, 3], R.isDeepEqual([1, 2, 3])); //=> true
 * @dataLast
 * @category Guard
 */
export function isDeepEqual<T, S extends T>(
  other: T extends Exclude<T, S> ? S : never,
): (data: T) => data is S;
export function isDeepEqual<S>(other: S): <T extends S = S>(data: T) => boolean;

export function isDeepEqual(...args: ReadonlyArray<unknown>): unknown {
  return purry(isDeepEqualImplementation, args);
}

function isDeepEqualImplementation<T, S>(data: S | T, other: S): data is S {
  if (data === other) {
    return true;
  }

  if (Object.is(data, other)) {
    // We want to ignore the slight differences between `===` and `Object.is` as
    // both of them largely define equality from a semantic point-of-view.
    return true;
  }

  if (typeof data !== "object" || typeof other !== "object") {
    return false;
  }

  if (data === null || other === null) {
    return false;
  }

  if (Object.getPrototypeOf(data) !== Object.getPrototypeOf(other)) {
    // If the objects don't share a prototype it's unlikely that they are
    // semantically equal. It is technically possible to build 2 prototypes that
    // act the same but are not equal (at the reference level, checked via
    // `===`) and then create 2 objects that are equal although we would fail on
    // them. Because this is so unlikely, the optimization we gain here for the
    // rest of the function by assuming that `other` is of the same type as
    // `data` is more than worth it.
    return false;
  }

  if (data instanceof Set) {
    return isDeepEqualSets(data, other as unknown as Set<unknown>);
  }

  if (Array.isArray(data)) {
    if (data.length !== (other as ReadonlyArray<unknown>).length) {
      return false;
    }

    for (const [index, item] of data.entries()) {
      if (
        !isDeepEqualImplementation(
          item,
          (other as ReadonlyArray<unknown>)[index],
        )
      ) {
        return false;
      }
    }

    return true;
  }

  if (data instanceof Date) {
    return data.getTime() === (other as unknown as Date).getTime();
  }

  if (data instanceof RegExp) {
    return data.toString() === (other as unknown as RegExp).toString();
  }

  if (data instanceof Map) {
    return isDeepEqualMaps(data, other as unknown as Map<unknown, unknown>);
  }

  // At this point we only know that the 2 objects share a prototype and are not
  // any of the previous types. They could be plain objects (Object.prototype),
  // they could be classes, they could be other built-ins, or they could be
  // something weird. We assume that comparing values by keys is enough to judge
  // their equality.

  if (Object.keys(data).length !== Object.keys(other).length) {
    return false;
  }

  for (const [key, value] of Object.entries(data)) {
    if (!(key in other)) {
      return false;
    }

    if (
      !isDeepEqualImplementation(
        value,
        // @ts-expect-error [ts7053] - We already checked that `other` has `key`
        other[key],
      )
    ) {
      return false;
    }
  }

  return true;
}

function isDeepEqualMaps(
  data: ReadonlyMap<unknown, unknown>,
  other: ReadonlyMap<unknown, unknown>,
): boolean {
  if (data.size !== other.size) {
    return false;
  }

  for (const [key, value] of data.entries()) {
    if (!other.has(key)) {
      return false;
    }

    if (!isDeepEqualImplementation(value, other.get(key))) {
      return false;
    }
  }

  return true;
}

function isDeepEqualSets(
  data: ReadonlySet<unknown>,
  other: ReadonlySet<unknown>,
): boolean {
  if (data.size !== other.size) {
    return false;
  }

  // TODO: Once we bump our typescript target we can iterate over the map keys and values directly.
  const dataArr = Array.from(data.values());
  const otherArr = Array.from(other.values());

  for (const dataItem of dataArr) {
    let isFound = false;

    for (let i = 0; i < otherArr.length; i++) {
      if (isDeepEqualImplementation(dataItem, otherArr[i])) {
        isFound = true;
        otherArr.splice(i, 1);
        break;
      }
    }
    if (!isFound) {
      return false;
    }
  }

  return true;
}
