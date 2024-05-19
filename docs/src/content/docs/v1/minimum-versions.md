---
title: "Minimum Versions"
category: "Migrating to v2"
slug: "migration-minimum-versions"
---

# Minimum Versions

## ES2022 Runtime

Previously Remeda compiled down to a target of **ES5** (and **ES2017** lib).
This meant that certain modern javascript features (like object and array
spreading) had to be polyfilled and shipped together with each function that
used them. It also meant that we couldn't use certain features, like built-in
iterators (like `Array.prototype.entries`) or `bigint`s, couldn't be used at
all.

v2 is compiled with a target of **ES2022** (and **ES2022** lib, too). This
version is supported by all current supported Node versions (18+) and by _~94%_
of browsers.

Browsers and runtimes that don't support ES2022 can still use functions that
don't rely on anything that runtime doesn't support, but we don't test for those
cases and won't be able to support any issues.

## Typescript 5.1+

## ESM
