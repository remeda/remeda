import { purry } from './purry';

/**
 * Internal helper function to perform switch case operation.
 */
function _switchCase<T, R>(
  value: T,
  cases: Record<string, () => R>,
  defaultFn: () => R
): R {
  return cases[String(value)]?.() ?? defaultFn();
}

/**
 * Internal helper function to create a switch case function based on the provided cases and default function.
 */
function _switchCaseWithCases<T, R>(
  cases: Record<string, () => R>,
  defaultFn: () => R
): (value: T) => R {
  return (value: T) => _switchCase(value, cases, defaultFn);
}

/**
 * switchCase function returns the result of the appropriate case function based on the provided value,
 * or the result of the default function if no case matches the value.
 * @param value - The value to be matched against the case keys.
 * @param cases - An object where keys are strings representing the case values and values are functions to be executed.
 * @param defaultFn - A function to be executed if no case matches the provided value.
 * @returns - The result of the appropriate case function, or the result of the default function if no case matches the value.
 *
 * @example
 *    const result = switchCase(
 *      5,
 *      {
 *        1: () => 'first',
 *        5: () => 'last',
 *      },
 *      () => 'not exists'
 *    );
 *    console.log(result); // 'last'
 */
export function switchCase<T, R>(
  value: T,
  cases: Record<string, () => R>,
  defaultFn: () => R
): R;

/**
 * switchCase function returns a function that takes a value and returns the result of the appropriate case function
 * based on the value, or the result of the default function if no case matches the value.
 * @param cases - An object where keys are strings representing the case values and values are functions to be executed.
 * @param defaultFn - A function to be executed if no case matches the provided value.
 * @returns - A function that takes a value and returns the result of the appropriate case function,
 *            or the result of the default function if no case matches the value.
 *
 * @example
 *    const result = pipe(
 *      5,
 *      switchCase(
 *        {
 *          1: () => 'first',
 *          5: () => 'last',
 *        },
 *        () => 'not exists'
 *      )
 *    );
 *    console.log(result); // 'last'
 */
export function switchCase<T, R>(
  cases: Record<string, () => R>,
  defaultFn: () => R
): (value: T) => R;

export function switchCase() {
  if (arguments.length === 2) {
    return purry(_switchCaseWithCases, arguments);
  } else {
    return purry(_switchCase, arguments);
  }
}
