# Bundle size: main, branch

Minified ESM bundles of each import pattern against the copies' built dist (`sideEffects: false` honored). gzip is level 9, brotli quality 11. Deltas are against main.

| entry                              | bundler  | copy   | min   | delta | gzip | delta | brotli | delta | sentinel Proxy | sentinel message |
| ---------------------------------- | -------- | ------ | ----- | ----- | ---- | ----- | ------ | ----- | -------------- | ---------------- |
| import { map }                     | esbuild  | main   | 350   | -     | 249  | -     | 209    | -     | no             | no               |
| import { map }                     | esbuild  | branch | 448   | +98   | 271  | +22   | 224    | +15   | no             | no               |
| import { map }                     | rolldown | main   | 351   | -     | 247  | -     | 211    | -     | no             | no               |
| import { map }                     | rolldown | branch | 443   | +92   | 271  | +24   | 231    | +20   | no             | no               |
| import { filter, map }             | esbuild  | main   | 500   | -     | 289  | -     | 241    | -     | no             | no               |
| import { filter, map }             | esbuild  | branch | 634   | +134  | 365  | +76   | 317    | +76   | no             | no               |
| import { filter, map }             | rolldown | main   | 505   | -     | 293  | -     | 253    | -     | no             | no               |
| import { filter, map }             | rolldown | branch | 631   | +126  | 371  | +78   | 326    | +73   | no             | no               |
| import { pipe }                    | esbuild  | main   | 921   | -     | 520  | -     | 473    | -     | no             | no               |
| import { pipe }                    | esbuild  | branch | 2475  | +1554 | 1137 | +617  | 1029   | +556  | yes            | no               |
| import { pipe }                    | rolldown | main   | 922   | -     | 517  | -     | 466    | -     | no             | no               |
| import { pipe }                    | rolldown | branch | 2472  | +1550 | 1124 | +607  | 1017   | +551  | yes            | no               |
| import { pipe, map, filter, take } | esbuild  | main   | 1577  | -     | 783  | -     | 714    | -     | no             | no               |
| import { pipe, map, filter, take } | esbuild  | branch | 3258  | +1681 | 1478 | +695  | 1341   | +627  | yes            | no               |
| import { pipe, map, filter, take } | rolldown | main   | 1584  | -     | 770  | -     | 698    | -     | no             | no               |
| import { pipe, map, filter, take } | rolldown | branch | 3265  | +1681 | 1476 | +706  | 1339   | +641  | yes            | no               |
| import { unique }                  | esbuild  | main   | 1248  | -     | 671  | -     | 609    | -     | no             | no               |
| import { unique }                  | esbuild  | branch | 1376  | +128  | 746  | +75   | 649    | +40   | yes            | no               |
| import { unique }                  | rolldown | main   | 1249  | -     | 661  | -     | 602    | -     | no             | no               |
| import { unique }                  | rolldown | branch | 1373  | +124  | 729  | +68   | 641    | +39   | yes            | no               |
| whole library                      | esbuild  | main   | 28146 | -     | 9118 | -     | 8221   | -     | no             | no               |
| whole library                      | esbuild  | branch | 29570 | +1424 | 9829 | +711  | 8853   | +632  | yes            | no               |
| whole library                      | rolldown | main   | 28166 | -     | 9088 | -     | 8189   | -     | no             | no               |
| whole library                      | rolldown | branch | 29598 | +1432 | 9780 | +692  | 8759   | +570  | yes            | no               |

## Public declarations (against main)

- branch index.d.ts: text different, declarations with comments stripped DIFFERENT (main 582348 B, branch 581574 B)
- branch index.d.cts: text different, declarations with comments stripped DIFFERENT (main 582349 B, branch 581575 B)

### Declaration diff: branch index.d.ts (comments stripped)

```diff
@@ -1149,27 +1149,7 @@
 declare function prop<K extends PropertyKey>(key: K): <T extends Partial<Record<K, unknown>>>(data: T) => T[K];
 declare function pullObject<T extends IterableContainer, K extends PropertyKey, V>(data: T, keyExtractor: (item: T[number], index: number, data: T) => K, valueExtractor: (item: T[number], index: number, data: T) => V): BoundedPartial<Record<K, V>>;
 declare function pullObject<T extends IterableContainer, K extends PropertyKey, V>(keyExtractor: (item: T[number], index: number, data: T) => K, valueExtractor: (item: T[number], index: number, data: T) => V): (data: T) => BoundedPartial<Record<K, V>>;
-type LazyResult<T = unknown> = LazyEmpty | LazyMany<T> | LazyNext<T>;
-type LazyEmpty = {
-  done: boolean;
-  hasNext: false;
-  hasMany?: false | undefined;
-  next?: undefined;
-};
-type LazyNext<T> = {
-  done: boolean;
-  hasNext: true;
-  hasMany?: false | undefined;
-  next: T;
-};
-type LazyMany<T> = {
-  done: boolean;
-  hasNext: true;
-  hasMany: true;
-  next: readonly T[];
-};
-type LazyEvaluator<T = unknown, R = T> = (item: T, index: number, data: readonly T[]) => LazyResult<R>;
-declare function purry(fn: StrictFunction, args: readonly unknown[], lazy?: (...args: any) => LazyEvaluator): unknown;
+declare const purry: (fn: StrictFunction, args: readonly unknown[]) => unknown;
 declare function randomBigInt(from: bigint, to: bigint): bigint;
 type MaxLiteral = 1000;
 type RandomInteger<From extends number, To extends number> = IsNever<NonNegativeInteger<From>> extends true ? number : IsNever<NonNegativeInteger<To>> extends true ? number : IsEqual$2<From, To> extends true ? From : GreaterThan<From, To> extends true ? never : GreaterThanOrEqual<To, MaxLiteral> extends true ? number : IntRangeInclusive<From, To>;
```

Full declaration diffs (including comments) are in results/publication/bundle.json.
