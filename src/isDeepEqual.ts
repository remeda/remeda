import { purry } from "./purry";

/**
 * Performs a deep *semantic* comparison between two values to determine if they
 * are equivalent. For primitive values this is equivalent to `===`, for arrays
 * the check would be performed on every item recursively, in order, and for
 * objects all props will be compared recursively. The built-in Date and RegExp
 * are special-cased and will be compared by their values.
 * The result would be narrowed to the second value so that the function can be
 * used as a type guard.
 * @param data the first value to compare
 * @param other the second value to compare
 * @signature
 *    R.equals(a, b)
 * @example
 *    R.equals(1, 1) //=> true
 *    R.equals(1, '1') //=> false
 *    R.equals([1, 2, 3], [1, 2, 3]) //=> true
 * @dataFirst
 * @category Object
 */
export function isDeepEqual<T, S>(data: S | T, other: S): data is S;

/**
 * Returns true if its arguments are equivalent, false otherwise.
 * @param a the first object to compare
 * @param b the second object to compare
 * @signature
 *    R.equals(b)(a)
 * @example
 *    R.equals(1)(1) //=> true
 *    R.equals('1')(1) //=> false
 *    R.equals([1, 2, 3])([1, 2, 3]) //=> true
 * @dataLast
 * @category Object
 */
export function isDeepEqual<S>(other: S): <T>(data: S | T) => data is S;

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
