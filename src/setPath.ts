import { purry } from "./purry";

type Path<T, Prefix extends ReadonlyArray<unknown> = readonly []> =
  T extends ReadonlyArray<unknown>
    ? Path<T[number], readonly [...Prefix, number]> | Prefix
    : T extends object
      ? PathsOfObject<T, Prefix> | Prefix
      : Prefix;

type PathsOfObject<T, Prefix extends ReadonlyArray<unknown>> = {
  [K in keyof T]-?: Path<T[K], readonly [...Prefix, K]>;
}[keyof T];

type ValueAtPath<T, TPath extends Path<T>> = TPath extends readonly [
  infer Head,
  ...infer Rest,
]
  ? Head extends keyof T
    ? Rest extends Path<T[Head]>
      ? ValueAtPath<T[Head], Rest>
      : never
    : never
  : T;

/**
 * Sets the value at `path` of `object`.
 *
 * @param data - The target method.
 * @param path - The array of properties.
 * @param value - The value to set.
 * @signature
 *    R.setPath(obj, path, value)
 * @example
 *    R.setPath({ a: { b: 1 } }, ['a', 'b'], 2) // => { a: { b: 2 } }
 * @dataFirst
 * @category Object
 */
export function setPath<T, TPath extends Path<T>>(
  data: T,
  path: TPath,
  value: ValueAtPath<T, TPath>,
): T;

/**
 * Sets the value at `path` of `object`.
 *
 * @param path - The array of properties.
 * @param value - The value to set.
 * @signature
 *    R.setPath(path, value)(obj)
 * @example
 *    R.pipe({ a: { b: 1 } }, R.setPath(['a', 'b'], 2)) // { a: { b: 2 } }
 * @dataLast
 * @category Object
 */
export function setPath<
  T,
  TPath extends Path<T>,
  Value extends ValueAtPath<T, TPath>,
>(path: TPath, value: Value): (data: T) => T;

export function setPath(...args: ReadonlyArray<unknown>): unknown {
  return purry(setPathImplementation, args);
}

export function setPathImplementation(
  data: unknown,
  path: ReadonlyArray<PropertyKey>,
  value: unknown,
): unknown {
  const [pivot, ...rest] = path;
  if (pivot === undefined) {
    return value;
  }

  if (Array.isArray(data)) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const copy = [...data];
    copy[pivot as number] = setPathImplementation(
      data[pivot as number],
      rest,
      value,
    );
    return copy;
  }

  if (data === null || data === undefined) {
    throw new Error("Path doesn't exist in object!");
  }

  const { [pivot]: currentValue, ...remaining } = data as Record<
    PropertyKey,
    unknown
  >;

  return {
    ...remaining,
    [pivot]: setPathImplementation(currentValue, rest, value),
  };
}
