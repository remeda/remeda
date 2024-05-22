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
Remeda's exported functions don't have _any_ breaking changes at all, neither to
their runtime or to their typing!

## Migrating

For functions that have breaking changes done to them, the vast majority might
not require any changes in your project, or only slight changes to how they are
called.

Other function have **parameter types** or **return types** changed; these could
require fixes either _up_ or _down stream_ from where the function is called.
These kinds of changes need more attention as they might surface existing bugs
in your codebase (akin to better typing or a new lint rule).

A few functions have breaking changes in their _runtime implementation_, mostly
in the way _edge-cases_ are handled. These too require more attention when
migrating, to make sure the new implementation does what you expect it to do.

To ease the process we are providing a **function-by-function** migration guide
describing the changes to that function, offering examples of possible breakages
and how to fix them, and in some cases ways to maintain the previous behaviors.

We recommend first updating to the latest v1 version, fixing any deprecation
errors, and then updating to the latest version of Remeda and use this guide to
fix any remaining issues.

The following chapters provide an overview of the changes. They provide a
broader perspective and motivation for each change. _All information relevant to
each function is repeated in each function's migration docs_.
