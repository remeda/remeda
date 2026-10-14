# Bundle size: main, branch-v-cand-base, branch-v-cand-map, branch-v-cand-forof, branch-v-cand-full

Minified ESM bundles of each import pattern against the copies' built dist (`sideEffects: false` honored). gzip is level 9, brotli quality 11. Deltas are against main.

| entry                              | bundler  | copy                | min   | delta | gzip | delta | brotli | delta | sentinel Proxy | sentinel message |
| ---------------------------------- | -------- | ------------------- | ----- | ----- | ---- | ----- | ------ | ----- | -------------- | ---------------- |
| import { map }                     | esbuild  | main                | 350   | -     | 249  | -     | 209    | -     | no             | no               |
| import { map }                     | esbuild  | branch-v-cand-base  | 472   | +122  | 291  | +42   | 243    | +34   | no             | no               |
| import { map }                     | esbuild  | branch-v-cand-map   | 448   | +98   | 271  | +22   | 224    | +15   | no             | no               |
| import { map }                     | esbuild  | branch-v-cand-forof | 472   | +122  | 291  | +42   | 243    | +34   | no             | no               |
| import { map }                     | esbuild  | branch-v-cand-full  | 448   | +98   | 271  | +22   | 224    | +15   | no             | no               |
| import { map }                     | rolldown | main                | 351   | -     | 247  | -     | 211    | -     | no             | no               |
| import { map }                     | rolldown | branch-v-cand-base  | 471   | +120  | 291  | +44   | 268    | +57   | no             | no               |
| import { map }                     | rolldown | branch-v-cand-map   | 443   | +92   | 271  | +24   | 231    | +20   | no             | no               |
| import { map }                     | rolldown | branch-v-cand-forof | 471   | +120  | 291  | +44   | 268    | +57   | no             | no               |
| import { map }                     | rolldown | branch-v-cand-full  | 443   | +92   | 271  | +24   | 231    | +20   | no             | no               |
| import { filter, map }             | esbuild  | main                | 500   | -     | 289  | -     | 241    | -     | no             | no               |
| import { filter, map }             | esbuild  | branch-v-cand-base  | 611   | +111  | 350  | +61   | 302    | +61   | no             | no               |
| import { filter, map }             | esbuild  | branch-v-cand-map   | 634   | +134  | 365  | +76   | 317    | +76   | no             | no               |
| import { filter, map }             | esbuild  | branch-v-cand-forof | 611   | +111  | 350  | +61   | 302    | +61   | no             | no               |
| import { filter, map }             | esbuild  | branch-v-cand-full  | 634   | +134  | 365  | +76   | 317    | +76   | no             | no               |
| import { filter, map }             | rolldown | main                | 505   | -     | 293  | -     | 253    | -     | no             | no               |
| import { filter, map }             | rolldown | branch-v-cand-base  | 608   | +103  | 359  | +66   | 311    | +58   | no             | no               |
| import { filter, map }             | rolldown | branch-v-cand-map   | 631   | +126  | 371  | +78   | 326    | +73   | no             | no               |
| import { filter, map }             | rolldown | branch-v-cand-forof | 608   | +103  | 359  | +66   | 311    | +58   | no             | no               |
| import { filter, map }             | rolldown | branch-v-cand-full  | 631   | +126  | 371  | +78   | 326    | +73   | no             | no               |
| import { pipe }                    | esbuild  | main                | 921   | -     | 520  | -     | 473    | -     | no             | no               |
| import { pipe }                    | esbuild  | branch-v-cand-base  | 2263  | +1342 | 1096 | +576  | 986    | +513  | yes            | no               |
| import { pipe }                    | esbuild  | branch-v-cand-map   | 2268  | +1347 | 1090 | +570  | 975    | +502  | yes            | no               |
| import { pipe }                    | esbuild  | branch-v-cand-forof | 2470  | +1549 | 1134 | +614  | 1028   | +555  | yes            | no               |
| import { pipe }                    | esbuild  | branch-v-cand-full  | 2475  | +1554 | 1137 | +617  | 1029   | +556  | yes            | no               |
| import { pipe }                    | rolldown | main                | 922   | -     | 517  | -     | 466    | -     | no             | no               |
| import { pipe }                    | rolldown | branch-v-cand-base  | 2260  | +1338 | 1085 | +568  | 984    | +518  | yes            | no               |
| import { pipe }                    | rolldown | branch-v-cand-map   | 2265  | +1343 | 1087 | +570  | 980    | +514  | yes            | no               |
| import { pipe }                    | rolldown | branch-v-cand-forof | 2467  | +1545 | 1122 | +605  | 1013   | +547  | yes            | no               |
| import { pipe }                    | rolldown | branch-v-cand-full  | 2472  | +1550 | 1124 | +607  | 1017   | +551  | yes            | no               |
| import { pipe, map, filter, take } | esbuild  | main                | 1577  | -     | 783  | -     | 714    | -     | no             | no               |
| import { pipe, map, filter, take } | esbuild  | branch-v-cand-base  | 3023  | +1446 | 1414 | +631  | 1284   | +570  | yes            | no               |
| import { pipe, map, filter, take } | esbuild  | branch-v-cand-map   | 3051  | +1474 | 1426 | +643  | 1291   | +577  | yes            | no               |
| import { pipe, map, filter, take } | esbuild  | branch-v-cand-forof | 3230  | +1653 | 1456 | +673  | 1323   | +609  | yes            | no               |
| import { pipe, map, filter, take } | esbuild  | branch-v-cand-full  | 3258  | +1681 | 1478 | +695  | 1341   | +627  | yes            | no               |
| import { pipe, map, filter, take } | rolldown | main                | 1584  | -     | 770  | -     | 698    | -     | no             | no               |
| import { pipe, map, filter, take } | rolldown | branch-v-cand-base  | 3030  | +1446 | 1415 | +645  | 1284   | +586  | yes            | no               |
| import { pipe, map, filter, take } | rolldown | branch-v-cand-map   | 3058  | +1474 | 1433 | +663  | 1298   | +600  | yes            | no               |
| import { pipe, map, filter, take } | rolldown | branch-v-cand-forof | 3237  | +1653 | 1455 | +685  | 1322   | +624  | yes            | no               |
| import { pipe, map, filter, take } | rolldown | branch-v-cand-full  | 3265  | +1681 | 1476 | +706  | 1339   | +641  | yes            | no               |
| import { unique }                  | esbuild  | main                | 1248  | -     | 671  | -     | 609    | -     | no             | no               |
| import { unique }                  | esbuild  | branch-v-cand-base  | 1232  | -16   | 715  | +44   | 622    | +13   | yes            | no               |
| import { unique }                  | esbuild  | branch-v-cand-map   | 1232  | -16   | 715  | +44   | 622    | +13   | yes            | no               |
| import { unique }                  | esbuild  | branch-v-cand-forof | 1376  | +128  | 746  | +75   | 649    | +40   | yes            | no               |
| import { unique }                  | esbuild  | branch-v-cand-full  | 1376  | +128  | 746  | +75   | 649    | +40   | yes            | no               |
| import { unique }                  | rolldown | main                | 1249  | -     | 661  | -     | 602    | -     | no             | no               |
| import { unique }                  | rolldown | branch-v-cand-base  | 1229  | -20   | 699  | +38   | 614    | +12   | yes            | no               |
| import { unique }                  | rolldown | branch-v-cand-map   | 1229  | -20   | 699  | +38   | 614    | +12   | yes            | no               |
| import { unique }                  | rolldown | branch-v-cand-forof | 1373  | +124  | 729  | +68   | 641    | +39   | yes            | no               |
| import { unique }                  | rolldown | branch-v-cand-full  | 1373  | +124  | 729  | +68   | 641    | +39   | yes            | no               |
| whole library                      | esbuild  | main                | 28146 | -     | 9118 | -     | 8221   | -     | no             | no               |
| whole library                      | esbuild  | branch-v-cand-base  | 29328 | +1182 | 9767 | +649  | 8779   | +558  | yes            | no               |
| whole library                      | esbuild  | branch-v-cand-map   | 29359 | +1213 | 9775 | +657  | 8788   | +567  | yes            | no               |
| whole library                      | esbuild  | branch-v-cand-forof | 29538 | +1392 | 9802 | +684  | 8814   | +593  | yes            | no               |
| whole library                      | esbuild  | branch-v-cand-full  | 29570 | +1424 | 9829 | +711  | 8853   | +632  | yes            | no               |
| whole library                      | rolldown | main                | 28166 | -     | 9088 | -     | 8189   | -     | no             | no               |
| whole library                      | rolldown | branch-v-cand-base  | 29357 | +1191 | 9718 | +630  | 8727   | +538  | yes            | no               |
| whole library                      | rolldown | branch-v-cand-map   | 29388 | +1222 | 9739 | +651  | 8750   | +561  | yes            | no               |
| whole library                      | rolldown | branch-v-cand-forof | 29567 | +1401 | 9759 | +671  | 8763   | +574  | yes            | no               |
| whole library                      | rolldown | branch-v-cand-full  | 29598 | +1432 | 9780 | +692  | 8759   | +570  | yes            | no               |

## Public declarations (against main)

- branch-v-cand-base index.d.ts: text different, declarations with comments stripped DIFFERENT (main 582348 B, branch-v-cand-base 581496 B)
- branch-v-cand-base index.d.cts: text different, declarations with comments stripped DIFFERENT (main 582349 B, branch-v-cand-base 581497 B)
- branch-v-cand-map index.d.ts: text different, declarations with comments stripped DIFFERENT (main 582348 B, branch-v-cand-map 581496 B)
- branch-v-cand-map index.d.cts: text different, declarations with comments stripped DIFFERENT (main 582349 B, branch-v-cand-map 581497 B)
- branch-v-cand-forof index.d.ts: text different, declarations with comments stripped DIFFERENT (main 582348 B, branch-v-cand-forof 581496 B)
- branch-v-cand-forof index.d.cts: text different, declarations with comments stripped DIFFERENT (main 582349 B, branch-v-cand-forof 581497 B)
- branch-v-cand-full index.d.ts: text different, declarations with comments stripped DIFFERENT (main 582348 B, branch-v-cand-full 581496 B)
- branch-v-cand-full index.d.cts: text different, declarations with comments stripped DIFFERENT (main 582349 B, branch-v-cand-full 581497 B)

### Declaration diff: branch-v-cand-base index.d.ts (comments stripped)

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

### Declaration diff: branch-v-cand-map index.d.ts (comments stripped)

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

### Declaration diff: branch-v-cand-forof index.d.ts (comments stripped)

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

### Declaration diff: branch-v-cand-full index.d.ts (comments stripped)

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

Full declaration diffs (including comments) are in results/prepub/bundle.json.
