# Remeda

The first "data-first" and "data-last" utility library designed especially for TypeScript.

![GitHub CI](https://img.shields.io/github/actions/workflow/status/remeda/remeda/ci.yml?branch=main&label=github-ci)
[![Codecov](https://img.shields.io/codecov/c/github/remeda/remeda/main)](https://codecov.io/gh/remeda/remeda)
[![NPM](https://img.shields.io/npm/v/remeda)](https://www.npmjs.org/package/remeda)
![Dependencies](https://img.shields.io/librariesio/release/npm/remeda)

## Documentation

Read the full docs and API reference on [remedajs.com/docs](https://remedajs.com/docs).

Migrating from Lodash or Ramda? Check the function mapping on [remedajs.com/mapping](https://remedajs.com/mapping).

## Features

- First-class TypeScript support, with types that are as specific as possible.
- Supports data-first (`R.filter(array, fn)`) and data-last (`R.filter(fn)(array)`) approaches.
- Lazy evaluation support with `pipe` and `piped`.
- Runtime and types are both extensively tested, with full code coverage.
- Tree-shakable, supports CJS and ESM.
- Fully documented with JSDoc, supports in-editor function documentation.

## Getting started

### Installation

```bash
npm install remeda
pnpm add remeda
yarn add remeda
bun install remeda
```

### Usage

```js
// Import everything:
import * as R from "remeda";

// Or import methods individually:
// import { pipe, tap, unique, take } from "remeda";

R.pipe(
  [1, 2, 2, 3, 3, 4, 5, 6],
  R.tap((value) => console.log(`Got ${value}`)),
  R.unique(),
  R.take(3),
); // => [1, 2, 3]

// Console output:
// Got 1
// Got 2
// Got 2
// Got 3
```

### Getting help

Questions, bug reports, and feature requests are tracked in [GitHub issues](https://github.com/remeda/remeda/issues).
