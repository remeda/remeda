# Remeda

The first "data-first" and "data-last" utility library designed especially for TypeScript.

[![GitHub License](https://img.shields.io/github/license/remeda/remeda?style=flat-square)](https://github.com/remeda/remeda?tab=MIT-1-ov-file#readme)
![GitHub top language](https://img.shields.io/github/languages/top/remeda/remeda?logo=typescript&style=flat-square)
[![NPM](https://img.shields.io/npm/v/remeda?logo=npm&style=flat-square)](https://www.npmjs.org/package/remeda)
[![NPM Downloads](https://img.shields.io/npm/dm/remeda?logo=npm&style=flat-square)](https://npmtrends.com/remeda)
![GitHub Repo stars](https://img.shields.io/github/stars/remeda/remeda?logo=github&style=flat-square)
[![Libraries.io SourceRank](https://img.shields.io/librariesio/sourcerank/npm/remeda?logo=librariesdotio&style=flat-square)](https://libraries.io/npm/remeda/sourcerank)<br />
[![Codecov](https://img.shields.io/codecov/c/github/remeda/remeda?logo=codecov&style=flat-square)](https://codecov.io/gh/remeda/remeda)
[![GitHub branch status](https://img.shields.io/github/checks-status/remeda/remeda/main?logo=github&style=flat-square)](https://github.com/remeda/remeda/actions/workflows)
[![GitHub Release Date](https://img.shields.io/github/release-date/remeda/remeda?logo=npm&style=flat-square)](https://github.com/remeda/remeda/releases)
[![Commits](https://img.shields.io/github/commit-activity/y/remeda/remeda?logo=github&style=flat-square)](https://github.com/remeda/remeda/commits/main/)
[![All contributors](https://img.shields.io/github/contributors/remeda/remeda?logo=github&style=flat-square)](https://github.com/remeda/remeda/graphs/contributors)

## Documentation

Read the full docs and API reference on [remedajs.com/docs](https://remedajs.com/docs).

Migrating from other libraries? Check out our migration guides for [Lodash](https://remedajs.com/migrate/lodash) and [Ramda](https://remedajs.com/migrate/ramda)!

Interested in contributing? Read the [contributing guide](CONTRIBUTING.md).

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

## Contributors

<a href="https://github.com/remeda/remeda/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=remeda/remeda" />
</a>

Made with [contrib.rocks](https://contrib.rocks).
