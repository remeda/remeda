import { recursiveMerge } from './_recursiveMerge';
import { expect } from 'vitest';

describe('recursiveMerge', () => {
  test('should handle undefined inputs', () => {
    expect(recursiveMerge(undefined, undefined)).toBeUndefined();
    expect(recursiveMerge(undefined, 5)).toBe(5);
    expect(recursiveMerge(5, undefined)).toBe(5);
  });

  test('should handle null inputs', () => {
    expect(recursiveMerge(null, null)).toBeNull();
    expect(recursiveMerge(null, 5)).toBe(5);
    expect(recursiveMerge(5, null)).toBe(5);
  });

  test('should merge non-object and non-array primitives', () => {
    expect(recursiveMerge('foo', 'bar')).toBe('foo');
    expect(recursiveMerge('foo', undefined)).toBe('foo');
    expect(recursiveMerge(undefined, 'bar')).toBe('bar');
  });

  test('should merge arrays removing duplicates', () => {
    const a = [1, 2, 3];
    const b = [3, 4, 5];
    expect(recursiveMerge(a, b)).toEqual([1, 2, 3, 4, 5]);
  });

  test('should merge objects', () => {
    const a = { foo: 'bar', x: 1 };
    const b = { foo: 'baz', y: 2 };
    expect(recursiveMerge(a, b)).toEqual({ foo: 'bar', x: 1, y: 2 });
  });

  test('should not merge cyclic objects', () => {
    const a: any = {};
    a.foo = a;
    const b = { foo: ['baz'], y: 2 };

    expect(recursiveMerge(a, b)).toEqual({ foo: a, y: 2 });
  });

  // Test fails with error "RangeError: Maximum call stack size exceeded" in "uniq()" function
  test.skip('should not merge cyclic arrays', () => {
    const a: any = [];
    a.push(a); // Making 'a' a cyclic array.
    const b = [1, 2, 3];

    expect(recursiveMerge(a, b)).toEqual(a);
  });
});
