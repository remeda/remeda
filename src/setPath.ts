import { purry } from "./purry";

type Path<T, Prefix extends ReadonlyArray<unknown> = []> =
  T extends ReadonlyArray<unknown>
    ? Path<T[number], [...Prefix, number]> | Prefix
    : T extends Record<PropertyKey, unknown>
      ? PathsOfObject<T, Prefix> | Prefix
      : Prefix;

type PathsOfObject<T, Prefix extends ReadonlyArray<unknown>> = {
  [K in keyof T]-?: Path<T[K], readonly [...Prefix, K]>;
}[keyof T];

type ValueAtPath<T, TPath> = TPath extends readonly [
  infer Head extends keyof T,
  ...infer Rest,
]
  ? ValueAtPath<T[Head], Rest>
  : T;

/**
 * Sets the value at `path` of `object`.
 *
 * For simple cases where the path is only one level deep, prefer `set` instead.
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
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters -- TODO: This is solvable by inlining Value and wrapping the T parameter with `NoInfer` (e.g. `ValueAtPath<NoInfer<T>, TPath>); to prevent typescript from inferring it as `unknown`. This is only available in TS 5.4, which is above what we currently support (5.1).
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

  const { [pivot]: currentValue, ...remaining } = data as Record<
    PropertyKey,
    unknown
  >;

  return {
    ...remaining,
    [pivot]: setPathImplementation(currentValue, rest, value),
  };
}
