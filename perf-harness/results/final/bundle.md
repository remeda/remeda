# Bundle size: main, branch

Minified ESM bundles of each import pattern against the copies' built dist (`sideEffects: false` honored). gzip is level 9, brotli quality 11. Deltas are against main.

Top 15 functions (after `pipe`, by usage): sortBy, map, unique, omit, pick, isTruthy, mapValues, filter, isPlainObject, isDeepEqual, groupBy, entries, clone, isEmpty, keys.

| entry                              | bundler  | copy   | min   | delta | gzip | delta | brotli | delta | sentinel Proxy | sentinel message |
| ---------------------------------- | -------- | ------ | ----- | ----- | ---- | ----- | ------ | ----- | -------------- | ---------------- |
| import { map }                     | esbuild  | main   | 350   | -     | 249  | -     | 209    | -     | no             | no               |
| import { map }                     | esbuild  | branch | 337   | -13   | 231  | -18   | 202    | -7    | no             | no               |
| import { map }                     | rolldown | main   | 351   | -     | 247  | -     | 211    | -     | no             | no               |
| import { map }                     | rolldown | branch | 334   | -17   | 229  | -18   | 201    | -10   | no             | no               |
| import { filter, map }             | esbuild  | main   | 500   | -     | 289  | -     | 241    | -     | no             | no               |
| import { filter, map }             | esbuild  | branch | 523   | +23   | 325  | +36   | 291    | +50   | no             | no               |
| import { filter, map }             | rolldown | main   | 505   | -     | 293  | -     | 253    | -     | no             | no               |
| import { filter, map }             | rolldown | branch | 522   | +17   | 324  | +31   | 289    | +36   | no             | no               |
| import { unique }                  | esbuild  | main   | 1248  | -     | 671  | -     | 609    | -     | no             | no               |
| import { unique }                  | esbuild  | branch | 439   | -809  | 276  | -395  | 250    | -359  | no             | no               |
| import { unique }                  | rolldown | main   | 1249  | -     | 661  | -     | 602    | -     | no             | no               |
| import { unique }                  | rolldown | branch | 438   | -811  | 271  | -390  | 241    | -361  | no             | no               |
| import { uniqueBy }                | esbuild  | main   | 1284  | -     | 688  | -     | 624    | -     | no             | no               |
| import { uniqueBy }                | esbuild  | branch | 599   | -685  | 381  | -307  | 344    | -280  | no             | no               |
| import { uniqueBy }                | rolldown | main   | 1285  | -     | 679  | -     | 628    | -     | no             | no               |
| import { uniqueBy }                | rolldown | branch | 594   | -691  | 366  | -313  | 331    | -297  | no             | no               |
| import { difference }              | esbuild  | main   | 1394  | -     | 726  | -     | 660    | -     | no             | no               |
| import { difference }              | esbuild  | branch | 587   | -807  | 332  | -394  | 300    | -360  | no             | no               |
| import { difference }              | rolldown | main   | 1391  | -     | 708  | -     | 653    | -     | no             | no               |
| import { difference }              | rolldown | branch | 586   | -805  | 328  | -380  | 294    | -359  | no             | no               |
| import { intersection }            | esbuild  | main   | 1414  | -     | 738  | -     | 679    | -     | no             | no               |
| import { intersection }            | esbuild  | branch | 772   | -642  | 406  | -332  | 366    | -313  | no             | no               |
| import { intersection }            | rolldown | main   | 1415  | -     | 723  | -     | 667    | -     | no             | no               |
| import { intersection }            | rolldown | branch | 767   | -648  | 398  | -325  | 361    | -306  | no             | no               |
| import { mapWithFeedback }         | esbuild  | main   | 1251  | -     | 675  | -     | 611    | -     | no             | no               |
| import { mapWithFeedback }         | esbuild  | branch | 511   | -740  | 321  | -354  | 283    | -328  | no             | no               |
| import { mapWithFeedback }         | rolldown | main   | 1254  | -     | 668  | -     | 603    | -     | no             | no               |
| import { mapWithFeedback }         | rolldown | branch | 510   | -744  | 319  | -349  | 279    | -324  | no             | no               |
| import { pick }                    | esbuild  | main   | 345   | -     | 240  | -     | 202    | -     | no             | no               |
| import { pick }                    | esbuild  | branch | 218   | -127  | 168  | -72   | 148    | -54   | no             | no               |
| import { pick }                    | rolldown | main   | 344   | -     | 239  | -     | 200    | -     | no             | no               |
| import { pick }                    | rolldown | branch | 215   | -129  | 167  | -72   | 146    | -54   | no             | no               |
| import { omit }                    | esbuild  | main   | 463   | -     | 288  | -     | 239    | -     | no             | no               |
| import { omit }                    | esbuild  | branch | 336   | -127  | 211  | -77   | 182    | -57   | no             | no               |
| import { omit }                    | rolldown | main   | 464   | -     | 286  | -     | 242    | -     | no             | no               |
| import { omit }                    | rolldown | branch | 335   | -129  | 208  | -78   | 180    | -62   | no             | no               |
| import { mapValues }               | esbuild  | main   | 362   | -     | 247  | -     | 207    | -     | no             | no               |
| import { mapValues }               | esbuild  | branch | 235   | -127  | 182  | -65   | 152    | -55   | no             | no               |
| import { mapValues }               | rolldown | main   | 361   | -     | 248  | -     | 205    | -     | no             | no               |
| import { mapValues }               | rolldown | branch | 232   | -129  | 181  | -67   | 152    | -53   | no             | no               |
| import { groupBy }                 | esbuild  | main   | 478   | -     | 306  | -     | 252    | -     | no             | no               |
| import { groupBy }                 | esbuild  | branch | 351   | -127  | 244  | -62   | 210    | -42   | no             | no               |
| import { groupBy }                 | rolldown | main   | 479   | -     | 305  | -     | 254    | -     | no             | no               |
| import { groupBy }                 | rolldown | branch | 350   | -129  | 241  | -64   | 212    | -42   | no             | no               |
| import { clamp }                   | esbuild  | main   | 340   | -     | 239  | -     | 203    | -     | no             | no               |
| import { clamp }                   | esbuild  | branch | 213   | -127  | 168  | -71   | 153    | -50   | no             | no               |
| import { clamp }                   | rolldown | main   | 341   | -     | 239  | -     | 208    | -     | no             | no               |
| import { clamp }                   | rolldown | branch | 212   | -129  | 169  | -70   | 143    | -65   | no             | no               |
| import { clone }                   | esbuild  | main   | 761   | -     | 392  | -     | 340    | -     | no             | no               |
| import { clone }                   | esbuild  | branch | 648   | -113  | 339  | -53   | 298    | -42   | no             | no               |
| import { clone }                   | rolldown | main   | 760   | -     | 395  | -     | 341    | -     | no             | no               |
| import { clone }                   | rolldown | branch | 647   | -113  | 335  | -60   | 303    | -38   | no             | no               |
| import { add }                     | esbuild  | main   | 292   | -     | 214  | -     | 179    | -     | no             | no               |
| import { add }                     | esbuild  | branch | 165   | -127  | 140  | -74   | 125    | -54   | no             | no               |
| import { add }                     | rolldown | main   | 293   | -     | 216  | -     | 184    | -     | no             | no               |
| import { add }                     | rolldown | branch | 164   | -129  | 138  | -78   | 111    | -73   | no             | no               |
| import { purry }                   | esbuild  | main   | 246   | -     | 193  | -     | 161    | -     | no             | no               |
| import { purry }                   | esbuild  | branch | 119   | -127  | 108  | -85   | 99     | -62   | no             | no               |
| import { purry }                   | rolldown | main   | 245   | -     | 193  | -     | 156    | -     | no             | no               |
| import { purry }                   | rolldown | branch | 116   | -129  | 112  | -81   | 95     | -61   | no             | no               |
| import { sortBy }                  | esbuild  | main   | 615   | -     | 365  | -     | 343    | -     | no             | no               |
| import { sortBy }                  | esbuild  | branch | 614   | -1    | 366  | +1    | 341    | -2    | no             | no               |
| import { sortBy }                  | rolldown | main   | 620   | -     | 358  | -     | 334    | -     | no             | no               |
| import { sortBy }                  | rolldown | branch | 619   | -1    | 359  | +1    | 334    | 0     | no             | no               |
| import { pipe }                    | esbuild  | main   | 921   | -     | 520  | -     | 473    | -     | no             | no               |
| import { pipe }                    | esbuild  | branch | 2120  | +1199 | 976  | +456  | 862    | +389  | yes            | yes              |
| import { pipe }                    | rolldown | main   | 922   | -     | 517  | -     | 466    | -     | no             | no               |
| import { pipe }                    | rolldown | branch | 2117  | +1195 | 964  | +447  | 860    | +394  | yes            | yes              |
| import { pipe, map, filter, take } | esbuild  | main   | 1577  | -     | 783  | -     | 714    | -     | no             | no               |
| import { pipe, map, filter, take } | esbuild  | branch | 2792  | +1215 | 1285 | +502  | 1147   | +433  | yes            | yes              |
| import { pipe, map, filter, take } | rolldown | main   | 1584  | -     | 770  | -     | 698    | -     | no             | no               |
| import { pipe, map, filter, take } | rolldown | branch | 2789  | +1205 | 1275 | +505  | 1141   | +443  | yes            | yes              |
| top 15 functions, no pipe          | esbuild  | main   | 5005  | -     | 1857 | -     | 1706   | -     | no             | no               |
| top 15 functions, no pipe          | esbuild  | branch | 4106  | -899  | 1539 | -318  | 1422   | -284  | no             | no               |
| top 15 functions, no pipe          | rolldown | main   | 5002  | -     | 1838 | -     | 1678   | -     | no             | no               |
| top 15 functions, no pipe          | rolldown | branch | 4105  | -897  | 1532 | -306  | 1419   | -259  | no             | no               |
| pipe + top 15 functions            | esbuild  | main   | 5015  | -     | 1862 | -     | 1703   | -     | no             | no               |
| pipe + top 15 functions            | esbuild  | branch | 6214  | +1199 | 2339 | +477  | 2132   | +429  | yes            | yes              |
| pipe + top 15 functions            | rolldown | main   | 5012  | -     | 1842 | -     | 1684   | -     | no             | no               |
| pipe + top 15 functions            | rolldown | branch | 6205  | +1193 | 2335 | +493  | 2131   | +447  | yes            | yes              |
| whole library                      | esbuild  | main   | 28146 | -     | 9118 | -     | 8221   | -     | no             | no               |
| whole library                      | esbuild  | branch | 29917 | +1771 | 9813 | +695  | 8815   | +594  | yes            | yes              |
| whole library                      | rolldown | main   | 28166 | -     | 9088 | -     | 8189   | -     | no             | no               |
| whole library                      | rolldown | branch | 29941 | +1775 | 9769 | +681  | 8729   | +540  | yes            | yes              |

## Public declarations (against main)

- branch index.d.ts: text different, declarations with comments stripped DIFFERENT (main 582348 B, branch 582133 B)
- branch index.d.cts: text different, declarations with comments stripped DIFFERENT (main 582349 B, branch 582134 B)

### Declaration diff: branch index.d.ts (comments stripped)

```diff
@@ -840,12 +840,12 @@
 declare function identity(): IdentityFunction;
 declare function indexBy<T, K extends PropertyKey>(data: readonly T[], mapper: (item: T, index: number, data: readonly T[]) => K): BoundedPartial<Record<K, T>>;
 declare function indexBy<T, K extends PropertyKey>(mapper: (item: T, index: number, data: readonly T[]) => K): (data: readonly T[]) => BoundedPartial<Record<K, T>>;
-declare function intersection<T, S>(data: readonly T[], other: readonly S[]): (S & T)[];
-declare function intersection<S>(other: readonly S[]): <T>(data: readonly T[]) => (S & T)[];
-type IsEqual<TFirst, TSecond> = (a: TFirst, b: TSecond) => boolean;
-declare function intersectionWith<TFirst, TSecond>(array: readonly TFirst[], other: readonly TSecond[], isEqual: IsEqual<TFirst, TSecond>): TFirst[];
-declare function intersectionWith<TFirst, TSecond>(other: readonly TSecond[],
-isEqual: IsEqual<TFirst, TSecond>): (array: readonly TFirst[]) => TFirst[];
+declare function intersection<T, S>(data: readonly T[], other: readonly S[]): (T & S)[];
+declare function intersection<S>(other: readonly S[]): <T>(data: readonly T[]) => (T & S)[];
+type IsEqual<T, S> = (a: T, b: S) => boolean;
+declare function intersectionWith<T, S>(data: readonly T[], other: readonly S[], isEqual: IsEqual<T, S>): T[];
+declare function intersectionWith<T, S>(other: readonly S[],
+isEqual: IsEqual<T, S>): (data: readonly T[]) => T[];
 type Inverted<T extends object> = Simplify<{ -readonly [K in keyof T as K extends number | string ? Required<T>[K] extends PropertyKey ? Required<T>[K] : never : never]: ToString<K>; }>;
 declare function invert<T extends object>(object: T): Inverted<T>;
 declare function invert<T extends object>(): (object: T) => Inverted<T>;
@@ -937,9 +937,9 @@
 type MappedValues<T extends object, Value> = Simplify<{ -readonly [P in keyof T as P extends number | string ? P : never]: Value; }>;
 declare function mapValues<T extends object, Value>(data: T, valueMapper: (value: EnumerableStringKeyedValueOf<T>, key: EnumerableStringKeyOf<T>, data: T) => Value): MappedValues<T, Value>;
 declare function mapValues<T extends object, Value>(valueMapper: (value: EnumerableStringKeyedValueOf<T>, key: EnumerableStringKeyOf<T>, data: T) => Value): (data: T) => MappedValues<T, Value>;
-type LazyFeedbackCallback<T extends IterableContainer, U> = (previousValue: U, currentValue: T[number], currentIndex: number, data: Readonly<NonEmptyPrefix<T>>) => U;
-declare function mapWithFeedback<T extends IterableContainer, U>(data: T, callbackfn: LazyFeedbackCallback<T, U>, initialValue: U): Mapped<T, U>;
-declare function mapWithFeedback<T extends IterableContainer, U>(callbackfn: LazyFeedbackCallback<T, U>, initialValue: U): (data: T) => Mapped<T, U>;
+type FeedbackCallback<T extends IterableContainer, U, Data = T> = (previousValue: U, currentValue: T[number], currentIndex: number, data: Readonly<Data>) => U;
+declare function mapWithFeedback<T extends IterableContainer, U>(data: T, callbackfn: FeedbackCallback<T, U>, initialValue: U): Mapped<T, U>;
+declare function mapWithFeedback<T extends IterableContainer, U>(callbackfn: FeedbackCallback<T, U, NonEmptyPrefix<T>>, initialValue: U): (data: T) => Mapped<T, U>;
 type Mean<T extends IterableContainer<number>> = (T extends readonly [] ? never : number) | (T extends readonly [unknown, ...unknown[]] ? never : undefined);
 declare function mean<T extends IterableContainer<number>>(data: T): Mean<T>;
 declare function mean(): <T extends IterableContainer<number>>(data: T) => Mean<T>;
@@ -1149,27 +1149,9 @@
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
+type DataFirst<T, P extends readonly unknown[], R> = (data: T, ...args: P) => R;
+type UnaryFunction<T = unknown, R = unknown> = (data: T) => R;
+declare const purry: <T, P extends readonly unknown[], R>(dataFirst: DataFirst<T, P, R>, args: readonly unknown[]) => R | UnaryFunction<T, R>;
 declare function randomBigInt(from: bigint, to: bigint): bigint;
 type MaxLiteral = 1000;
 type RandomInteger<From extends number, To extends number> = IsNever<NonNegativeInteger<From>> extends true ? number : IsNever<NonNegativeInteger<To>> extends true ? number : IsEqual$2<From, To> extends true ? From : GreaterThan<From, To> extends true ? never : GreaterThanOrEqual<To, MaxLiteral> extends true ? number : IntRangeInclusive<From, To>;
@@ -1362,7 +1344,7 @@
 type Deduped<T extends IterableContainer> = T extends readonly [] ? [] : T extends readonly [infer Head, ...infer Rest] ? [Head, ...Rest[number][]] : T extends readonly [...unknown[], unknown] ? NonEmptyArray<T[number]> : T[number][];
 declare function unique<T extends IterableContainer>(data: T): Deduped<T>;
 declare function unique(): <T extends IterableContainer>(data: T) => Deduped<T>;
-declare function uniqueBy<T extends IterableContainer>(data: T, keyFunction: LazyCallback<T, unknown>): Deduped<T>;
+declare function uniqueBy<T extends IterableContainer>(data: T, keyFunction: (value: T[number], index: number, data: Readonly<T>) => unknown): Deduped<T>;
 declare function uniqueBy<T extends IterableContainer>(keyFunction: LazyCallback<T, unknown>): (data: T) => Deduped<T>;
 type IsEquals<T> = (a: T, b: T) => boolean;
 declare function uniqueWith<T extends IterableContainer>(data: T, isEquals: IsEquals<T[number]>): Deduped<T>;
```

Full declaration diffs (including comments) are in results/final/bundle.json.
