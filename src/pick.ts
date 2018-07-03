export function pick<T extends {}, K extends keyof T>(
  object: T,
  names: K[]
): Pick<T, K>;

export function pick<T extends {}, K extends keyof T>(
  names: K[]
): (object: T) => Pick<T, K>;

export function pick(arg1: any, arg2?: any): any {
  if (arguments.length === 1) {
    return (object: any) => _pick(object, arg1);
  }
  return _pick(arg1, arg2);
}

function _pick(object: any, names: string[]) {
  return names.reduce(
    (acc, name) => {
      acc[name] = object[name];
      return acc;
    },
    {} as any
  );
}
