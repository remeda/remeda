import { isDate } from './isDate';
import { typesDataProvider } from '../test/types_data_provider';

describe('isDate', () => {
  test('isDate: should work as type guard', () => {
    const data = typesDataProvider('date');
    if (isDate(data)) {
      expect(data instanceof Date).toEqual(true);
      assertType<Date>(data);
    }

    const data1: unknown = typesDataProvider('date');
    if (isDate(data1)) {
      assertType<Date>(data1);
    }
  });
  test('isDate: should work as type guard in filter', () => {
    const data = [
      typesDataProvider('error'),
      typesDataProvider('array'),
      typesDataProvider('function'),
      typesDataProvider('null'),
      typesDataProvider('number'),
      typesDataProvider('date'),
    ].filter(isDate);
    expect(data.every(c => c instanceof Date)).toEqual(true);
    assertType<Array<Date>>(data);
  });
});
