type FlattenDeep<T> = T extends Array<infer K> ? FlattenDeep2<K> : T;
type FlattenDeep2<T> = T extends Array<infer K> ? FlattenDeep3<K> : T;
type FlattenDeep3<T> = T extends Array<infer K> ? FlattenDeep4<K> : T;
type FlattenDeep4<T> = T extends Array<infer K> ? K : T;

/**
 * Recursively flattens `array`.
 * @param items the target array
 * @signature R.flattenDeep(array)
 * @example
 *    R.flattenDeep([[1, 2], [[3], [4, 5]]]) // => [1, 2, 3, 4, 5]
 * @category Array
 */
export function flattenDeep<T>(items: Array<T>): Array<FlattenDeep<T>> {
  const ret: any[] = [];
  items.forEach(item => {
    if (Array.isArray(item)) {
      ret.push(...flattenDeep(item));
    } else {
      ret.push(item);
    }
  });
  return ret;
}
