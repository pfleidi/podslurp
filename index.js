'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const path = require('path');

const server = require('./lib/server');
const dbConfigFile = require('./config/database');
const database = require('./lib/database')(dbConfigFile);
const models = require('./models')(database);

var argv = require('yargs')
.usage('Usage: $0 --rootpath /path/to/filedir [--port PORT]')
.option('rootpath', {
  alias: 'r',
  describe: 'the root path where the files are located',
  demand: true
})
.option('port', {
  alias: 'p',
  describe: 'the port to listen on',
  default: 3000
})
.argv;

var app = server.setup(argv, models);

app.listen(argv.port);
