import { map } from "remeda";

const DATA = [1, 2, 3] as const;

const result = map(DATA, (x) => x * 2);
//    ^?

console.log(result);
