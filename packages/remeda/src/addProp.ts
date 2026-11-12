import { purry3 } from "./internal/purryByArity";
import type { UpsertProp } from "./internal/types/UpsertProp";

/**
 * Add a new property to an object.
 *
 * The function doesn't do any checks on the input object. If the property
 * already exists it will be overwritten, and the type of the new value is not
 * checked against the previous type.
 *
 * Use `set` to override values explicitly with better protections.
 *
 * @param data - The target object.
 * @param prop - The property name.
 * @param value - The property value.
 * @signature
 *    addProp(data, prop, value)
 * @example
 *    addProp({firstName: 'john'}, 'lastName', 'doe') // => {firstName: 'john', lastName: 'doe'}
 * @dataFirst
 * @category Object
 */
export function addProp<T, K extends PropertyKey, V>(
  data: T,
  prop: K,
  value: V,
): UpsertProp<T, K, V>;

/**
 * Add a new property to an object.
 *
 * The function doesn't do any checks on the input object. If the property
 * already exists it will be overwritten, and the type of the new value is not
 * checked against the previous type.
 *
 * Use `set` to override values explicitly with better protections.
 *
 * @param prop - The property name.
 * @param value - The property value.
 * @signature
 *    addProp(prop, value)(data)
 * @example
 *    addProp('lastName', 'doe')({firstName: 'john'}) // => {firstName: 'john', lastName: 'doe'}
 * @dataLast
 * @category Object
 */
export function addProp<T, K extends PropertyKey, V>(
  prop: K,
  value: V,
): (data: T) => UpsertProp<T, K, V>;

export function addProp(
  dataOrProp: unknown,
  propOrValue?: unknown,
  value?: unknown,
): unknown {
  return purry3(
    addPropImplementation,
    arguments.length,
    dataOrProp,
    propOrValue,
    value,
  );
}

const addPropImplementation = <T, K extends PropertyKey, V>(
  data: T,
  prop: K,
  value: V,
): UpsertProp<T, K, V> =>
  // @ts-expect-error [ts2322] - Hard to type...
  ({ ...data, [prop]: value });
