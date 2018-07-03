export function find<T>(items: T[], fn: (value: T) => boolean): T | undefined;

export function find<T>(
  fn: (value: T) => boolean
): (items: T[]) => T | undefined;

export function find(arg1: any, arg2?: any): any {
  if (arguments.length === 1) {
    return (data: any) => _find(data, arg1);
  }
  return _find(arg1, arg2);
}

function _find<T>(array: T[], fn: (item: T) => any) {
  return array.find(x => fn(x));
}
