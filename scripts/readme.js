const fs = require('fs');
const path = require('path');
const marked = require('marked');

const md = fs.readFileSync(path.join(__dirname, '../README.md'), 'utf8');

console.log(marked(md));
