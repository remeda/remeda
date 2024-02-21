import { isBoolean } from './isBoolean';
import { typesDataProvider } from '../test/types_data_provider';

describe('isBoolean', () => {
  test('isBoolean: should work as type guard', () => {
    const data = typesDataProvider('boolean');
    if (isBoolean(data)) {
      expect(typeof data).toEqual('boolean');
      expectTypeOf(data).toEqualTypeOf<boolean>();
    }

    const data1: unknown = typesDataProvider('boolean');
    if (isBoolean(data1)) {
      expect(typeof data1).toEqual('boolean');
      expectTypeOf(data1).toEqualTypeOf<boolean>();
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- We are explicitly testing the `any` case here
    const data2: any = typesDataProvider('boolean');
    if (isBoolean(data2)) {
      expect(typeof data2).toEqual('boolean');
      expectTypeOf(data2).toEqualTypeOf<boolean>();
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
    expectTypeOf(data).toEqualTypeOf<Array<boolean>>();
  });
});
