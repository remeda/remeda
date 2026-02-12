#!/usr/bin/env node

import { main } from "./main.js";

try {
  await main(process.argv.slice(1));
  process.exit(0);
} catch (error) {
  console.error("Unexpected error:", error);
  process.exit(1);
}
