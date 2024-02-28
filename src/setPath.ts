import { Narrow } from './_narrow';
import { Path, SupportsValueAtPath, ValueAtPath } from './_paths';
import { purry } from './purry';

/**
 * Sets the value at `path` of `object`.
 * @param object the target method
 * @param path the array of properties
 * @param value the value to set
 * @signature
 *    R.setPath(obj, path, value)
 * @example
 *    R.setPath({ a: { b: 1 } }, ['a', 'b'], 2) // => { a: { b: 2 } }
 * @dataFirst
 * @category Object
 */
export function setPath<T, TPath extends Array<PropertyKey> & Path<T>>(
  object: T,
  path: Narrow<TPath>,
  value: ValueAtPath<T, TPath>
): T;

/**
 * Sets the value at `path` of `object`.
 * @param obj the target method
 * @param path the array of properties
 * @param value the value to set
 * @signature
 *    R.setPath(path, value)(obj)
 * @example
 *    R.pipe({ a: { b: 1 } }, R.setPath(['a', 'b'], 2)) // { a: { b: 2 } }
 * @dataLast
 * @category Object
 */
export function setPath<TPath extends Array<PropertyKey>, Value>(
  path: Narrow<TPath>,
  value: Value
): <Obj>(object: SupportsValueAtPath<Obj, TPath, Value>) => Obj;

export function setPath() {
  return purry(_setPath, arguments);
}

export function _setPath(
  data: unknown,
  path: ReadonlyArray<PropertyKey>,
  value: unknown
): unknown {
  const [current, ...rest] = path;
  if (current === undefined) {
    return value;
  }

  if (Array.isArray(data)) {
    return data.map((item: unknown, index) =>
      index === current ? _setPath(item, rest, value) : item
    );
  }

  if (data === null || data === undefined) {
    throw new Error("Path doesn't exist in object!");
  }

  return {
    ...data,
    [current]: _setPath(
      (data as Record<PropertyKey, unknown>)[current],
      rest,
      value
    ),
  };
}
