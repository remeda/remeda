import type { AllTypesDataProviderTypes } from "../test/types_data_provider";
import {
  ALL_TYPES_DATA_PROVIDER,
  TYPES_DATA_PROVIDER,
} from "../test/types_data_provider";
import { isNil } from "./isNil";

describe("isNil", () => {
  it("should work as type guard", () => {
    const data = TYPES_DATA_PROVIDER.null as AllTypesDataProviderTypes;
    if (isNil(data)) {
      expect(data).toEqual(null);
      expectTypeOf(data).toEqualTypeOf<null | undefined>();
    }
  });

  it("should work as type guard in filter", () => {
    const data = ALL_TYPES_DATA_PROVIDER.filter(isNil);
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- Intentional for the test.
    expect(data.every((c) => c === null || c === undefined)).toEqual(true);
    expectTypeOf(data).toEqualTypeOf<Array<null | undefined>>();
  });
});
