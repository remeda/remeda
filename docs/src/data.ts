import { groupBy, isTruthy, values, pipe, flatten, map } from 'remeda';

import data from '../build/data.json';
import type { FunctionsData } from '../scripts/transform';

export type FunctionData = FunctionsData[number];

const FUNCTIONS_DATA = data as FunctionsData;

export const getTags = (func: FunctionData) => {
  const [method] = func.methods;

  return [
    method.pipeable && 'pipeable',
    method.indexed && 'indexed',
    method.strict && 'strict',
  ].filter(isTruthy);
};

export const NAV_ENTRIES = pipe(
  FUNCTIONS_DATA,
  map(func => ({
    category: func.category,
    name: func.name,
    tags: getTags(func),
  })),
  groupBy(func => func.category)
);

export const FUNCTIONS = pipe(
  FUNCTIONS_DATA,
  groupBy(func => func.category),
  values,
  flatten()
);
