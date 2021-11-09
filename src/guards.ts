type DefinitelyString<T> = Extract<T, string> extends never
  ? string
  : Extract<T, string> extends any
  ? string
  : Extract<T, string>;

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
export function isString<T>(data: T | string): data is DefinitelyString<T> {
  return typeof data === 'string';
}

type DefinitelyNumber<T> = Extract<T, number> extends never
  ? number
  : Extract<T, number> extends any
  ? number
  : Extract<T, number>;

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
export function isNumber<T>(data: T | number): data is DefinitelyNumber<T> {
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

type DefinitelyBoolean<T> = Extract<T, boolean> extends never
  ? boolean
  : Extract<T, boolean> extends any
  ? boolean
  : Extract<T, number>;

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

export function isBoolean<T>(data: T | boolean): data is DefinitelyBoolean<T> {
  return typeof data === 'boolean';
}

type DefinitelyPromise<T extends unknown> = Extract<
  T,
  Promise<any>
> extends never
  ? Promise<unknown>
  : Extract<T, Promise<any>>;
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
// @ts-expect-error
export function isPromise<T>(data: T): data is DefinitelyPromise<T> {
  return data instanceof Promise;
}

type DefinitelyArray<T extends unknown> = Extract<
  T,
  Array<any> | ReadonlyArray<any>
> extends never
  ? ReadonlyArray<unknown>
  : Extract<T, Array<any> | ReadonlyArray<any>>;
/**
 * A function that checks if the passed parameter is an Array and narrows it's type accordingly
 * @param data the variable to check
 * @signature
 *    R.isArray(data)
 * @returns true if the passed input is an Array, false otherwise
 * @example
 *    R.isArray([5]) //=> true
 *    R.isArray([]) //=> true
 *    R.isArray('somethingElse') //=> false
 * @category Guard
 */
export function isArray<T>(
  data: T | ReadonlyArray<unknown>
): data is DefinitelyArray<T> {
  return Array.isArray(data);
}

type DefinitelyObject<T extends unknown> = Exclude<
  Extract<T, object>,
  Array<any> | Function | ReadonlyArray<any>
> extends never
  ? { [k: string]: unknown }
  : Exclude<Extract<T, object>, Array<any> | Function | ReadonlyArray<any>>;
/**
 * A function that checks if the passed parameter is of type Object and narrows it's type accordingly
 * @param data the variable to check
 * @signature
 *    R.isObject(data)
 * @returns true if the passed input is an Object, Promise, Date or Error, false otherwise
 * @example
 *    R.isObject({}) //=> true
 *    R.isObject(Promise.resolve("something")) //=> true
 *    R.isObject(new Date()) //=> true
 *    R.isObject(new Error("error")) //=> true
 *    R.isObject('somethingElse') //=> false
 * @category Guard
 */
export function isObject<T extends unknown>(
  data: T | object
): data is DefinitelyObject<T> {
  return !!data && !Array.isArray(data) && typeof data === 'object';
}

type DefinitelyFunction<T> = Extract<T, Function> extends never
  ? Function
  : Extract<T, Function>;
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
export function isFunction<T>(
  data: T | Function
): data is DefinitelyFunction<T> {
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

type DefinitelyError<T> = Extract<T, Error> extends never
  ? Error
  : Extract<T, Error>;
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
export function isError<T>(data: T | Error): data is DefinitelyError<T> {
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
export function isDate(data: unknown): data is Date {
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
