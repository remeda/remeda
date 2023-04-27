type TestObj =
  | boolean
  | string
  | { a: string }
  | (() => void)
  | Array<number>
  | Date
  | undefined
  | null
  | Error
  | number
  | Promise<number>;

export const typesDataProvider = (
  t:
    | 'string'
    | 'boolean'
    | 'object'
    | 'function'
    | 'array'
    | 'date'
    | 'undefined'
    | 'null'
    | 'error'
    | 'number'
    | 'promise'
): TestObj => {
  switch (t) {
    case 'number':
      return 5;
    case 'array':
      return [1, 2, 3];
    case 'boolean':
      return false;
    case 'date':
      return new Date();
    case 'function':
      return () => {
        /* (intentionally empty) */
      };
    case 'null':
      return null;
    case 'promise':
      return Promise.resolve(5);
    case 'string':
      return 'text';
    case 'object':
      return { a: 'asd' };
    case 'error':
      return new Error('asd');
  }
  return 'text';
};
