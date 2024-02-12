import { purry } from './purry';
import { isObject } from './isObject';
import { isArray } from './isArray';

type AFunction = (...a: Array<any>) => any;

/**
 * @example
 * type ab = Keys<{a: undefined},{ b: undefined}> // type ab = "a" | "b"
 * type a = Keys<{a: undefined}> // type ab = "a"
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

type _SomeElmIsDefined<A extends [...params: any]> = {
  [K in Keys<A> as undefined extends GetValueByKey<A, K>
    ? never
    : 'TRUE']: true;
};

/**
 * @example
 * type True = SomeElmIsDefined<[undefined | string, string]>; // type True = true
 * type True = SomeElmIsDefined<[string, undefined | string]>; // type True = true
 * type True = SomeElmIsDefined<[string, string]>; // type True = true
 * type False = SomeElmIsDefined<[undefined | string, undefined | string]>; // type False = false
 */
type SomeElmIsDefined<A extends Array<any>> = GetValueByKey<
  _SomeElmIsDefined<A>,
  'TRUE',
  false
>;

/**
 * @example
 * type False = AllElmAreUndefinable<[undefined | string, string]>; // type False = false
 * type False = AllElmAreUndefinable<[string, undefined | string]>; // type False = false
 * type False = AllElmAreUndefinable<[string, string]>; // type False = false
 * type True = AllElmAreUndefinable<[undefined | string, undefined | string]>; // type True = true
 */
type AllElmAreUndefinable<A extends Array<any>> =
  SomeElmIsDefined<A> extends true ? false : true;

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
  ? Rest['length'] extends 0
    ? Ret
    : AllElmAreUndefinable<Rest> extends true
      ? Ret
      : never
  : never;

/**
 * Creates an assumed object type from the type of the `transformations` argument of `evolve`.
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
 * Creates return type from the type of arguments of `evolve`.
 */
type Evolve<T, E> = E extends AFunction
  ? ReturnType<E>
  : T extends object
    ? {
        [K in Keys<T, E> as GetValueByKey<T, K> extends never
          ? never
          : K]: Evolve<
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
 * the corresponding function that is defined in `transformations` at the same path.
 * @param transformations it is object or array in which the functions at some path is applied to
 * the corresponding value of `object` at the same path.
 * @signature
 *    R.evolve(object, transformations)
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
export function evolve<T extends EvolveTargetObject<E>, E>(
  object: T,
  transformations: E
): Evolve<T, E>;

/**
 * Creates a new object by recursively evolving a shallow copy of `object`,
 * according to the `transformation` functions. All non-primitive properties
 * are copied by reference.
 *
 * A `transformation` function will not be invoked if its corresponding key
 * does not exist in the evolved object.

 * @param object object or array whose value at some path is applied to
 * the corresponding function that is defined in `transformations` at the same path.
 * @param transformations it is object or array in which the functions at some path is applied to
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
  transformations: E
): <T extends EvolveTargetObject<E>>(object: T) => Evolve<T, E>;

export function evolve() {
  return purry(_evolve, arguments);
}

function _evolve(data: any, transformations: any) {
  if (!isObject(data) && !isArray(data)) {
    return data;
  }
  const result: Record<string, any> = Array.isArray(data) ? [] : {};
  let transformation, key, type;
  for (key in data) {
    transformation = transformations[key];
    type = typeof transformation;
    result[key] =
      type === 'function'
        ? transformation(data[key])
        : transformation && type === 'object'
          ? _evolve(data[key], transformation)
          : data[key];
  }
  return result;
}
