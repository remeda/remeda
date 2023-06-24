import { createLazyInvocationCounter } from '../test/lazy_invocation_counter';
import { equals } from './equals';
import { intersectionWith } from './intersectionWith';
import { pipe } from './pipe';
import { take } from './take';

const source = [
  { id: 1, name: 'Ryan' },
  { id: 3, name: 'Emma' },
];
const other = [3, 5];
const expected = [
  {
    id: 3,
    name: 'Emma',
  },
];

describe('intersectionWith', () => {
  describe('data first', () => {
    test('returns the new array of intersecting values based on a custom comparator', () => {
      expect(intersectionWith(source, other, (a, b) => a.id === b)).toEqual(
        expected
      );
    });
  });
  describe('data last', () => {
    it('returns the new array of intersecting values based on a custom comparator', () => {
      expect(
        intersectionWith(
          other,
          /**
           * type inference doesn't work properly for the comparator's first parameter
           * in data last variant
           */
          (a, b) => (a as (typeof source)[0]).id === b
        )(source)
      ).toEqual(expected);
    });
    it("checks if items are equal based on remeda's imported util function as a comparator", () => {
      const source = [
        { x: 1, y: 2 },
        { x: 2, y: 1 },
      ];
      const other = [
        { x: 1, y: 1 },
        { x: 1, y: 2 },
      ];
      const expected = [{ x: 1, y: 2 }];

      expect(pipe(source, intersectionWith(other, equals))).toEqual(expected);
    });

    it('evaluates lazily', () => {
      const counter = createLazyInvocationCounter();
      const result = pipe(
        [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }, { a: 5 }, { a: 6 }],
        counter.fn(),
        intersectionWith([{ a: 2 }, { a: 3 }, { a: 4 }], equals),
        take(2)
      );
      expect(counter.count).toHaveBeenCalledTimes(3);
      expect(result).toEqual([{ a: 2 }, { a: 3 }]);
    });
  });
});
