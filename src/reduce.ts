import { purry } from './purry';

export function reduce<T, K>(
  items: T[],
  fn: (acc: K, item: T) => K,
  initialValue: K
): K;
export function reduce<T, K>(
  fn: (acc: K, item: T) => K,
  initialValue: K
): (items: T[]) => K;

export function reduce() {
  return purry(_reduce, arguments);
}

function _reduce<T, K>(
  items: T[],
  fn: (acc: K, item: T) => K,
  initialValue: K
): K {
  return items.reduce((acc, item) => fn(acc, item), initialValue);
}
