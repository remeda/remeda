---
title: "Intro"
category: "Migrating to v2"
slug: "migration-intro"
priority: 00
---

# Migrating to v2

v2 is the first major version release of Remeda in almost 2 years. We took this
opportunity to gather as many **breaking changes** as possible into a single
release, focusing on modernization and simplification. Importantly, this release
_doesn't_ change any major aspect of Remeda's architecture. Almost half of
Remeda's exported functions don't have _any_ breaking changes, neither in their
runtime nor their typing!

## Migrating

For most projects, only minor changes to how some functions are called will be
necessary.

Some functions have **parameter types** or **return types** that have changed;
these may require adjustments either _upstream_ or _downstream_ from where the
function is called. These changes need more attention as they might expose
existing bugs in your codebase (similar to better typing or a new lint rule).

A few functions have breaking changes in their _runtime implementation_, mainly
in how _edge-cases_ are handled. These also require careful attention during
migration to ensure the new implementation behaves as expected.

To facilitate this process, we provide a **function-by-function** migration
guide that details the changes for each function, includes examples of potential
breakages, and offers solutions, including ways to maintain previous behaviors.

We recommend first updating to the latest v1 version, fixing any deprecation
errors, and then updating to the latest version of Remeda, using this guide to
address any remaining issues.

The following chapters provide an overview of the changes, offering a broader
perspective and motivation for each change. _All relevant information for each
function is repeated in each function's migration documentation_.
