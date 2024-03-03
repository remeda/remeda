import type { IterableContainer } from "./_types";
import { purry } from "./purry";
import { toPairs } from "./toPairs";

/**
 * basic structure of `evolver` parameter of the function `evolve`.
 */
type GenericEvolver = {
  readonly [P in string]: GenericEvolver | ((data: unknown) => unknown);
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
type Evolver<T> = T extends object
  ? T extends IterableContainer
    ? never
    : {
        readonly [K in keyof T]?:
          | Evolver<T[K]>
          | ((data: Required<T>[K]) => unknown);
      }
  : never;

/**
 * Creates return type from the type of arguments of `evolve`.
 */
type Evolved<T, E> = T extends object
  ? {
      -readonly [K in keyof T]: K extends keyof E
        ? E[K] extends (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Functions aren't inferred correctly when using `unknown` for the params.
            ...arg: any
          ) => infer R
          ? R
          : Evolved<T[K], E[K]>
        : Required<T>[K];
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
export function evolve<T extends object, E extends Evolver<T>>(
  object: T,
  evolver: E,
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
export function evolve<T extends object, E extends Evolver<T>>(
  evolver: E,
): (object: T) => Evolved<T, E>;

export function evolve() {
  return purry(_evolve, arguments);
}

function _evolve(data: unknown, evolver: GenericEvolver): unknown {
  if (typeof data !== "object" || data === null) {
    return data;
  }
  return toPairs.strict(evolver).reduce<Record<string, unknown>>(
    (result, [key, value]) => {
      if (key in result) {
        result[key] =
          typeof value === "function"
            ? value(result[key])
            : _evolve(result[key], value);
      }
      return result;
    },
    { ...data },
  );
}
