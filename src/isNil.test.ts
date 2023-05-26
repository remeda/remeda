import { isNil } from './isNil';
import { typesDataProvider } from '../test/types_data_provider';

describe('isNil', () => {
  test('isNil: should work as type guard', () => {
    const data = typesDataProvider('null');
    if (isNil(data)) {
      expect(data).toEqual(null);
      assertType<undefined | null>(data);
    }
  });
  test('isNil: should work as type guard in filter', () => {
    const data = [
      typesDataProvider('error'),
      typesDataProvider('array'),
      typesDataProvider('function'),
      typesDataProvider('function'),
      typesDataProvider('null'),
      typesDataProvider('number'),
    ].filter(isNil);
    expect(data.every(c => c == null)).toEqual(true);
    assertType<Array<undefined | null>>(data);
  });
});
