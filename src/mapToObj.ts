/**
 * Map each element of an array into an object using a defined callback function.
 * @param array The array to map.
 * @param fn The mapping function, which should return a tuple of [key, value], similar to Object.fromEntries
 * @returns The new mapped object.
 * @signature
 *    R.mapToObj(array, fn)
 *    R.mapToObj.indexed(array, fn)
 * @example
 *    R.mapToObj([1, 2, 3], x => [String(x), x * 2]) // => {1: 2, 2: 4, 3: 6}
 *    R.mapToObj.indexed([0, 0, 0], (x, i) => [i, i]) // => {0: 0, 1: 1, 2: 2}
 * @data_first
 * @indexed
 * @category Array
 */

export function mapToObj <T, K extends string | number | symbol, V>(
    array: ReadonlyArray<T>,
    fn: (element: T, index: number, array: ReadonlyArray<T>) => [K, V]
): Record<K, V>

/**
 * Map each element of an array into an object using a defined callback function.
 * @param array The array to map.
 * @param fn The mapping function, which should return a tuple of [key, value], similar to Object.fromEntries
 * @returns The new mapped object.
 * @signature
 *    R.mapToObj(fn)(array)
 *    R.mapToObj(fn)(array)
 * @example
 *    R.pipe([0, 1, 2], R.mapToObj(x => [String(x), x * 2])) // => {1: 2, 2: 4, 3: 6}
 *    R.pipe([0, 0, 0], R.mapToObj.indexed((x, i) => [i, i])) // => {0: 0, 1: 1, 2: 2}
 * @data_last
 * @indexed
 * @category Array
 */

export function mapToObj <T, K extends string | number | symbol, V>(
    array: ReadonlyArray<T>,
    fn: (element: T, index: number, array: ReadonlyArray<T>) => [K, V]
): Record<K, V>

export function mapToObj(arg1: any, arg2?: any): any {
    if (arguments.length === 1) {
        return (data: any) => _mapToObj(data, arg1);
    }
    return _mapToObj(arg1, arg2);
}

function _mapToObj(
    array: Array<any>,
    fn: (element: any, index: number, array: Array<any>) => any
) {
    return array.reduce((result, element, index) => {
        const [key, value] = fn(element, index, array)
        result[key] = value
        return result
    }, {})
}
