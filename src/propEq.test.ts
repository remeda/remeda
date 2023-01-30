import { propEq } from './propEq';
import { filter } from './filter';

describe('data first', () => {
  test('propEq', () => {
    const actual = propEq({ firstName: 'john' }, 'firstName', 'john');
    expect(actual).toBe(true);
  });
});

describe('data last', () => {
  test('propEq', () => {
    const actual = filter(
      [
        { firstName: 'john', lastName: 'doe' },
        { firstName: 'jane', lastName: 'doe' },
      ],
      propEq('firstName', 'jane')
    );
    expect(actual).toStrictEqual([{ firstName: 'jane', lastName: 'doe' }]);
  });
});
