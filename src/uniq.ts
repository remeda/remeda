import { _reduceLazy } from './_reduceLazy';

/**
 * Returns a new array containing only one copy of each element in the original list.
 * Elements are compared by reference using Set.
 * @param array
 * @signature
 *    R.uniq(array)
 * @example
 *    R.uniq([1, 2, 2, 5, 1, 6, 7]) // => [1, 2, 5, 6, 7]
 * @category Array
 */
export function uniq<T>(array: T[]) {
  return _reduceLazy(array, uniq.lazy());
}

export namespace uniq {
  export function lazy() {
    const set = new Set<any>();
    return (value: any) => {
      if (set.has(value)) {
        return {
          done: false,
          hasNext: false,
        };
      }
      set.add(value);
      return {
        done: false,
        hasNext: true,
        next: value,
      };
    };
  }
}
