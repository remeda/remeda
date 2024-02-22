import {
  ALL_TYPES_DATA_PROVIDER,
  AllTypesDataProviderTypes,
  TYPES_DATA_PROVIDER,
  TestClass,
} from '../test/types_data_provider';
import { isDefined } from './isDefined';

describe('isDefined', () => {
  it('should work as type guard', () => {
    const data = TYPES_DATA_PROVIDER.date as AllTypesDataProviderTypes;
    if (isDefined(data)) {
      expect(data instanceof Date).toEqual(true);
      expectTypeOf(data).toEqualTypeOf<
        | (() => void)
        | [number, number, number]
        | { readonly a: 'asd' }
        | Array<number>
        | boolean
        | Date
        | Error
        | Map<string, string>
        | number
        | Promise<number>
        | RegExp
        | Set<string>
        | string
        | symbol
        | TestClass
        | Uint8Array
      >();
    }
  });
  it('should work as type guard in filter', () => {
    const data = ALL_TYPES_DATA_PROVIDER.filter(isDefined);
    expect(data).toHaveLength(16);
    expectTypeOf(data).toEqualTypeOf<
      Array<
        | (() => void)
        | [number, number, number]
        | { readonly a: 'asd' }
        | Array<number>
        | boolean
        | Date
        | Error
        | Map<string, string>
        | number
        | Promise<number>
        | RegExp
        | Set<string>
        | string
        | symbol
        | TestClass
        | Uint8Array
      >
    >();
  });
});

describe('strict', () => {
  it('should work as type guard', () => {
    const data = TYPES_DATA_PROVIDER.date as AllTypesDataProviderTypes;
    if (isDefined.strict(data)) {
      expect(data instanceof Date).toEqual(true);
      expectTypeOf(data).toEqualTypeOf<
        | (() => void)
        | [number, number, number]
        | { readonly a: 'asd' }
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
        | string
        | symbol
        | TestClass
        | Uint8Array
      >();
    }
  });

  it('should work as type guard in filter', () => {
    const data = ALL_TYPES_DATA_PROVIDER.filter(isDefined.strict);
    expect(data).toHaveLength(17);
    expectTypeOf(data).toEqualTypeOf<
      Array<
        | (() => void)
        | [number, number, number]
        | { readonly a: 'asd' }
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
        | string
        | symbol
        | TestClass
        | Uint8Array
      >
    >();
  });
});
