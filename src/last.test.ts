import { last } from './last';
import { AssertEqual, NonEmptyArray } from './_types';

describe('last', () => {
  test('should return last', () => {
    expect(last([1, 2, 3] as const)).toEqual(3);
  });

  test('empty array', () => {
    expect(last([] as const)).toEqual(undefined);
  });

  test('should not return undefined for non empty arrays', () => {
    const input: NonEmptyArray<number> = [1, 2, 3];
    const data = last(input);
    const result: AssertEqual<typeof data, number> = true;
    expect(result).toEqual(true);
  });
});
