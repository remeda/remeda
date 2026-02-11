#!/usr/bin/env node

import { main } from "./main.js";

try {
  main(process.argv.slice(2));
  process.exit(0);
} catch (error) {
  console.error("Unexpected error:", error);
  process.exit(1);
}
