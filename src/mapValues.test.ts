import { mapValues } from './mapValues';
import { pipe } from './pipe';

describe('data first', () => {
  test('mapValues', () => {
    expect(
      mapValues(
        {
          a: 1,
          b: 2,
        },
        (value, key) => value + key
      )
    ).toEqual({
      a: '1a',
      b: '2b',
    });
  });
});

describe('data last', () => {
  test('mapValues', () => {
    expect(
      pipe(
        {
          a: 1,
          b: 2,
        },
        mapValues((value, key) => value + key)
      )
    ).toEqual({
      a: '1a',
      b: '2b',
    });
  });
});
