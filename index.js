'use strict';

const server = require('./lib/server');

var argv = require('yargs')
.usage('Usage: $0 --rootpath /path/to/filedir [--port PORT]')
.option('rootpath', {
  alias: 'r',
  describe: "the root path where the files are located",
  demand: true
})
.option('port', {
  alias: 'p',
  describe: "the port to listen on",
  default: 3000
}).argv;

var config = { rootdir: argv.rootpath };
var app = server.start(config);

app.listen(argv.port);
