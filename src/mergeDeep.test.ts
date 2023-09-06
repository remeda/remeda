import { mergeDeep } from './mergeDeep';
import { expect, test } from 'vitest';

describe('mergeDeep', () => {
  test('should merge arrays', () => {
    const a = [1, 2, 3];
    const b = [3, 4, 5];
    expect(mergeDeep(a, b)).toEqual([1, 2, 3, 3, 4, 5]);
  });

  test('should merge objects', () => {
    const a = { foo: 'baz', x: 1 };
    const b = { foo: 'bar', y: 2 };
    expect(mergeDeep(a, b)).toEqual({ foo: 'bar', x: 1, y: 2 });
  });

  test('should merge nested objects', () => {
    const a = { foo: { bar: 'baz' } };
    const b = { foo: { qux: 'quux' } };
    expect(mergeDeep(a, b)).toEqual({ foo: { bar: 'baz', qux: 'quux' } });
  });

  test('should merge objects using data_last approach', () => {
    const a = { foo: 'baz', x: 1 };
    const b = { foo: 'bar', y: 2 };
    expect(mergeDeep(b)(a)).toEqual({ foo: 'bar', x: 1, y: 2 });
  });

  test('should not merge cyclic objects', () => {
    const a = { foo: ['baz'], y: 2 };
    const b: any = {};
    b.foo = b;

    expect(mergeDeep(a, b)).toEqual({ foo: b, y: 2 });
  });

  test('should not merge object with cycles across multiple objects', () => {
    const a: any = {};
    const b: any = {};
    const c: any = {};

    a.b = b;
    b.c = c;
    c.a = a;

    expect(mergeDeep(a, {})).toEqual(a);
  });

  test('should not merge left cyclic array', () => {
    const a: any = ['foo'];
    a.push(a); // Making 'a' a cyclic array.
    const b = [1, 2, 3];

    expect(mergeDeep(a, b)).toEqual([1, 2, 3]);
  });

  test('should not merge right cyclic array', () => {
    const a = [1, 2, 3];
    const b: any = ['foo'];
    b.push(b); // Making 'b' a cyclic array.

    expect(mergeDeep(a, b)).toEqual([1, 2, 3]);
  });

  test('should not merge object and array', () => {
    const a = { foo: ['qux'] };
    const b = { foo: { bar: 'baz' } };
    expect(mergeDeep(a, b)).toEqual({ foo: { bar: 'baz' } });
  });

  test('should not merge array and object', () => {
    const a = { foo: { bar: 'baz' } };
    const b = { foo: ['qux'] };
    expect(mergeDeep(a, b)).toEqual({ foo: ['qux'] });
  });
});
