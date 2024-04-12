import { purry } from "./purry";

/**
 * Performs a deep *semantic* comparison between two values to determine if they
 * are equivalent. For primitive values this is equivalent to `===`, for arrays
 * the check would be performed on every item recursively, in order, and for
 * objects all props will be compared recursively. The built-in Date and RegExp
 * are special-cased and will be compared by their values.
 *
 * !IMPORTANT: Maps, Sets and TypedArrays, and symbol properties of objects  are
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
export function isDeepEqual<T, S extends T = T>(
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
 * !IMPORTANT: Maps, Sets and TypedArrays, and symbol properties of objects  are
 * not supported right now and might result in unexpected behavior. Please open
 * an issue in the Remeda github project if you need support for these types.
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
export function isDeepEqual<T, S extends T = T>(
  other: S,
): (data: T) => data is S;
export function isDeepEqual<T, S extends T = T>(
  other: T extends Exclude<T, S> ? S : never,
): (data: T) => boolean;

export function isDeepEqual(): unknown {
  return purry(isDeepEqualImplementation, arguments);
}

function isDeepEqualImplementation<T, S>(data: S | T, other: S): data is S {
  if (data === other) {
    return true;
  }

  if (typeof data === "number" && typeof other === "number") {
    // TODO: This is a temporary fix for NaN, we should use Number.isNaN once we bump our target above ES5.
    // eslint-disable-next-line no-self-compare -- We should use Number.isNaN here, but it's ES2015.
    return data !== data && other !== other;
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

  if (Array.isArray(data)) {
    if (data.length !== (other as ReadonlyArray<unknown>).length) {
      return false;
    }

    for (let i = 0; i < data.length; i++) {
      if (
        !isDeepEqualImplementation(
          data[i],
          (other as ReadonlyArray<unknown>)[i],
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

  // At this point we only know that the 2 objects share a prototype and are not
  // any of the previous types. They could be plain objects (Object.prototype),
  // they could be classes, they could be other built-ins, or they could be
  // something weird. We assume that comparing values by keys is enough to judge
  // their equality.

  const keys = Object.keys(data);

  if (keys.length !== Object.keys(other).length) {
    return false;
  }

  for (const key of keys) {
    if (!Object.prototype.hasOwnProperty.call(other, key)) {
      return false;
    }

    // @ts-expect-error [ts7053] - There's no easy way to tell typescript these keys are safe.
    if (!isDeepEqualImplementation(data[key], other[key])) {
      return false;
    }
  }

  return true;
}
