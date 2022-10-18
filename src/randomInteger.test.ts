import { randomInteger } from './randomInteger';
import { times } from './times';
import { uniq } from './uniq';

describe('randomInteger', () => {
  test('should return a number between 1 and 5', () => {
    const results = times(100, () => randomInteger(0, 5));
    expect(results.every(num => num >= 0 && num <= 5)).toEqual(true);
  });
  test('should return lower bound when upper and lower are the same', () => {
    const result = randomInteger(5, 5);
    expect(result).toBe(5);
  });
  test('should throw error when upper bound is less than lower bound', () => {
    expect(() => randomInteger(5, 4)).toThrowError(RangeError);
  });
  test('should round down float passed as upper', () => {
    const results = times(100, () => randomInteger(2, 2.9));

    expect(results.every(num => num === 2)).toEqual(true);
  });
  test('should round up float passed as lower', () => {
    const results = times(100, () => randomInteger(0.9, 1));

    expect(results.every(num => num === 1)).toEqual(true);
  });
  test('should return different numbers', () => {
    const results = times(100, () => randomInteger(-1000, 1000));

    const uniqueValues = uniq(results);
    expect(uniqueValues.length).toBeGreaterThan(1);
  });
});
