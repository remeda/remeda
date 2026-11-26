export type ReorderedArray<T extends readonly unknown[]> = {
  -readonly [P in keyof T]: T[number];
};
