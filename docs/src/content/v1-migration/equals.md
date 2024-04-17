# Removed

Replaced with [`isDeepEqual`](/docs/#isDeepEqual), which can now also act as a
guard (type-predicate) in certain cases.

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
