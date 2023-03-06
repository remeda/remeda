import { keys } from './keys';
import { pipe } from './pipe';
import { AssertEqual } from './_types';

describe('Test for keys', () => {
  it('should return keys of array', () => {
    expect(keys(['x', 'y', 'z'])).toEqual(['0', '1', '2']);
  });

  it('should return keys of object', () => {
    expect(keys({ a: 'x', b: 'y', c: 'z' })).toEqual(['a', 'b', 'c']);
  });

  describe('strict', () => {
    it('should return strict types', () => {
      const actual = keys.strict({ 5: 'x', b: 'y', c: 'z' } as const);
      expect(actual).toEqual(['5', 'b', 'c']);

      const result: AssertEqual<typeof actual, Array<'5' | 'b' | 'c'>> = true;

      expect(result).toEqual(true);
    });

    it('should work with Partial in pipe', () => {
      const data: Partial<{ foo: string; bar?: number }> = {
        foo: '1',
        bar: 7,
      };
      const actual = pipe(data, keys.strict);
      expect(actual).toEqual(['foo', 'bar']);

      const result: AssertEqual<typeof actual, Array<'foo' | 'bar'>> = true;

      expect(result).toEqual(true);
    });
  });
});
