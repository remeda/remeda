import { start } from "node:repl";

console.log("🎉 Welcome to the Remeda interactive console!");
console.log("=".repeat(44));
console.log("");
console.log("💡 Try these examples to get started:");
console.log("");
console.log("   map([1, 2, 3], x => x * 2)");
console.log("   filter([1, 2, 3, 4], x => x % 2 === 0)");
console.log("   pipe([1, 2, 3], map(x => x * 2), filter(x => x > 2))");
console.log("   chunk([1, 2, 3, 4, 5, 6], 2)");
console.log("");
console.log("📚 Explore more at: https://remedajs.com/docs");
console.log("");

const repl = start({ prompt: "Remeda> " });

import("remeda").then((remeda) => {
  Object.assign(repl.context, remeda);
  console.log("🚀 Remeda utilities loaded successfully!");
  console.log("   All functions are available in the global scope.");
  console.log("");
  // Ensure prompt is displayed after context setup
  repl.displayPrompt();
});
