import { isDefined } from './isDefined';
import { typesDataProvider } from '../test/types_data_provider';

describe('isDefined', () => {
  test('isDefined": should work as type guard', () => {
    const data = typesDataProvider('date');
    if (isDefined(data)) {
      expect(data instanceof Date).toEqual(true);
      assertType<
        | boolean
        | string
        | { a: string }
        | (() => void)
        | Array<number>
        | Date
        | Error
        | number
        | Promise<number>
      >(data);
    }
  });
  test('isDefined: should work as type guard in filter', () => {
    const data = [
      typesDataProvider('error'),
      typesDataProvider('array'),
      typesDataProvider('function'),
      typesDataProvider('null'),
      typesDataProvider('number'),
    ].filter(isDefined);
    expect(data.length === 4).toEqual(true);
    assertType<
      Array<
        | string
        | number
        | boolean
        | {
            a: string;
          }
        | (() => void)
        | Array<number>
        | Date
        | Error
        | Promise<number>
      >
    >(data);
  });
});
