import { purry } from './purry';
import { isObject } from './isObject';
import { isArray } from './isArray';

type AFunction = (...a: Array<any>) => any;

/**
 * @example
 * type ab = Keys<{a: undefined},{ b: undefined}> // type ab = "a" | "b"
 */
type Keys<T, E> = Exclude<keyof T | keyof E, keyof []>;

/**
 * @example
 * type A = GetValueByKey<['A', 'B'], '0'>; // type A = "A"
 * type B = GetValueByKey<['A', 'B'], '1'>; // type B = "B"
 * type C = GetValueByKey<['A', 'B'], '2', 'C'>; // type C = "C"
 * type T1 = GetValueByKey<{ A: '1', B: '2' }, 'A'>; // type T1 = "1"
 * type T2 = GetValueByKey<{ A: '1', B: '2' }, 'B'>; // type T2 = "2"
 * type T3 = GetValueByKey<{ A: '1', B: '2' }, 'C', '3'>; // type T3 = "3"
 */
type GetValueByKey<
  T,
  K extends PropertyKey,
  Default = never
> = K extends keyof T ? T[K] : Default;

type Evolve<T, E> = E extends AFunction
  ? ReturnType<E>
  : T extends object
  ? {
      [K in Keys<T, E> as GetValueByKey<
        T,
        K
      > extends never
        ? never
        : K]: Evolve<
        GetValueByKey<T, K>,
        GetValueByKey<E, K, GetValueByKey<T, K>>
      >;
    }
  : T;

export function evolve<const T, const E>(object: T, transformations: E): Evolve<T, E>;

export function evolve<const E>(transformations: E): <const T>(object: T) => Evolve<T, E>;

export function evolve() {
  return purry(_evolve, arguments);
}

/**
 * Creates a new object by recursively evolving a shallow copy of `object`,
 * according to the `transformation` functions. All non-primitive properties
 * are copied by reference.
 *
 * A `transformation` function will not be invoked if its corresponding key
 * does not exist in the evolved object.
 */
function _evolve(object: any, transformations: any) {
  if (!isObject(object) && !isArray(object)) {
    return object;
  }
  const result: Record<string, any> = object instanceof Array ? [] : {};
  let transformation, key, type;
  for (key in object) {
    transformation = transformations[key];
    type = typeof transformation;
    result[key] =
      type === 'function'
        ? transformation(object[key])
        : transformation && type === 'object'
        ? _evolve(object[key], transformation)
        : object[key];
  }
  return result;
}
