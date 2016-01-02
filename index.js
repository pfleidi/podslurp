'use strict';

const fs = require('fs');
const path = require('path');
const url = require('url');

const express = require('express');
const send = require('send');

var argv = require('yargs')
.usage('Usage: $0 -r /path/to/filedir')
.demand('r')
.alias('r', 'rootdir')
.argv

const app = express();
const config = { rootdir: argv.r };

const statsDB = require('./lib/statsdb')(config);
const sender = require('./lib/sender')(config, statsDB);
const api = require('./lib/api')(config, statsDB);

app.get('/api/stats.json', api);
app.get('/*', sender);

app.listen(3000);

