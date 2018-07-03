export function sortBy<T>(items: T[], fn: (item: T) => any): T[];
export function sortBy<T>(fn: (item: T) => any): (items: T[]) => T[];

export function sortBy(arg1: any, arg2?: any): any {
  if (arguments.length === 1) {
    return (data: any) => _sortBy(data, arg1);
  }
  return _sortBy(arg1, arg2);
}

function _sortBy<T>(items: T[], fn: (item: T) => any): T[] {
  const copied = [...items];
  return copied.sort((a, b) => {
    const aa = fn(a);
    const bb = fn(b);
    return aa < bb ? -1 : aa > bb ? 1 : 0;
  });
}
