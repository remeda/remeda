import { isBoolean } from './isBoolean';
import { typesDataProvider } from '../test/types_data_provider';

describe('isBoolean', () => {
  test('isBoolean: should work as type guard', () => {
    const data = typesDataProvider('boolean');
    if (isBoolean(data)) {
      expect(typeof data).toEqual('boolean');
      assertType<boolean>(data);
    }

    const data1: unknown = typesDataProvider('boolean');
    if (isBoolean(data1)) {
      expect(typeof data1).toEqual('boolean');
      assertType<boolean>(data1);
    }

    const data2: any = typesDataProvider('boolean');
    if (isBoolean(data2)) {
      expect(typeof data2).toEqual('boolean');
      assertType<boolean>(data2);
    }
  });
  test('isBoolean: should work as type guard in filter', () => {
    const data = [
      typesDataProvider('error'),
      typesDataProvider('array'),
      typesDataProvider('function'),
      typesDataProvider('null'),
      typesDataProvider('array'),
      typesDataProvider('boolean'),
    ].filter(isBoolean);
    expect(data.every(c => typeof c === 'boolean')).toEqual(true);
    assertType<Array<boolean>>(data);
  });
});
