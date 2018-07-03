export function objOf<T, K extends string>(value: T, prop: K): { [x in K]: T };
export function objOf<T, K extends string>(
  prop: K
): (value: T) => { [x in K]: T };

export function objOf(arg1: any, arg2?: any): any {
  if (arguments.length === 1) {
    return (object: any) => _objOf(object, arg1);
  }
  return _objOf(arg1, arg2);
}

function _objOf(value: any, prop: string) {
  return { [prop]: value };
}
