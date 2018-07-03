export function indexBy<T>(array: T[], fn: (item: T) => any): Record<string, T>;
export function indexBy<T>(
  fn: (item: T) => any
): (array: T[]) => Record<string, T>;

export function indexBy(arg1: any, arg2?: any): any {
  if (arguments.length === 1) {
    return (data: any) => _indexBy(data, arg1);
  }
  return _indexBy(arg1, arg2);
}

function _indexBy<T>(array: T[], fn: (item: T) => any) {
  const ret: Record<string, T> = {};
  array.forEach(item => {
    ret[fn(item).toString()] = item;
  });
  return ret;
}
