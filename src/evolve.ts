import { purry } from './purry';
import { toPairs } from './toPairs';

type AFunction = (...a: Array<any>) => any;
type Primitive = string | number | boolean | null | undefined | symbol;

/**
 * basic structure of `data` parameter.
 */
type NestedObject = Record<string, Primitive | object>;

/**
 * basic structure of `evolver` parameter.
 */
type EvolverStructure = Readonly<
  Record<string, ((data: unknown) => unknown) | object | null | undefined>
>;

/**
 * @example
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
 * But get `never` if the function take two or more required parameters.
 * @example
 * type Number = GetFirstParam<(arg1: number) => void>; // type Number = number
 * type Number = GetFirstParam<(arg1: number, arg2?: number) => void>; // type Number = number
 * type Number = GetFirstParam< (arg1: number, arg2?: number, arg3?: number) => void >; // type Number = number
 * type Never = GetFirstParam<(arg1: number, arg2: number | undefined) => void>; // type Never = never
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
 * Creates an assumed `data` type from the type of the `evolver` argument.
 * @example
 * type Number = EvolveTarget<(arg1: number) => void>; // type Number = number
 * type Nested = EvolveTarget<{
 *   num: (arg1: number) => void;
 *   obj: {
 *    num: (arg1: number) => void
 *   }
 *   notFunc: null
 * }>;
 * // type Nested = {
 * //     num?: number | undefined;
 * //     obj?: {
 * //         num?: number | undefined;
 * //     } | undefined;
 * // }
 */
type EvolveTarget<E> = E extends AFunction
  ? GetFirstParam<E>
  : E extends object
    ? {
        [K in keyof E as E[K] extends AFunction
          ? K
          : E[K] extends object
            ? K
            : never]?: EvolveTarget<E[K]>;
      }
    : never;

/**
 * Creates an assumed `evolver` type from the type of `data` argument.
 * @example
 * interface Data {
 *   id: number;
 *   size: { width: number; height?: number };
 * }
 * declare const evolver: Evolver<Data>;
 * type ID = typeof evolver.id; // type ID =  ((data: number) => any) | undefined
 * type Size = typeof evolver.size  // type Size =
 * //   | {
 * //       width?: ((data: number) => any) | undefined;
 * //       height?: ((data: number | undefined) => any) | undefined;
 * //     }
 * //   | ((data: { width: number; height?: number | undefined }) => any)
 * //   | undefined;
 */
type Evolver<T> =
  T extends Array<any>
    ? (data: T) => any
    : T extends object
      ? {
          [K in keyof T]?: Evolver<T[K]> | ((data: T[K]) => any);
        }
      : (data: T) => any;

/**
 * Creates return type from the type of arguments of `evolve`.
 */
type Evolved<T, E> = E extends AFunction
  ? ReturnType<E>
  : T extends object
    ? {
        [K in keyof T]: Evolved<T[K], GetValueByKey<E, K, T[K]>>;
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
export function evolve<T extends NestedObject, E extends Evolver<T>>(
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
export function evolve<E extends EvolverStructure>(
  evolver: E
): <T extends EvolveTarget<E>>(object: T) => Evolved<T, E>;

export function evolve() {
  return purry(_evolve, arguments);
}

function _evolve(data: NestedObject, evolver: EvolverStructure) {
  if (typeof data !== 'object' || data === null) {
    return data; // Dead logic if the type is followed.
  }

  const dataKeys = Object.keys(data);

  return toPairs.strict(evolver).reduce<NestedObject>(
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
        result[key] as NestedObject,
        value as EvolverStructure
      );
      return result;
    },
    { ...data }
  );
}
