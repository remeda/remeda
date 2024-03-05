import type { LazyEvaluator } from "./pipe";

export function _reduceLazy<T, K>(
  array: ReadonlyArray<T>,
  lazy: LazyEvaluator<T, K>,
  isIndexed = false,
): Array<K> {
  const newArray: Array<K> = [];
  // We intentionally use a for loop here instead of reduce for performance reasons. See https://leanylabs.com/blog/js-forEach-map-reduce-vs-for-for_of/ for more info
  for (let index = 0; index < array.length; index++) {
    const item = array[index]!;
    const result = isIndexed ? lazy(item, index, array) : lazy(item);
    if (result.hasMany === true) {
      newArray.push(...result.next);
    } else if (result.hasNext) {
      newArray.push(result.next);
    }
  }
  return newArray;
}
