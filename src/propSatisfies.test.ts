import { filter } from './filter';
import { propSatisfies } from './propSatisfies';

describe('data first', () => {
  test('propSatisfies', () => {
    const actual = propSatisfies(
      { firstName: 'john' },
      'firstName',
      name => name.length === 4
    );
    expect(actual).toBe(true);
  });
});

describe('data last', () => {
  test('propSatisfies', () => {
    const actual = filter(
      [
        { value: 0 },
        { value: 1 },
        { value: 2 },
        { value: 3 },
        { value: 4 },
        { value: 5 },
      ],
      propSatisfies('value', v => v % 2 === 0)
    );
    expect(actual).toStrictEqual([{ value: 0 }, { value: 2 }, { value: 4 }]);
  });
});
