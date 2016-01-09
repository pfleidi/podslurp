'use strict';

var knex = require('knex');

module.exports = function database(dbConfigFile) {
  const dbConfig = dbConfigFile[process.env.NODE_ENV];

  return knex(dbConfig);
};
