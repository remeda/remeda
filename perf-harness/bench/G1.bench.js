import { bench, describe } from "vitest";
import { benchGroup } from "../harness/benchGroup.js";

await benchGroup("G1", { bench, describe });
