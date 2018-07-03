export function range(end: number): number[];
// tslint:disable-next-line:unified-signatures
export function range(start: number, end: number): number[];

export function range(arg1: number, arg2?: number) {
  const [start, end] = arguments.length === 1 ? [0, arg1] : [arg1, arg2];
  const ret: number[] = [];
  for (let i = start; i < end; i++) {
    ret.push(i);
  }
  return ret;
}
