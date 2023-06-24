import { isNumber } from './isNumber';
import { typesDataProvider } from '../test/types_data_provider';

describe('isNumber', () => {
  test('isNumber: should work as type guard', () => {
    const data = typesDataProvider('number');
    if (isNumber(data)) {
      expect(typeof data).toEqual('number');
      assertType<number>(data);
    }
  });
  test('isNumber: should work as type guard in filter', () => {
    const data = [
      typesDataProvider('promise'),
      typesDataProvider('array'),
      typesDataProvider('boolean'),
      typesDataProvider('function'),
      typesDataProvider('object'),
      typesDataProvider('number'),
    ].filter(isNumber);
    expect(data.every(c => typeof c === 'number')).toEqual(true);
    assertType<Array<number>>(data);
  });
  test('should work even if data type is unknown', () => {
    const data: unknown = typesDataProvider('number');
    if (isNumber(data)) {
      expect(typeof data).toEqual('number');
      assertType<number>(data);
    }
  });
  test('should work with literal types', () => {
    const data = (): 1 | 2 | 3 | string => {
      return 1;
    };
    const x = data();
    if (isNumber(x)) {
      expect(typeof x).toEqual('number');
      assertType<1 | 2 | 3>(x);
    }
  });
});
