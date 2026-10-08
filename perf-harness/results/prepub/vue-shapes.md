# Vue tracked dependencies per pipe shape

Dependencies of a Vue `computed` (production build) over a reactive array of 1,000 observable items, after one re-evaluation. `*` = differs from main.

| copy                | pipe(items, filter, map, take(10)) | pipe(items, find(id === 20)) | pipe(items, take(10)) | find(items, id === 20) data-first | filter(items, active) data-first |
| ------------------- | ---------------------------------- | ---------------------------- | --------------------- | --------------------------------- | -------------------------------- |
| main                | 31                                 | 23                           | 2                     | 23                                | 1002                             |
| main-aa             | 31                                 | 23                           | 2                     | 23                                | 1002                             |
| branch-v-cand-base  | 31                                 | 23                           | 2                     | 23                                | 1002                             |
| branch-v-cand-map   | 31                                 | 23                           | 2                     | 23                                | 1002                             |
| branch-v-cand-forof | 31                                 | 23                           | 2                     | 23                                | 1002                             |
| branch-v-cand-full  | 31                                 | 23                           | 2                     | 23                                | 1002                             |
