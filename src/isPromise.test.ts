import { isPromise } from './isPromise';
import { typesDataProvider } from '../test/types_data_provider';

describe('isPromise', () => {
  test('isPromise: should work as type guard', () => {
    const data = typesDataProvider('promise');
    if (isPromise(data)) {
      expect(data instanceof Promise).toEqual(true);
      assertType<Promise<number>>(data);
    }
  });
  test('isPromise: should work as type guard in filter', () => {
    const data = [
      typesDataProvider('promise'),
      typesDataProvider('array'),
      typesDataProvider('boolean'),
      typesDataProvider('function'),
    ].filter(isPromise);
    expect(data.every(c => c instanceof Promise)).toEqual(true);
    assertType<Array<Promise<number>>>(data);
  });
});
