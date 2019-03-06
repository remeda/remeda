import { pick } from './pick';
import { pipe } from './pipe';

describe('data first', () => {
  test('it should pick props', () => {
    const result = pick({ a: 1, b: 2, c: 3, d: 4 }, ['a', 'd']);
    expect(result).toEqual({ a: 1, d: 4 });
  });
  test('allow undefined or null', () => {
    expect(pick(undefined as any, ['foo'])).toEqual({});
    expect(pick(null as any, ['foo'])).toEqual({});
  });
});

describe('data last', () => {
  test('it should pick props', () => {
    const result = pipe(
      { a: 1, b: 2, c: 3, d: 4 },
      pick(['a', 'd'])
    );
    expect(result).toEqual({ a: 1, d: 4 });
  });
});
