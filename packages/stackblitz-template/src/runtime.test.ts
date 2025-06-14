/**
 * = 🧪 Runtime Tests =
 *
 * This file should only contain tests that use Vitest's regular
 * [Expect](https://vitest.dev/api/expect.html) or
 * [Assert](https://vitest.dev/api/assert.html) APIs.
 *
 * For type tests use: `./typing.test-d.ts`.
 *
 * @see https://vitest.dev/guide/testing-types
 */

import { add, map } from "remeda";
import { expect, test } from "vitest";

test.skip("example", () => {
  expect(map([1, 2, 3], add(1))).toStrictEqual([2, 3, 4]);
});
