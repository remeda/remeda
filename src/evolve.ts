import { purry } from './purry';
import { toPairs } from './toPairs';

type AFunction = (...a: Array<any>) => any;
type Primitive = string | number | boolean | null | undefined | symbol;

/**
 * basic structure of `data` parameter and return of the function `evolve`.
 */
type NestedObject = Record<string, Primitive | object>;

/**
 * basic structure of `evolver` parameter of the function `evolve`.
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
 * Note: `[T] extends [Something] ? ...` is conditional type avoiding distributivity.
 * @example
 * interface Data {
 *   id: number;
 *   quartile: Array<number>;
 *   time?: { elapsed: number; remaining?: number };
 * }
 * type Nested = Evolver<Data>; // type Nested = {
 * //  id?: ((data: number) => any) | undefined;
 * //  quartile?: ((data: number[]) => any) | undefined;
 * //  time?:
 * //    | ((
 * //        data:
 * //          | {
 * //              elapsed: number;
 * //              remaining?: number | undefined;
 * //            }
 * //          | undefined
 * //      ) => any)
 * //    | {
 * //        elapsed?: ((data: number) => any) | undefined;
 * //        remaining?: ((data: number | undefined) => any) | undefined;
 * //      }
 * //    | undefined;
 * //};
 */
type Evolver<T> = [T] extends [Array<any>]
  ? (data: T) => any
  : T extends object
    ? {
        [K in keyof T]?:
          | ([T[K]] extends [Array<any>] ? never : (data: T[K]) => any)
          | Evolver<T[K]>;
      }
    : never;

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
 * Creates a new object by applying functions that is included in `evolver` object parameter
 * to the `data` object parameter according to their corresponding path.
 *
 * Functions included in `evolver` object will not be invoked
 * if its corresponding key does not exist in the `data` object.
 * Also, values included in `data` object will not be used
 * if its corresponding key does not exist in the `evolver` object.
 *
 * @param data object whose value is applied to the corresponding function
 * that is defined in `evolver` at the same path.
 * @param evolver object that include functions that is applied to
 * the corresponding value of `data` object at the same path.
 * @signature
 *    R.evolve(data, evolver)
 * @example
 *    const transf = {
 *      count: add(1),
 *      time: { elapsed: add(1), remaining: add(-1) },
 *    };
 *    const data = {
 *      id: 10,
 *      count: 10,
 *      time: { elapsed: 100, remaining: 1400 },
 *    };
 *    evolve(data, transf)
 *    // => {
 *    //   id: 10,
 *    //   count: 11,
 *    //   time: { elapsed: 101, remaining: 1399 },
 *    // }
 * @dataFirst
 * @category Object
 */
export function evolve<T, E extends Evolver<T>>(
  object: T,
  evolver: E
): Evolved<T, E>;

/**
 * Creates a new object by applying functions that is included in `evolver` object parameter
 * to the `data` object parameter according to their corresponding path.
 *
 * Functions included in `evolver` object will not be invoked
 * if its corresponding key does not exist in the `data` object.
 * Also, values included in `data` object will not be used
 * if its corresponding key does not exist in the `evolver` object.
 *
 * @param data object whose value is applied to the corresponding function
 * that is defined in `evolver` at the same path.
 * @param evolver object that include functions that is applied to
 * the corresponding value of `data` object at the same path.
 * @signature
 *    R.evolve(transf)(data)
 * @example
 *    const transf = {
 *      count: add(1),
 *      time: { elapsed: add(1), remaining: add(-1) },
 *    };
 *    const data = {
 *      id: 10,
 *      count: 10,
 *      time: { elapsed: 100, remaining: 1400 },
 *    };
 *    R.pipe(object, R.evolve(transf))
 *    // => {
 *    //   id: 10,
 *    //   count: 11,
 *    //   time: { elapsed: 101, remaining: 1399 },
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

function _evolve(data: NestedObject, evolver: EvolverStructure): NestedObject {
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
