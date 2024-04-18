# Removed

Replaced with [`isDeepEqual`](/docs/#isDeepEqual). isDeepEqual has a slightly
different return type (in some cases) allowing it to narrow the result.

## Examples

### Simple

```ts
// Was
R.equals({ a: { b: 123 } }, { a: { b: 456 } });

// Now
R.isDeepEqual({ a: { b: 123 } }, { a: { b: 456 } });
```

### Type Predicate

```ts
// Was
const result = R.filter([] as ("cat" | "dog")[], R.equals("cat"));
//    ^? ("cat" | "dog")[]

// Now
const result = R.filter([] as ("cat" | "dog")[], R.isDeepEqual("cat"));
//    ^? "dog"[]
```
