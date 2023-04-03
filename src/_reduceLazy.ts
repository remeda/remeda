export type LazyResult<T> = LazyEmpty | LazyNext<T> | LazyMany<T>;

interface LazyEmpty {
  done: boolean;
  hasNext: false;
  hasMany?: false | undefined;
  next?: undefined;
}

interface LazyNext<T> {
  done: boolean;
  hasNext: true;
  hasMany?: false | undefined;
  next: T;
}

interface LazyMany<T> {
  done: boolean;
  hasNext: true;
  hasMany: true;
  next: Array<T>;
}

export function _reduceLazy<T, K>(
  array: Array<T>,
  lazy: (item: T, index?: number, array?: Array<T>) => LazyResult<K>,
  indexed?: boolean
): Array<K> {
  const newArray: Array<K> = [];
  // TODO: If we use ES2015 (i think) we can use `Array.entries()` to iterate
  // using for...of loops on both the item and the index.
  let index = 0;
  // We intentionally use a for loop here instead of reduce for performance reasons. See https://leanylabs.com/blog/js-forEach-map-reduce-vs-for-for_of/ for more info
  for (const item of array) {
    const result = indexed ? lazy(item, index, array) : lazy(item);
    if (result.hasMany === true) {
      newArray.push(...result.next);
    } else if (result.hasNext) {
      newArray.push(result.next);
    }
    index += 1;
  }
  return newArray;
}
