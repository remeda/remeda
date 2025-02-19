import {
  ALL_TYPES_DATA_PROVIDER,
  TYPES_DATA_PROVIDER,
} from "../test/typesDataProvider";
import { isDefined } from "./isDefined";

it("should work as type guard", () => {
  expect(isDefined(TYPES_DATA_PROVIDER.date)).toBe(true);
});

it("should work as type guard in filter", () => {
  const data = ALL_TYPES_DATA_PROVIDER.filter(isDefined);

  expect(data).toHaveLength(18);
});
