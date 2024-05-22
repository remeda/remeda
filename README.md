# Remeda

The first "data-first" and "data-last" utility library designed especially for TypeScript.

![GitHub CI](https://img.shields.io/github/actions/workflow/status/remeda/remeda/ci.yml?branch=beta&label=github-ci)
[![Codecov](https://img.shields.io/codecov/c/github/remeda/remeda/beta)](https://codecov.io/gh/remeda/remeda)
[![NPM](https://img.shields.io/npm/v/remeda)](https://www.npmjs.org/package/remeda)
![Dependencies](https://img.shields.io/librariesio/release/npm/remeda)

## Documentation

Full documentation on [remedajs.com/docs](https://remedajs.com/docs).

For Lodash and Ramda users, check the function mapping on [remedajs.com/mapping](https://remedajs.com/mapping).

## Features

* First-class TypeScript support, with types that are as specific as possible. 
* Supports data-first (`R.filter(array, fn)`) and data-last (`R.filter(fn)(array)`) approaches.
* Lazy evaluation support with `pipe` and `piped`.
* Runtime and types are both extensively tested, with full code coverage.
* Tree-shakable, supports CJS and ESM.
* Fully documented with JSDoc, supports in-editor function documentation.

## Getting started

### Installation

```bash
npm install remeda
yarn add remeda
```

### Usage

```js
import * as R from "remeda";

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
