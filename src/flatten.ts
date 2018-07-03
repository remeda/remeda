type Flatten<T> = T extends Array<infer K> ? K : T;

/**
 * Flattens `array` a single level deep.
 * @param items the target array
 * @signature R.flatten(array)
 * @example
 *    flatten([[1, 2], [3], [4, 5]]) // => [1, 2, 3, 4, 5]
 * @category Array
 */
export function flatten<T>(items: Array<T>): Array<Flatten<T>> {
  const ret: any[] = [];
  items.forEach(item => {
    if (Array.isArray(item)) {
      ret.push(...item);
    } else {
      ret.push(item);
    }
  });
  return ret;
}
