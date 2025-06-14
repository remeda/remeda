/**
 * = 📋 Type Tests =
 *
 * This file should only contain tests that use Vitest's type-testing APIs:
 * [ExpectTypeOf](https://vitest.dev/api/expect-typeof.html), or
 * [AssertType](https://vitest.dev/api/assert-type.html).
 *
 * !The tests aren't run when the running the test suite!
 *
 * For runtime tests use: `./runtime.test.ts`.
 *
 * @see https://vitest.dev/guide/testing-types
 */

import { pick } from "remeda";
import { expectTypeOf, test } from "vitest";

test.skip("example", () => {
  expectTypeOf(pick({ a: 1, b: "hello" } as const, ["a"])).toEqualTypeOf<{
    readonly a: 1;
  }>();
});
