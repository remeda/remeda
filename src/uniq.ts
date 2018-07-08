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
  const set = new Set<T>();
  return array.filter(item => {
    if (set.has(item)) {
      return false;
    }
    set.add(item);
    return true;
  });
}

// function transducer() {
//   return (value: any) => {
//     return {
//       hasNext: true,
//       done: false,
//     };
//   };
// }
