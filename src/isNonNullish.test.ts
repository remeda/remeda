import {
  ALL_TYPES_DATA_PROVIDER,
  TYPES_DATA_PROVIDER,
} from "../test/typesDataProvider";
import { isNonNullish } from "./isNonNullish";

it("should work as type guard", () => {
  expect(isNonNullish(TYPES_DATA_PROVIDER.date)).toBe(true);
});

it("should work as type guard in filter", () => {
  const data = ALL_TYPES_DATA_PROVIDER.filter(isNonNullish);

  expect(data).toHaveLength(17);
});
