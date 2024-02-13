import { purry } from './purry';
import { toPairs } from './toPairs';

type AFunction = (...a: Array<any>) => any;

/**
 * @example
 * type ab = Keys<{a: undefined }, { b: undefined }> // type ab = "a" | "b"
 * type a = Keys<{a: undefined }> // type a = "a"
 */
type Keys<T, E = []> = Exclude<keyof T | keyof E, keyof []>;

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
  Default = never,
> = K extends keyof T ? T[K] : Default;

/**
 * Get the type of first parameter.
 * But get `never` if the function's the second and subsequent parameters do not take `undefined`.
 * @example
 * type Number = GetFirstParam<(arg1: number) => void>; // type Number = number
 * type Number = GetFirstParam<(arg1: number, arg2?: number) => void>; // type Number = number
 * type Number = GetFirstParam< (arg1: number, arg2?: number, arg3?: number) => void >; // type Number = number
 * type Number = GetFirstParam<(arg1: number, arg2: number | undefined) => void>; // type Number = number
 * type Never = GetFirstParam<(arg1: number, arg2: number) => void>; // type Never = never
 * type Never = GetFirstParam<(arg1: number, arg2: number, arg3?: number) => void>; // type Never = never
 * type Never = GetFirstParam<(arg1: number, arg2: number|undefined, arg3: number) => void>; // type Never = never
 */
type GetFirstParam<T extends AFunction> = T extends (
  firstArg: infer Ret,
  ...restArgs: infer Rest
) => any
  ? 0 extends Rest['length']
    ? Ret
    : never
  : never;

/**
 * Creates an assumed object type from the type of the `evolver` argument of `evolve`.
 * @example
 * type Number = EvolveTargetObject<(arg1: number) => void>; // type Number = number
 * type Nested = EvolveTargetObject<{
 *   num: (arg1: number) => void;
 *   obj: {
 *    num: (arg1: number) => void
 *   }
 *   ary: [(arg1: number) => void, (arg1: number) => void]
 *   notFunc: 'test'
 * }>;
 * // type Nested = {
 * //   num?: number | undefined;
 * //   obj?: {
 * //       num?: number | undefined;
 * //   } | undefined;
 * //   ary?: {
 * //       0?: number | undefined;
 * //       1?: number | undefined;
 * //   } | undefined;
 * // }
 */
type EvolveTargetObject<E> = E extends AFunction
  ? GetFirstParam<E>
  : E extends object
    ? {
        [K in Keys<E> as GetValueByKey<E, K> extends never
          ? never
          : GetValueByKey<E, K> extends AFunction
            ? K
            : GetValueByKey<E, K> extends object
              ? K
              : never]?: EvolveTargetObject<GetValueByKey<E, K>>;
      }
    : never;

/**
 * Creates evolver type from the type of `data` argument.
 */
type Evolver<T> =
  T extends Array<any>
    ? (data: T) => any
    : T extends object
      ? {
          [K in Keys<T>]?:
            | Evolver<GetValueByKey<T, K>>
            | ((data: GetValueByKey<T, K>) => any);
        }
      : (data: T) => any;

/**
 * Creates return type from the type of arguments of `evolve`.
 */
type Evolved<T, E> = E extends AFunction
  ? ReturnType<E>
  : T extends object
    ? {
        [K in Keys<T, E> as GetValueByKey<T, K> extends never
          ? never
          : K]: Evolved<
          GetValueByKey<T, K>,
          GetValueByKey<E, K, GetValueByKey<T, K>>
        >;
      }
    : T;

/**
 * Creates a new object by recursively evolving a shallow copy of `object`,
 * according to the `transformation` functions. All non-primitive properties
 * are copied by reference.
 *
 * A `transformation` function will not be invoked if its corresponding key
 * does not exist in the evolved object.

 * @param object object or array whose value at some path is applied to
 * the corresponding function that is defined in `evolver` at the same path.
 * @param evolver it is object or array in which the functions at some path is applied to
 * the corresponding value of `object` at the same path.
 * @signature
 *    R.evolve(object, evolver)
 * @example
 *    const transf = {
 *      count: add(1),
 *      data: { elapsed: add(1), remaining: add(-1) },
 *    };
 *    const object = {
 *      id: 10,
 *      count: 10,
 *      data: { elapsed: 100, remaining: 1400 },
 *    };
 *    evolve(object, transf)
 *    // => {
 *    //   id: 10,
 *    //   count: 11,
 *    //   data: { elapsed: 101, remaining: 1399 },
 *    // }
 * @dataFirst
 * @category Object
 */
export function evolve<T, E extends Evolver<T>>(
  object: T,
  evolver: E
): Evolved<T, E>;

/**
 * Creates a new object by recursively evolving a shallow copy of `object`,
 * according to the `transformation` functions. All non-primitive properties
 * are copied by reference.
 *
 * A `transformation` function will not be invoked if its corresponding key
 * does not exist in the evolved object.

 * @param object object or array whose value at some path is applied to
 * the corresponding function that is defined in `evolver` at the same path.
 * @param evolver it is object or array in which the functions at some path is applied to
 * the corresponding value of `object` at the same path.
 * @signature
 *    R.evolve(transf)(object)
 * @example
 *    const transf = {
 *      count: add(1),
 *      data: { elapsed: add(1), remaining: add(-1) },
 *    };
 *    const object = {
 *      id: 10,
 *      count: 10,
 *      data: { elapsed: 100, remaining: 1400 },
 *    };
 *    R.pipe(object, R.evolve(transf))
 *    // => {
 *    //   id: 10,
 *    //   count: 11,
 *    //   data: { elapsed: 101, remaining: 1399 },
 *    // }
 * @dataLast
 * @category Object
 */
export function evolve<E>(
  evolver: E
): <T extends EvolveTargetObject<E>>(object: T) => Evolved<T, E>;

export function evolve() {
  return purry(_evolve, arguments);
}

// define a helper type just for the implementation.
type Primitive = string | number | boolean | null | undefined | symbol;
type PlainObject = Record<string, Primitive | object>;
type Nil = null | undefined;
type EvolverStructure = Readonly<
  Record<string, ((data: unknown) => unknown) | object | Nil>
>;

function _evolve(data: PlainObject, evolver: EvolverStructure) {
  if (typeof data !== 'object' || data === null) {
    return data; // Dead logic if the type is followed.
  }

  const dataKeys = Object.keys(data);

  return toPairs.strict(evolver).reduce<PlainObject>(
    (result, [key, value]) => {
      if (dataKeys.indexOf(key) === -1) {
        return result;
      }
      if (typeof value === 'function') {
        result[key] = value(result[key]);
        return result;
      }
      if (value === null || value === undefined) {
        return result;
      }
      result[key] = _evolve(
        result[key] as PlainObject,
        value as EvolverStructure
      );
      return result;
    },
    { ...data }
  );
}
