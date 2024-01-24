import data from "~/build/data.json";
import type { FunctionsData } from "~/scripts/transform";

import { groupBy, isTruthy, values, pipe, flatten, map } from "../../src";

export type FunctionData = FunctionsData[number];

const functionsData = data as FunctionsData;

export const getTags = (func: FunctionData) => {
  const [method] = func.methods;

  return [
    method.pipeable && "pipeable",
    method.indexed && "indexed",
    method.strict && "strict",
  ].filter(isTruthy);
};

export const navEntries = pipe(
  functionsData,
  map((func) => ({
    category: func.category,
    name: func.name,
    tags: getTags(func),
  })),
  groupBy((func) => func.category),
);

export const functions = pipe(
  functionsData,
  groupBy((func) => func.category),
  values,
  flatten(),
);
