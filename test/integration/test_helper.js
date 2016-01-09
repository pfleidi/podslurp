'use strict';

process.env.NODE_ENV = 'test';

const path = require('path');

const appDir = path.join(__dirname, '..', '..');
const fixtureDir = path.join(appDir, 'test', 'fixtures');

const dbConfigFile = require(appDir + '/config/database');
const database = require(appDir + '/lib/database')(dbConfigFile);
const models = require(appDir + '/models')(database);

const app = require('../../lib/server').setup(
  { rootpath: fixtureDir }, models
);

module.exports = {
  models: models,
  app: app
};

