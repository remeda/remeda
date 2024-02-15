import { purry } from './purry';
import { toPairs } from './toPairs';

/**
 * basic structure of `evolver` parameter of the function `evolve`.
 */
type GenericEvolver = {
  readonly [P in string]: ((data: unknown) => unknown) | GenericEvolver;
};

/**
 * Creates an assumed `evolver` type from the type of `data` argument.
 * @example
 * interface Data {
 *   id: number;
 *   quartile: Array<number>;
 *   time?: { elapsed: number; remaining?: number };
 * }
 * type Nested = Evolver<Data>; //  => type Nested = {
 * //   id?: ((data: number) => unknown) | undefined;
 * //   quartile?: ((data: number[]) => unknown) | undefined;
 * //   time?:
 * //     | ((data: { elapsed: number; remaining?: number | undefined }) => unknown)
 * //     | {
 * //         elapsed?: ((data: number) => unknown) | undefined;
 * //         remaining?: ((data: number) => unknown) | undefined;
 * //       }
 * //     | undefined;
 * // };
 */
type Evolver<T> =
  T extends Array<any>
    ? (data: T) => unknown
    : T extends object
      ? {
          [K in keyof T]?:
            | (T[K] extends Array<any>
                ? never
                : (data: Required<T>[K]) => unknown)
            | Evolver<T[K]>;
        }
      : never;

/**
 * Creates return type from the type of arguments of `evolve`.
 */
type Evolved<T, E> = T extends object
  ? {
      [K in keyof T]: K extends keyof E
        ? E[K] extends (...arg: any) => infer R
          ? R
          : Evolved<T[K], E[K]>
        : T[K];
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
 *    const evolver = {
 *      count: add(1),
 *      time: { elapsed: add(1), remaining: add(-1) },
 *    };
 *    const data = {
 *      id: 10,
 *      count: 10,
 *      time: { elapsed: 100, remaining: 1400 },
 *    };
 *    evolve(data, evolver)
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
 *    R.evolve(evolver)(data)
 * @example
 *    const evolver = {
 *      count: add(1),
 *      time: { elapsed: add(1), remaining: add(-1) },
 *    };
 *    const data = {
 *      id: 10,
 *      count: 10,
 *      time: { elapsed: 100, remaining: 1400 },
 *    };
 *    R.pipe(object, R.evolve(evolver))
 *    // => {
 *    //   id: 10,
 *    //   count: 11,
 *    //   time: { elapsed: 101, remaining: 1399 },
 *    // }
 * @dataLast
 * @category Object
 */
export function evolve<T, E extends Evolver<T>>(
  evolver: E
): (object: T) => Evolved<T, E>;

export function evolve() {
  return purry(_evolve, arguments);
}

function _evolve(data: unknown, evolver: GenericEvolver): unknown {
  if (typeof data !== 'object' || data === null) {
    return data;
  }
  return toPairs.strict(evolver).reduce<Record<string, unknown>>(
    (result, [key, value]) => {
      if (!(key in result)) {
        return result;
      }
      if (typeof value === 'function') {
        result[key] = value(result[key]);
        return result;
      }
      result[key] = _evolve(result[key], value);
      return result;
    },
    { ...data }
  );
}
