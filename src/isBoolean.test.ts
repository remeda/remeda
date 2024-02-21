import {
  ALL_TYPES_DATA_PROVIDER,
  AllTypesDataProviderTypes,
  TYPES_DATA_PROVIDER,
} from '../test/types_data_provider';
import { isBoolean } from './isBoolean';

describe('isBoolean', () => {
  it('should work as type guard', () => {
    const data = TYPES_DATA_PROVIDER.boolean as AllTypesDataProviderTypes;
    if (isBoolean(data)) {
      expect(typeof data).toEqual('boolean');
      expectTypeOf(data).toEqualTypeOf<boolean>();
    }
  });

  it('should narrow `unknown`', () => {
    const data = TYPES_DATA_PROVIDER.boolean as unknown;
    if (isBoolean(data)) {
      expect(typeof data).toEqual('boolean');
      expectTypeOf(data).toEqualTypeOf<boolean>();
    }
  });

  it('should narrow `any`', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- We are explicitly testing the `any` case here
    const data = TYPES_DATA_PROVIDER.boolean as any;
    if (isBoolean(data)) {
      expect(typeof data).toEqual('boolean');
      expectTypeOf(data).toEqualTypeOf<boolean>();
    }
  });

  it('should work as type guard in filter', () => {
    const data = ALL_TYPES_DATA_PROVIDER.filter(isBoolean);
    expect(data.every(c => typeof c === 'boolean')).toEqual(true);
    expectTypeOf(data).toEqualTypeOf<Array<boolean>>();
  });
});
