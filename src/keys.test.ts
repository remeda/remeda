import { keys } from './keys';
import { AssertEqual } from './_types';

describe('Test for keys', () => {
  it('should return keys of array', () => {
    expect(keys(['x', 'y', 'z'])).toEqual(['0', '1', '2']);
  });

  it('should return keys of object', () => {
    expect(keys({ a: 'x', b: 'y', c: 'z' })).toEqual(['a', 'b', 'c']);
  });

  describe('strict', () => {
    const actual = keys.strict({ 5: 'x', b: 'y', c: 'z'} as const);
    expect(actual).toEqual(['5', 'b', 'c']);

    const result: AssertEqual<typeof actual, Array<'5' | 'b' | 'c'>> = true;

    expect(result).toEqual(true);
  });
});
