export type Simplify<T> = { [KeyType in keyof T]: T[KeyType] } & {};
