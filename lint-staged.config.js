module.exports = {
  // Docs site
  'docs/**/*.+(js|ts|jsx|tsx|mjs|cjs)': [
    'cd docs && eslint --fix',
    'cd docs && prettier --write',
  ],
  'docs/**/*.+(json|json5|yaml|yml|css|scss|less|htm|html|svg|md|graphql)':
    'cd docs && prettier --write',

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
