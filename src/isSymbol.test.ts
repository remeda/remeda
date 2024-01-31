import { isSymbol } from './isSymbol';
import { typesDataProvider } from '../test/types_data_provider';

describe('isSymbol', () => {
  test('isSymbol: should work as type guard', () => {
    const data = typesDataProvider('symbol');
    if (isSymbol(data)) {
      expect(typeof data).toEqual('symbol');
      assertType<symbol>(data);
    }
  });
  test('isSymbol: should work even if data type is unknown', () => {
    const data: unknown = typesDataProvider('symbol');
    if (isSymbol(data)) {
      expect(typeof data).toEqual('symbol');
      assertType<symbol>(data);
    }
  });
  test('isSymbol: should work as type guard in array', () => {
    const data = [
      typesDataProvider('symbol'),
      typesDataProvider('error'),
      typesDataProvider('string'),
      typesDataProvider('function'),
      typesDataProvider('null'),
      typesDataProvider('array'),
      typesDataProvider('boolean'),
    ].filter(isSymbol);
    expect(data.every(c => typeof c === 'symbol')).toEqual(true);
    assertType<Array<symbol>>(data);
  });
});
