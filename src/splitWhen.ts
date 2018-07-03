import { splitAt } from './splitAt';

export function splitWhen<T>(array: T[], fn: (item: T) => boolean) {
  for (let i = 0; i < array.length; i++) {
    if (fn(array[i])) {
      return splitAt(array, i);
    }
  }
  return [array, []];
}
