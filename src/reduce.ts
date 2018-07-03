export function reduce<T, K>(
  items: T[],
  fn: (acc: K, item: T) => K,
  initialValue: K
): K;
export function reduce<T, K>(
  fn: (acc: K, item: T) => K,
  initialValue: K
): (items: T[]) => K;

export function reduce(arg1: any, arg2: any, arg3?: any): any {
  if (arguments.length === 2) {
    return (data: any) => _reduce(data, arg1, arg2);
  }
  return _reduce(arg1, arg2, arg3);
}

function _reduce<T, K>(
  items: T[],
  fn: (acc: K, item: T) => K,
  initialValue: K
): K {
  return items.reduce((acc, item) => fn(acc, item), initialValue);
}
