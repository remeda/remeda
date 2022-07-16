import { pickBy } from './pickBy';
import { pipe } from './pipe';

describe('data first', () => {
  test('it should pick props', () => {
    const result = pickBy({a: 1, b: 2, A: 3, B: 4}, (val, key) => key.toUpperCase() === key);
    expect(result).toStrictEqual({ A: 3, B: 4 });
  });
  test('allow undefined or null', () => {
    expect(pickBy(undefined as any, (val, key) => key === 'foo')).toEqual({});
    expect(pickBy(null as any, (val, key) => key === 'foo')).toEqual({});
  });
});

describe('data last', () => {
  test('it should pick props', () => {
    const result = pipe({a: 1, b: 2, A: 3, B: 4}, pickBy((val, key) => key.toUpperCase() === key));
    expect(result).toEqual({ A: 3, B: 4 });
  });
});
