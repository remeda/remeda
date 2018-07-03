import { omit } from './omit';
import { pipe } from './pipe';

describe('data first', () => {
  test('it should omit props', () => {
    const result = omit({ a: 1, b: 2, c: 3, d: 4 }, ['a', 'd']);
    expect(result).toEqual({ b: 2, c: 3 });
  });
});

describe('data last', () => {
  test('it should omit props', () => {
    const result = pipe(
      { a: 1, b: 2, c: 3, d: 4 },
      omit(['a', 'd'])
    );
    expect(result).toEqual({ b: 2, c: 3 });
  });
});
