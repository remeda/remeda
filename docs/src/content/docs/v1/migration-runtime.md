---
title: "Re-Implementations"
category: "Migrating to v2"
slug: "migration-reimplementations"
priority: 60
---

# Re-Implementation

Several functions had their (runtime) implementation changed, including changes
to their semantics, so that they'd return a different result in v2, for some
edge-cases. These changes are documented below for each function. The functions
are: `clone`, `difference`, `intersection`, `omit`, `omitBy`, `purry`, `sample`,
_and_ `zipWith`

---
