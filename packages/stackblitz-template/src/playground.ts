/**
 * = 🎮 TypeScript Playground =
 *
 * Use this file to test out how Remeda utilities enforce input parameters and
 * how it shapes the output.
 *
 * This file is typechecked with the same TypeScript configuration that the
 * [TypeScript's Playground](https://typescriptlang.org/play) uses; this is not
 * the same as the configuration used internally by Remeda, and it isn't our
 * recommended configuration; we highly recommend enabling
 * `exactOptionalPropertyTypes`. The configuration can be modified in
 * `tsconfig.playground.json` in the root of this project.
 */

import { filter } from "remeda";

const DATA = ["hello", 123, "world", 456] as const;

const result = filter(DATA, ($) => typeof $ === "string");
//    ^?
