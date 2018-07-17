/**
 * Gets the first element of `array`.
 * @param array the array
 * @signature
 *    R.first(array)
 * @example
 *    R.first([1, 2, 3]) // => 1
 *    R.first([]) // => undefined
 * @category array
 * @pipeable
 */
export function first<T>(array: T[]) {
  return array[0];
}

export namespace first {
  export function lazy<T>() {
    return (value: T) => {
      return {
        done: true,
        hasNext: true,
        next: value,
      };
    };
  }
  export namespace lazy {
    export const single = true;
  }
}
