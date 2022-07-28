import { omitBy } from './omitBy';
import { pipe } from './pipe';

describe('data first', () => {
  test('it should pick props', () => {
    const result = omitBy(
      { a: 1, b: 2, A: 3, B: 4 },
      (val, key) => key.toUpperCase() === key
    );
    expect(result).toStrictEqual({ a: 1, b: 2 });
  });
  test('allow undefined or null', () => {
    expect(omitBy(undefined as any, (val, key) => key === 'foo')).toEqual({});
    expect(omitBy(null as any, (val, key) => key === 'foo')).toEqual({});
  });
});

describe('data last', () => {
  test('it should pick props', () => {
    const result = pipe(
      { a: 1, b: 2, A: 3, B: 4 },
      omitBy((val, key) => key.toUpperCase() === key)
    );
    expect(result).toEqual({ a: 1, b: 2 });
  });
});
