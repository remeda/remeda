---
title: "Intro"
category: "Migrating to v2"
slug: "migration-intro"
priority: 00
---

# Migrating to v2

v2 is the first major version release of Remeda in almost 2 years. We took this
opportunity to gather as many **breaking changes** as possible into a single
release, focusing on modernization and simplification. What this release
_doesn't_ do is change any major aspect of Remeda's architecture. Almost half of
Remeda's exported functions don't have _any_ changes at all, neither to their
runtime or to their typing!

## Migrating

The remaining functions require mostly slight changes to how they are called
(like removing a variant suffix like "indexed": e.g. `map.indexed` is now just
`map`). Some function have parameter types or return types changed; these could
require fixes either up or down stream from where the function is called. Some
functions might require no changes at all in your project, but have changes to
their runtime behavior.

To ease the process we are providing a **function-by-function** migration guide
describing the changes to that function, offering examples of possible breakages
and how to fix them, and in some cases ways to maintain the previous behaviors.

We recommend first updating to the latest v1 version, fixing any deprecation
errors, and then updating to the latest version of Remeda and use this guide to
fix any remaining issues.
