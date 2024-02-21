import {
  ALL_TYPES_DATA_PROVIDER,
  AllTypesDataProviderTypes,
  TYPES_DATA_PROVIDER,
} from '../test/types_data_provider';
import { isError } from './isError';

describe('isError', () => {
  it('should work as type guard', () => {
    const data = TYPES_DATA_PROVIDER.error as AllTypesDataProviderTypes;
    if (isError(data)) {
      expect(data instanceof Error).toEqual(true);
      expectTypeOf(data).toEqualTypeOf<Error>();
    }

    class MyError extends Error {}

    let maybeError: MyError | undefined;
    if (isError(maybeError)) {
      expectTypeOf(maybeError).toEqualTypeOf<MyError>();
    }
  });

  it('should work as type guard in filter', () => {
    const data = ALL_TYPES_DATA_PROVIDER.filter(isError);
    expect(data.every(c => c instanceof Error)).toEqual(true);
    expectTypeOf(data).toEqualTypeOf<Array<Error>>();
  });
});
