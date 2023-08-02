import { deepMerge } from './deepMerge';
import { expect } from 'vitest';

describe('deepMerge', () => {
  test('should handle undefined inputs', () => {
    expect(deepMerge(undefined, undefined)).toBeUndefined();
    expect(deepMerge(undefined, 5)).toBe(5);
    expect(deepMerge(5, undefined)).toBe(5);
  });

  test('should handle null inputs', () => {
    expect(deepMerge(null, null)).toBeNull();
    expect(deepMerge(null, 5)).toBe(5);
    expect(deepMerge(5, null)).toBe(5);
  });

  test('should merge non-object and non-array primitives', () => {
    expect(deepMerge('foo', 'bar')).toBe('foo');
    expect(deepMerge('foo', undefined)).toBe('foo');
    expect(deepMerge(undefined, 'bar')).toBe('bar');
  });

  test('should merge arrays', () => {
    const a = [1, 2, 3];
    const b = [3, 4, 5];
    expect(deepMerge(a, b)).toEqual([1, 2, 3, 3, 4, 5]);
  });

  test('should merge objects', () => {
    const a = { foo: 'bar', x: 1 };
    const b = { foo: 'baz', y: 2 };
    expect(deepMerge(a, b)).toEqual({ foo: 'bar', x: 1, y: 2 });
  });

  test('should merge objects using data_last approach', () => {
    const a = { foo: 'bar', x: 1 };
    const b = { foo: 'baz', y: 2 };
    expect(deepMerge(b)(a)).toEqual({ foo: 'bar', x: 1, y: 2 });
  });

  test('should not merge cyclic objects', () => {
    const a: any = {};
    a.foo = a;
    const b = { foo: ['baz'], y: 2 };

    expect(deepMerge(a, b)).toEqual({ foo: a, y: 2 });
  });

  test('should not merge cyclic arrays', () => {
    const a: any = [];
    a.push(a); // Making 'a' a cyclic array.
    const b = [1, 2, 3];

    expect(deepMerge(a, b)).toEqual(a);
  });
});
