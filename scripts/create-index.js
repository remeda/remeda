const fs = require('fs');
const path = require('path');

const content = fs
  .readdirSync(path.join(__dirname, '../src'))
  .filter(
    name =>
      name.endsWith('.ts') && !name.includes('test.ts') && !name.startsWith('_')
  )
  .map(name => name.replace('.ts', ''))
  .filter(name => name !== 'index')
  .map(name => `export * from './${name}';`)
  .join('\n');

fs.writeFileSync(path.join(__dirname, '../src/index.ts'), content);
