export function findIndex<T>(array: T[], fn: (item: T) => boolean) {
  for (let i = 0; i < array.length; i++) {
    if (fn(array[i])) {
      return i;
    }
  }
  return -1;
}
