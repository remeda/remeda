# Removed

Use the built-in `typeof` and `instanceof` operators instead, or use a type-
guard, [`isString`](/docs/#isString), [`isNumber`](/docs/#isNumber),
[`isPlainObject`](/docs/#isPlainObject), [`isArray`](/docs/#isArray), etc...

## Examples

### Object

```ts
const DATA = {};

// Was
type(DATA) === "Object";

// Now
typeof DATA === "object";

// Or
isPlainObject(DATA);
```

### Number

```ts
const DATA = 123;

// Was
type(DATA) === "Number";

// Now
typeof DATA === "number";

// Or
isNumber(DATA);
```

### Boolean

```ts
const DATA = true;

// Was
type(DATA) === "Boolean";

// Now
typeof DATA === "boolean";

// Or
isBoolean(DATA);
```

### String

```ts
const DATA = "abc";

// Was
type(DATA) === "String";

// Now
typeof DATA === "string";

// Or
isString(DATA);
```

### Null

```ts
const DATA = null;

// Was
type(DATA) === "Null";

// Now
DATA === null;
```

### Array

```ts
const DATA = [];

// Was
type(DATA) === "Array";

// Now
Array.isArray(DATA);

// Or
isArray(DATA);
```

### RegExp

```ts
const DATA = /abc/;

// Was
type(DATA) === "RegExp";

// Now
DATA instanceof RegExp;
```

### Function

```ts
const DATA = () => {};

// Was
type(DATA) === "Function";

// Now
typeof DATA === "function";

// Or
isFunction(DATA);
```

### Undefined

```ts
const DATA = undefined;

// Was
type(DATA) === "Undefined";

// Now
DATA === undefined;
```
