import { start } from "repl";

console.log("🎉 Welcome to the Remeda Interactive Sandbox!");
console.log("=".repeat(50));
console.log("");

const repl = start({
  prompt: "R> ",
  useColors: true,
  useGlobal: true,
});

// Make ALL remeda functions globally available
import("remeda").then((R) => Object.assign(repl.context, R));

console.log("✅ All Remeda utilities are injected into the global scope.");
console.log("");
console.log("Try these examples:");
console.log("  map([1, 2, 3], x => x * 3)");
console.log("  filter([1, 2, 3, 4], x => x % 2 === 0)");
console.log("  pipe([1, 2, 3], map(x => x * 2), filter(x => x > 2))");
console.log("  chunk([1, 2, 3, 4, 5, 6], 2)");
console.log("");

// Ensure prompt is displayed after context setup
repl.displayPrompt();
