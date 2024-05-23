---
title: "Environment"
category: "Migrating to v2"
slug: "migration-environment"
priority: 10
---

# Environment

Remeda v2 is built for modern environments. Browsers and runtimes that don't
support the minimum requirements might still be able to use some functions (if
their implementation doesn't rely on anything more modern), but those cases will
not be supported.

## Runtime ≥ ES2022

Previously, Remeda compiled down to a target of **ES5** (and **ES2017** lib).
This meant that modern JavaScript features (like object and array spreading) had
to be polyfilled and shipped with each function that used them. It also meant
that we couldn't use certain features, like built-in iterators (e.g.,
`Array.prototype.entries`) or `bigint`s.

v2 is compiled with a target of **ES2022** (and **ES2022** lib), which is
supported by all currently maintained Node.js versions (18+) and by [_~93.8%_](https://caniuse.com/mdn-javascript_builtins_array_at,mdn-javascript_builtins_object_hasown)
of all browsers.

## TypeScript ≥ 5.1

The minimum TypeScript version our exported types are tested against is **5.1**,
up from **4.2** in v1.

## Importing

Remeda v2 builds its packaged files using [`tsup`](https://tsup.egoist.dev/)
(replacing the bare `tsc` build of the previous version), with full support for
tree-shaking, code splitting, and minification. The output config is validated
using both [`attw`](https://arethetypeswrong.github.io/) and [`publint`](https://publint.dev/).
This results in completely different output artifacts and structure for both
**_CommonJS_** and **_ESM_**. We don't expect this to have any impact on your
project; it should integrate cleanly with any modern JS build tool, bundler, and
runtime.
