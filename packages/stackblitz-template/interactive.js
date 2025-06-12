import { start } from "node:repl";

const repl = start({ prompt: "" });

console.log("Loading the Remeda utilities into the global scope...");
import("remeda").then((remeda) => {
  Object.assign(repl.context, remeda);
  console.log("✅ Done!");
  console.log("");
  console.log(
    "You can now use Remeda utilities directly in the console, e.g.,",
  );
  console.log("");
  console.log("\tmap([1, 2, 3], add(4));");
  console.log("");

  repl.setPrompt("Remeda> ");
  repl.displayPrompt();
});
