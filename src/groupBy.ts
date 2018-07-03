export function groupBy<T>(
  items: T[],
  fn: (item: T) => any
): Record<string, T[]>;
export function groupBy<T>(
  fn: (item: T) => any
): (array: T[]) => Record<string, T[]>;

export function groupBy(arg1: any, arg2?: any): any {
  if (arguments.length === 1) {
    return (data: any) => _groupBy(data, arg1);
  }
  return _groupBy(arg1, arg2);
}

function _groupBy<T>(array: T[], fn: (item: T) => any) {
  const ret: Record<string, T[]> = {};
  array.forEach(item => {
    const key = fn(item).toString();
    if (!ret[key]) {
      ret[key] = [];
    }
    ret[key].push(item);
  });
  return ret;
}
