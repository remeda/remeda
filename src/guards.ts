/**
 * A function that checks if the passed parameter is a string and narrows it's type accordingly
 * @param data the variable to check
 * @signature
 *    R.isString(data)
 * @returns true if the passed input is a string, false otherwise
 * @example
 *    R.isString('string') //=> true
 *    R.iString(1) //=> false
 * @category Guard
 */
export function isString<T>(data: T): data is Extract<T, string> {
  return typeof data === 'string';
}

/**
 * A function that checks if the passed parameter is a number and narrows it's type accordingly
 * @param data the variable to check
 * @signature
 *    R.isNumber(data)
 * @returns true if the passed input is a number, false otherwise
 * @example
 *    R.isNumber(1) //=> true
 *    R.isNumber('notANumber') //=> false
 * @category Guard
 */
export function isNumber<T>(data: T): data is Extract<T, number> {
  return typeof data === 'number' && !isNaN(data);
}

/**
 * A function that checks if the passed parameter is defined and narrows it's type accordingly
 * @param data the variable to check
 * @signature
 *    R.isDefined(data)
 * @returns true if the passed input is defined, false otherwise
 * @example
 *    R.isDefined('string') //=> true
 *    R.isDefined(null) //=> false
 *    R.isDefined(undefined) //=> false
 * @category Guard
 */
export function isDefined<T>(data: T): data is NonNullable<T> {
  return typeof data !== 'undefined' && data !== null;
}

/**
 * A function that checks if the passed parameter is a boolean and narrows it's type accordingly
 * @param data the variable to check
 * @signature
 *    R.isBoolean(data)
 * @returns true if the passed input is a boolean, false otherwise
 * @example
 *    R.isBoolean(true) //=> true
 *    R.isBoolean(false) //=> true
 *    R.isBoolean('somethingElse') //=> false
 * @category Guard
 */
export function isBoolean<T>(data: T): data is Extract<T, boolean> {
  return typeof data === 'boolean';
}

/**
 * A function that checks if the passed parameter is a Promise and narrows it's type accordingly
 * @param data the variable to check
 * @signature
 *    R.isPromise(data)
 * @returns true if the passed input is a Promise, false otherwise
 * @example
 *    R.isPromise(Promise.resolve(5)) //=> true
 *    R.isPromise(Promise.reject(5)) //=> true
 *    R.isPromise('somethingElse') //=> false
 * @category Guard
 */
export function isPromise<T>(data: T): data is Extract<T, Promise<any>> {
  return data instanceof Promise;
}

/**
 * A function that checks if the passed parameter is an Array and narrows it's type accordingly
 * @param data the variable to check
 * @signature
 *    R.isArray(data)
 * @returns true if the passed input is an Array, false otherwise
 * @example
 *    R.isArray([5])) //=> true
 *    R.isArray([])) //=> true
 *    R.isArray('somethingElse') //=> false
 * @category Guard
 */
export function isArray<T>(
  data: T
): data is Extract<T, ReadonlyArray<any> | Array<any>> {
  return Array.isArray(data);
}

/**
 * A function that checks if the passed parameter is an Object and narrows it's type accordingly
 * @param data the variable to check
 * @signature
 *    R.isObject(data)
 * @returns true if the passed input is an Object, false otherwise
 * @example
 *    R.isObject({})) //=> true
 *    R.isObject('somethingElse') //=> false
 * @category Guard
 */
export function isObject<T extends unknown>(
  data: T | object
): data is T extends Record<string, unknown> ? T : never {
  return !!data && !Array.isArray(data) && typeof data === 'object';
}

/**
 * A function that checks if the passed parameter is a Function and narrows it's type accordingly
 * @param data the variable to check
 * @signature
 *    R.isFunction(data)
 * @returns true if the passed input is a Function, false otherwise
 * @example
 *    R.isFunction(() => {}) //=> true
 *    R.isFunction('somethingElse') //=> false
 * @category Guard
 */
export function isFunction<T>(data: T): data is Extract<T, Function> {
  return typeof data === 'function';
}

/**
 * A function that checks if the passed parameter is Nil (null or undefined) and narrows it's type accordingly
 * @param data the variable to check
 * @signature
 *    R.isNil(data)
 * @returns true if the passed input is Nil (null or undefined), false otherwise
 * @example
 *    R.isNil(undefined) //=> true
 *    R.isNil(null) //=> true
 *    R.isNil('somethingElse') //=> false
 * @category Guard
 */
export function isNil<T>(data: T): data is Extract<T, null | undefined> {
  return data == null;
}

/**
 * A function that checks if the passed parameter is an Error and narrows it's type accordingly
 * @param data the variable to check
 * @signature
 *    R.isError(data)
 * @returns true if the passed input is an Error, false otherwise
 * @example
 *    R.isError(new Error('message')) //=> true
 *    R.isError('somethingElse') //=> false
 * @category Guard
 */
export function isError<T>(data: T): data is Extract<T, Error> {
  return data instanceof Error;
}

/**
 * A function that checks if the passed parameter is a Date and narrows it's type accordingly
 * @param data the variable to check
 * @signature
 *    R.isDate(data)
 * @returns true if the passed input is a Date, false otherwise
 * @example
 *    R.isDate(new Date()) //=> true
 *    R.isDate('somethingElse') //=> false
 * @category Guard
 */
export function isDate<T>(data: T): data is Extract<T, Date> {
  return data instanceof Date;
}

/**
 * A function that checks if the passed parameter is truthy and narrows it's type accordingly
 * @param data the variable to check
 * @signature
 *    R.isTruthy(data)
 * @returns true if the passed input is truthy, false otherwise
 * @example
 *    R.isTruthy('somethingElse') //=> true
 *    R.isTruthy(null) //=> false
 *    R.isTruthy(undefined) //=> false
 *    R.isTruthy(false) //=> false
 *    R.isTruthy(0) //=> false
 *    R.isTruthy('') //=> false
 * @category Guard
 */
export function isTruthy<T>(
  data: T
): data is Exclude<T, null | undefined | false | '' | 0> {
  return !!data;
}

/**
 * A function that takes a guard function as predicate and returns a guard that negates it
 * @param predicate the guard function to negate
 * @signature
 *    R.isNot(R.isTruthy)(data)
 * @returns function A guard function
 * @example
 *    R.isNot(R.isTruthy)(false) //=> true
 *    R.isNot(R.isTruthy)(true) //=> false
 * @data_last
 * @category Guard
 */
export function isNot<T, S extends T>(
  predicate: (data: T) => data is S
): (data: T) => data is Exclude<T, S>;
export function isNot<T>(predicate: (data: T) => any): (data: T) => boolean;
export function isNot<T>(predicate: (data: T) => any) {
  return (data: T) => {
    return !predicate(data);
  };
}
