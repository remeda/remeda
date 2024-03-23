import type { LazyEvaluator } from "./pipe";

export function _reduceLazy<T, K>(
  array: ReadonlyArray<T>,
  lazy: LazyEvaluator<T, K>,
): Array<K> {
  const out: Array<K> = [];

  // We intentionally use a for loop here instead of reduce for performance reasons. See https://leanylabs.com/blog/js-forEach-map-reduce-vs-for-for_of/ for more info
  for (const [index, item] of array.entries()) {
    const result = lazy(item, index, array);
    if (result.hasMany === true) {
      out.push(...result.next);
    } else if (result.hasNext) {
      out.push(result.next);
    }

    if (result.done) {
      break;
    }
  }

  return out;
}
