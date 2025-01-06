---
title: Re-Implementations
category: Migrating to v2
priority: 60
---

# Re-Implementations

Several functions had their runtime implementation changed, including changes to
their _semantics_, so that they'd return different results in v2 for some edge
cases. These changes are documented below for each function. The functions are:
`clone`, `difference`, `intersection`, `omit`, `omitBy`, `purry`, `sample`,
_and_ `zipWith`.

---
