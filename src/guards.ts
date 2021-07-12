export function isString<T>(data: T): data is Extract<T, string> {
  return typeof data === 'string';
}

export function isNumber<T>(data: T): data is Extract<T, number> {
  return typeof data === 'number' && !isNaN(data);
}

export function isDefined<T>(data: T): data is NonNullable<T> {
  return typeof data !== 'undefined' && data !== null;
}

export function isBoolean<T>(data: T): data is Extract<T, boolean> {
  return typeof data === 'boolean';
}

export function isPromise<T>(data: T): data is Extract<T, Promise<any>> {
  return data instanceof Promise;
}

// @ts-ignore
export function isArray<T>(
  data: T
): data is T extends ReadonlyArray<any> | Array<any> ? T : any[] {
  return Array.isArray(data);
}

// @ts-ignore
export function isObject<T extends unknown>(
  data: T
): data is T extends { [k: string]: unknown } ? T : { [k: string]: unknown } {
  return !!data && !Array.isArray(data) && typeof data === 'object';
}

export function isFunction<T>(data: T): data is Extract<T, Function> {
  return typeof data === 'function';
}

export function isNil<T>(data: T): data is Extract<T, null | undefined> {
  return data == null;
}

export function isError<T>(data: T): data is Extract<T, Error> {
  return data instanceof Error;
}

export function isDate<T>(data: T): data is Extract<T, Date> {
  return data instanceof Date;
}

export function isTruthy<T>(
  value: T
): value is Exclude<T, null | undefined | false | '' | 0> {
  return !!value;
}

export function isNot<T, S extends T>(
  predicate: (data: T) => data is S
): (data: T) => data is Exclude<T, S>;
export function isNot<T>(predicate: (data: T) => any): (data: T) => boolean;
export function isNot<T>(predicate: (data: T) => any) {
  return (data: T) => {
    return !predicate(data);
  };
}
