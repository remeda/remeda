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
        | (() => void)
        | [number, number, number]
        | { a: string }
        | Array<number>
        | boolean
        | Date
        | Error
        | Map<string, string>
        | null
        | number
        | Promise<number>
        | RegExp
        | Set<string>
        | symbol
        | TestClass
        | Uint8Array
        | undefined
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
        | (() => void)
        | [number, number, number]
        | { a: string }
        | Array<number>
        | boolean
        | Date
        | Error
        | Map<string, string>
        | null
        | number
        | RegExp
        | Set<string>
        | string
        | symbol
        | TestClass
        | Uint8Array
        | undefined
      >
    >(result);
  });
});
