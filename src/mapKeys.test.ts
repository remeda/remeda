import { mapKeys } from './mapKeys';
import { pipe } from './pipe';

describe('data first', () => {
  test('mapKeys', () => {
    expect(
      mapKeys(
        {
          a: 1,
          b: 2,
        },
        (key, value) => key + value
      )
    ).toEqual({
      a1: 1,
      b2: 2,
    });
  });
});

describe('data last', () => {
  test('mapKeys', () => {
    expect(
      pipe(
        {
          a: 1,
          b: 2,
        },
        mapKeys((key, value) => key + value)
      )
    ).toEqual({
      a1: 1,
      b2: 2,
    });
  });
});
