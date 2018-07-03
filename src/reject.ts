export function reject<T>(items: T[], fn: (input: T) => boolean): T[];

export function reject<T>(fn: (input: T) => boolean): (items: T[]) => T[];

export function reject(arg1: any, arg2?: any): any {
  if (arguments.length === 1) {
    return (items: any) => _reject(items, arg1);
  }
  return _reject(arg1, arg2);
}

function _reject<T>(items: T[], fn: (input: T) => boolean) {
  return items.filter(item => !fn(item));
}
