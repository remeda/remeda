import { typesDataProvider, type TestClass } from '../test/types_data_provider';
import { isNot } from './isNot';
import { isPromise } from './isPromise';
import { isString } from './isString';

describe('isNot', () => {
  test('isNot: should work as type guard', () => {
    const data = typesDataProvider('promise');
    if (isNot(isString)(data)) {
      expect(data instanceof Promise).toEqual(true);
      assertType<
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
        | symbol
        | null
        | undefined
        | RegExp
        | TestClass
        | Set<string>
        | Map<string, string>
        | [number, number, number]
        | Uint8Array
      >(data);
    }
  });
  test('isNot: should work as type guard in filter', () => {
    const data = [
      typesDataProvider('promise'),
      typesDataProvider('array'),
      typesDataProvider('boolean'),
      typesDataProvider('function'),
    ];
    const result = data.filter(isNot(isPromise));
    expect(result.some(c => c instanceof Promise)).toEqual(false);

    assertType<
      Array<
        | boolean
        | string
        | { a: string }
        | (() => void)
        | Array<number>
        | Date
        | undefined
        | null
        | Error
        | number
        | [number, number, number]
        | Map<string, string>
        | RegExp
        | Set<string>
        | symbol
        | TestClass
        | Uint8Array
      >
    >(result);
  });
});
