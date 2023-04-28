import { isEmpty } from './isEmpty';

describe('isEmpty', () => {
  test('returns false when data array contains items', () => {
    expect(isEmpty([1, 2, 3])).toBe(false);
  });

  test('returns false when data is an empty array', () => {
    expect(isEmpty([])).toBe(true);
  });

  test('returns true for an empty string', () => {
    expect(isEmpty('')).toBe(true);
  });

  test('returns false for a non-empty string', () => {
    expect(isEmpty('test')).toBe(false);
  });

  test('returns false for null', () => {
    expect(isEmpty(null)).toBe(false);
  });

  test('returns false for undefined', () => {
    expect(isEmpty(undefined)).toBe(false);
  });

  test('returns true for an empty object', () => {
    expect(isEmpty({})).toBe(true);
  });

  test('returns false for a non-empty object', () => {
    expect(isEmpty({ length: 0 })).toBe(false);
  });

  test('returns true for an empty Uint8Array', () => {
    expect(isEmpty(Uint8Array.from([]))).toBe(true);
  });

  test('returns false for an Uint8Array containing items', () => {
    expect(isEmpty(new Uint8Array(2))).toBe(false);
  });

  test('returns true for an empty Set', () => {
    expect(isEmpty(new Set())).toBe(true);
  });

  test('returns false for a non-empty Set', () => {
    expect(isEmpty(new Set([1, 2, 3, 1, 1]))).toBe(false);
  });

  test('returns true for an empty Map', () => {
    expect(isEmpty(new Map())).toBe(true);
  });

  test('returns false for a non-empty Set', () => {
    const mapObject = new Map();
    mapObject.set('a', 1);
    mapObject.set('b', 2);

    expect(isEmpty(mapObject)).toBe(false);
  });

  test('returns false for a number primitive', () => {
    expect(isEmpty(1)).toBe(false);
  });

  test('returns false for a boolean primitive', () => {
    expect(isEmpty(true)).toBe(false);
  });
});
