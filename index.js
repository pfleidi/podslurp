'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const path = require('path');

const server = require('./lib/server');
const dbConfigFile = require('./config/database');
const database = require('./lib/database')(dbConfigFile);
const models = require('./models')(database);

const config = {
  port: process.env.PORT || 3000,
  rootpath: process.env.PODSLURP_ROOTPATH
};

var app = server.setup(config, models);

app.listen(config.port);
