module.exports = {
  // Code
  '*.+(js|ts|jsx|tsx|mjs|cjs)': ['eslint --fix', 'prettier --write'],
  // Configs
  '*.+(json|json5|yaml|yml)': 'prettier --write',
  // CSS
  '*.+(css|scss|less)': 'prettier --write',
  // Web
  '*.+(htm|html|svg)': 'prettier --write',
  // Markdown
  '*.md': 'prettier --write',
  // GraphQL
  '*.graphql': 'prettier --write',
};
