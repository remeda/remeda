import { isFunction } from './isFunction';
import { typesDataProvider } from '../test/types_data_provider';

describe('isFunction', () => {
  test('isFunction: should work as type guard', () => {
    const data = typesDataProvider('null');
    if (isFunction(data)) {
      expect(data).toEqual(null);
      assertType<() => void>(data);
    }

    let maybeFunction: string | ((a: number) => string) | undefined;
    if (isFunction(maybeFunction)) {
      maybeFunction(1);
      assertType<(a: number) => string>(maybeFunction);
    }
  });
  test('isFunction: should work as type guard in filter', () => {
    const data = [
      typesDataProvider('error'),
      typesDataProvider('array'),
      typesDataProvider('function'),
      typesDataProvider('function'),
      typesDataProvider('object'),
      typesDataProvider('number'),
    ].filter(isFunction);
    expect(data.every(c => typeof c === 'function')).toEqual(true);
    assertType<Array<() => void>>(data);
  });
});
