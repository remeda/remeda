export function getOr<T, A extends keyof T>(
  object: T,
  path: [A],
  defaultValue: T[A]
): T[A];

export function getOr<T, A extends keyof T, B extends keyof T[A]>(
  object: T,
  path: [A, B],
  defaultValue: T[A][B]
): T[A][B];

export function getOr<
  T,
  A extends keyof T,
  B extends keyof T[A],
  C extends keyof T[A][B]
>(object: T, path: [A, B, C], defaultValue: T[A][B][C]): T[A][B][C];

export function getOr<T, A extends keyof T>(
  path: [A],
  defaultValue: T[A]
): (object: T) => T[A];

export function getOr<T, A extends keyof T, B extends keyof T[A]>(
  path: [A, B],
  defaultValue: T[A][B]
): (object: T) => T[A][B];

export function getOr<
  T,
  A extends keyof T,
  B extends keyof T[A],
  C extends keyof T[A][B]
>(path: [A, B, C], defaultValue: T[A][B][C]): (object: T) => T[A][B][C];

export function getOr(arg1: any, arg2: any, arg3?: any): any {
  if (arguments.length === 2) {
    return (data: any) => _getOr(data, arg1, arg2);
  }
  return _getOr(arg1, arg2, arg3);
}
function _getOr(object: any, path: any[], defaultValue: any): any {
  let current = object;
  for (const prop of path) {
    if (current == null || current[prop] == null) {
      return defaultValue;
    }
    current = current[prop];
  }
  return current;
}
