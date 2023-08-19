/**
 * This utility function simply delegates the call to `binarySearchCutoffIndex`,
 * so we test it mainly via the tests for that function.
 */

import { sortedIndexWith } from './sortedIndexWith';

describe('sanity', () => {
  test('regular', () => {
    expect(sortedIndexWith([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], x => x < 5)).toBe(5);
  });

  test('indexed', () => {
    expect(
      sortedIndexWith.indexed(
        ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'],
        (_, index) => index < 5
      )
    ).toBe(5);
  });
});
