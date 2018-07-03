export function merge<A, B>(a: A, b: B): A & B;
export function merge<A, B>(b: B): (a: A) => A & B;

export function merge(arg1: any, arg2?: any): any {
  if (arguments.length === 1) {
    return (data: any) => _merge(data, arg1);
  }
  return _merge(arg1, arg2);
}

function _merge<A, B>(a: A, b: B) {
  // tslint:disable-next-line:prefer-object-spread
  return Object.assign({}, a, b);
}
