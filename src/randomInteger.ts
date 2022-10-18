/**
 * Returns a random number between the inclusive upper and lower bounds.
 * Lower bound is rounded up and upper bound is rounded down if floats are passed as arguments.
 * @param lower the lower bound
 * @param upper the upper bound
 * @signature randomInteger(lower, upper)
 * @example
 *    randomInteger(0, 5) // => 2
 * @category Number
 */

export function randomInteger(lower: number, upper: number) {
  if (upper < lower) {
    throw new RangeError('upper must be greater than or equal to lower');
  }

  const lowerCeil = Math.ceil(lower);
  const upperFloor = Math.floor(upper);

  const r = Math.random();
  const diff = upperFloor - lowerCeil;
  return Math.round(lowerCeil + diff * r);
}
