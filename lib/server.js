'use strict';

const fs = require('fs');

const express = require('express');
const send = require('send');
const morgan = require('morgan');
const errorHandler = require('errorhandler');
const compression = require('compression');

const expressLogStream = fs.createWriteStream('./logs/express.log', { flags: 'a' });

exports.start = function start(config) {
  var statsDB = require('./statsdb')(config);
  var sender = require('./sender')(config, statsDB);
  var api = require('./api')(config, statsDB);

  var app = express();

  app.use(compression());
  app.use(morgan('combined', { stream: expressLogStream }));

  if (app.settings.env == 'production') {
    app.use(errorHandler());
  } else {
    app.use(errorHandler({ dumpExceptions: true, showStack: true }));
  }

  app.get('/api/stats.json', api);
  app.get('/*', sender);

  return app;
};
