/**
 * Map each element of an array using a defined callback function.
 * @param array The array to map.
 * @param fn The function mapper.
 * @returns The new mapped array.
 * @signature
 *    R.map(array, fn)
 * @example
 *    R.map([1, 2, 3], x => x * 10) // => [10, 20, 30]
 * @data_first
 * @category Array
 */
export function map<T, K>(array: T[], fn: (input: T) => K): K[];

/**
 * Map each value of an object using a defined callback function.
 * @param fn the function mapper
 * @signature
 *    R.map(fn)(array)
 * @example
 *    R.map(x => x * 10)({ a: 1, b: 2, c: 3 }) // => { a: 2, b: 4, c: 6 }
 * @data_last
 * @category Array
 */
export function map<T, K>(fn: (input: T) => K): (array: T[]) => K[];

export function map(arg1: any, arg2?: any): any {
  if (arguments.length === 1) {
    return (data: any[]) => {
      return _map(data, arg1);
    };
  }
  return _map(arg1, arg2);
}

function _map<T, K>(array: T[], fn: (input: T) => K) {
  return array.map(item => fn(item));
}
