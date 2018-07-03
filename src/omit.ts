export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export function omit<T extends {}, K extends keyof T>(
  object: T,
  names: K[]
): Omit<T, K>;

export function omit<T extends {}, K extends keyof T>(
  names: K[]
): (object: T) => Omit<T, K>;

export function omit(arg1: any, arg2?: any): any {
  if (arguments.length === 1) {
    return (object: any) => _omit(object, arg1);
  }
  return _omit(arg1, arg2);
}

function _omit<T extends {}, K extends keyof T>(
  object: T,
  names: K[]
): Omit<T, K> {
  const set = new Set(names as string[]);
  return Object.entries(object).reduce(
    (acc, [name, value]) => {
      if (!set.has(name)) {
        acc[name] = value;
      }
      return acc;
    },
    {} as any
  ) as Omit<T, K>;
}
