import { isString } from './isString';
import { typesDataProvider } from '../test/types_data_provider';

describe('isString', () => {
  test('isString: should work as type guard', () => {
    const data = typesDataProvider('string');
    if (isString(data)) {
      expect(typeof data).toEqual('string');
      assertType<string>(data);
    }
  });
  test('isString: should work even if data type is unknown', () => {
    const data: unknown = typesDataProvider('string');
    if (isString(data)) {
      expect(typeof data).toEqual('string');
      assertType<string>(data);
    }
  });

  test('isString: should work with literal types', () => {
    const data = (): 'a' | 'b' | 'c' | number => {
      return 'a';
    };
    const x = data();
    if (isString(x)) {
      expect(typeof x).toEqual('string');
      assertType<'a' | 'b' | 'c'>(x);
    }
  });
  test('isString: should work as type guard in array', () => {
    const data = [
      typesDataProvider('error'),
      typesDataProvider('string'),
      typesDataProvider('function'),
      typesDataProvider('null'),
      typesDataProvider('array'),
      typesDataProvider('boolean'),
    ].filter(isString);
    expect(data.every(c => typeof c === 'string')).toEqual(true);
    assertType<Array<string>>(data);
  });
});
