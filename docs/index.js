'use strict';

const path = require('path');
const express = require('express');
const compression = require('compression');

const app = express();

app.use(compression());

app.use(require('connect-history-api-fallback')());

const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'dist')));

app.listen(port);
console.log(`Server is now running at http://localhost:${port}.`);
