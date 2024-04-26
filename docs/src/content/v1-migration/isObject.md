# Removed

This function was doing 3 _different_ type checks combined together: it was
checking the object is `typeof === "object"`, is not `null`, and is not an
Array; but the intent behind it was to check for simple objects. Instead it is
now split into 2 functions: [`isPlainObject`](/docs/#isPlainObject) that checks
for a record-like (or struct-like) object that maps properties with values; and [`isObjectType`](/docs/#isObjectType)
which just checks the runtime type of the item, as defined by the [`typeof`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof)
operator. If unsure what to use try `isPlainObject` first, and if not then use
`isObjectType` and maybe add other checks to refine further. To achieve the
exact same behavior as the current function use `isObjectType`, together with
[`isNonNull`](/docs/#isNonNull) and a negated [`isArray`](/docs/#isArray).

## Examples

### Plain object

```ts
const DATA = [] as (Date | { a: number })[];

// Was
const filtered = filter(DATA, isObject);
//    ^? (Date | { a: number })[]

// Now
const filtered = filter(DATA, isPlainObject);
//    ^? { a: number }[]
```

### Object type

```ts
const DATA = [] as ({ a: number } | number[])[];

// Was
const filtered = filter(DATA, isObject);
//    ^? { a: number }[]

// Now
const filtered = filter(DATA, isObjectType);
//    ^? ({ a: number } | number[])[]
```

### Legacy (dataFirst)

```ts
// Was
if (isObject(DATA)) {
  //
}

// Now
if (isObjectType(DATA) && isNonNull(DATA) && !isArray(DATA)) {
  //
}
```

### Legacy (dataLast)

```ts
// Was
filter(DATA, isObject);

// Now
pipe(DATA, filter(isObjectType), filter(isNonNull), filter(isNot(isArray)));
```
