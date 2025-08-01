/* eslint-disable @typescript-eslint/no-deprecated --
 * The function is deprecated!
 */

import { describe, expectTypeOf, test } from "vitest";
import { stringToPath } from "./stringToPath";
import { pathOr } from "./pathOr";

// @see https://github.com/remeda/remeda/issues/779
describe("examples from lodash migration (issue #779)", () => {
  test("using stringToPath", () => {
    expectTypeOf(
      pathOr({ a: [{ b: 123 }] }, stringToPath("a[0].b"), 456),
    ).toEqualTypeOf<number>();
  });
});
