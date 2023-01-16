import { purry } from './purry';
import {
  Path,
  PathString,
  StringToPath,
  stringToPathArray,
  SupportsValueAtPath,
  ValueAtPath,
} from './_paths';
import { Key } from './_types';
import { Narrow } from './_narrow';

/**
 * Sets the value at `path` of `object`. `path` can be an array or a path string.
 * @param obj the target method
 * @param path the property name
 * @param value the value to set
 * @signature
 *    R.setPath(obj, path, value)
 * @example
 *    R.setPath({ a: { b: 1 } }, ['a', 'b'], 2) // => { a: { b: 2 } }
 * @data_first
 * @category Object
 */
export function setPath<T, TPath extends Key[] & Path<T>>(
  object: T,
  path: Narrow<TPath>,
  value: ValueAtPath<T, TPath>
): T;

/**
 * Sets the value at `path` of `object`. `path` can be an array or a path string.
 * @param obj the target method
 * @param path the property name
 * @param value the value to set
 * @signature
 *    R.setPath(obj, path, value)
 * @example
 *    R.setPath({ a: { b: 1 } }, 'a.b', 2) // => { a: { b: 2 } }
 * @data_first
 * @category Object
 */
export function setPath<T, TPath extends PathString<T>>(
  object: T,
  path: TPath,
  value: ValueAtPath<T, StringToPath<TPath>>
): T;

/**
 * Sets the value at `path` of `object`. `path` can be an array or a path string.
 * @param obj the target method
 * @param path the property name
 * @param value the value to set
 * @signature
 *    R.setPath(obj, path, value)
 * @example
 *    R.pipe({ a: { b: 1 } }, R.setPath(['a', 'b'], 2)) // { a: { b: 2 } }
 * @data_first
 * @category Object
 */
export function setPath<TPath extends Key[], Value>(
  path: Narrow<TPath>,
  value: Value
): <Obj>(object: SupportsValueAtPath<Obj, TPath, Value>) => Obj;

/**
 * Sets the value at `path` of `object`. `path` can be an array or a path string.
 * @param obj the target method
 * @param path the property name
 * @param value the value to set
 * @signature
 *    R.setPath(obj, path, value)
 * @example
 *    R.pipe({ a: { b: 1 } }, R.setPath('a.b', 2)) // { a: { b: 2 } }
 * @data_first
 * @category Object
 */
export function setPath<TPath extends string, Value>(
  path: Narrow<TPath>,
  value: Value
): <Obj>(object: SupportsValueAtPath<Obj, StringToPath<TPath>, Value>) => Obj;

export function setPath() {
  return purry(_setPath, arguments);
}

function _setPath(object: any, path: any[] | string, defaultValue: any) {
  return _setPathNormalized(
    object,
    Array.isArray(path) ? path : stringToPathArray(path),
    defaultValue
  );
}

function _setPathNormalized(
  object: any,
  path: any[] | string,
  defaultValue: any
): any {
  if (path.length === 0) return defaultValue;

  if (Array.isArray(object)) {
    return object.map((item, index) => {
      if (index === path[0]) {
        return _setPathNormalized(item, path.slice(1), defaultValue);
      }
      return item;
    });
  }

  return {
    ...object,
    [path[0]]: _setPathNormalized(object[path[0]], path.slice(1), defaultValue),
  };
}
