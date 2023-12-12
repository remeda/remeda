import { mergeDeep } from './mergeDeep';
import { expect, test } from 'vitest';

describe('runtime (dataFirst)', () => {
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

describe('runtime (dataLast)', () => {
  test('should merge objects', () => {
    const a = { foo: 'baz', x: 1 };
    const b = { foo: 'bar', y: 2 };
    expect(mergeDeep(b)(a)).toEqual({ foo: 'bar', x: 1, y: 2 });
  });
});
