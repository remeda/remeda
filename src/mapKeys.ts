export function mapKeys<T, S>(
  object: T,
  fn: (key: keyof T, value: T[keyof T]) => any
): { [x: string]: any };

export function mapKeys<T, S>(
  fn: (key: keyof T, value: T[keyof T]) => any
): (object: T) => { [x: string]: any };

export function mapKeys(arg1: any, arg2?: any): any {
  if (arguments.length === 1) {
    return (data: any) => _mapKeys(data, arg1);
  }
  return _mapKeys(arg1, arg2);
}

function _mapKeys(obj: any, fn: (key: string, value: any) => any) {
  return Object.keys(obj).reduce(
    (acc, key) => {
      acc[fn(key, obj[key])] = obj[key];
      return acc;
    },
    {} as any
  );
}
