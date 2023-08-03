import { deepMerge } from './deepMerge';
import { expect } from 'vitest';

describe('deepMerge', () => {
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

  test('should merge nested objects', () => {
    const a = { foo: { bar: 'baz' } };
    const b = { foo: { qux: 'quux' } };
    expect(deepMerge(a, b)).toEqual({ foo: { bar: 'baz', qux: 'quux' } });
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

  test('should not merge object and array', () => {
    const a = { foo: { bar: 'baz' } };
    const b = { foo: ['qux'] };
    expect(deepMerge(a, b)).toEqual({ foo: { bar: 'baz' } });
  });

  test('should not merge array and object', () => {
    const a = { foo: ['qux'] };
    const b = { foo: { bar: 'baz' } };
    expect(deepMerge(a, b)).toEqual({ foo: ['qux'] });
  });
});
