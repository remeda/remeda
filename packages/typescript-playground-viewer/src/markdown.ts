type Output = {
  readonly code: string;
  readonly diagnostics: string;
  readonly effectiveVersion: string;
  readonly compilerOptions: Record<string, unknown>;
};

export function outputMarkdown({
  code,
  diagnostics,
  effectiveVersion,
  compilerOptions,
}: Output): void {
  // -- Frontmatter --
  console.log("---");
  console.log(`typeScriptVersion: ${effectiveVersion}`);
  const compilerOptionOverrides = Object.entries(compilerOptions).filter(
    ([key]) => key !== "ts",
  );
  if (compilerOptionOverrides.length > 0) {
    console.log("compilerOptions:");
    for (const [key, value] of compilerOptionOverrides) {
      console.log(`  ${key}: ${JSON.stringify(value)}`);
    }
  }
  console.log("---\n");

  // -- Source --
  console.log("# Source\n");
  console.log(`\`\`\`typescript\n${code}\n\`\`\`\n`);

  // -- Diagnostics --
  console.log("# Diagnostics\n");
  if (diagnostics === "") {
    console.log("No errors or warnings.");
  } else {
    console.log(diagnostics);
  }
}
