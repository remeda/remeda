export function difference<T>(array: T[], other: T[]): T[];
export function difference<T>(other: T[]): (array: T[]) => T[];

export function difference(arg1: any, arg2?: any): any {
  if (arguments.length === 1) {
    return (array: any) => {
      return _difference(array, arg1);
    };
  }
  return _difference(arg1, arg2);
}

function _difference<T>(array: T[], other: T[]) {
  const set = new Set(other);
  return array.filter(x => !set.has(x));
}
