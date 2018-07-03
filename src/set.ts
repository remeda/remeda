export function set<T, K extends keyof T>(obj: T, prop: K, value: T[K]): T;
export function set<T, K extends keyof T>(prop: K, value: T[K]): (obj: T) => T;

export function set(arg1: any, arg2: any, arg3?: any): any {
  if (arguments.length === 2) {
    return (object: any) => _set(object, arg1, arg2);
  }
  return _set(arg1, arg2, arg3);
}

function _set(obj: any, prop: string, value: any) {
  return {
    ...obj,
    [prop]: value,
  };
}
