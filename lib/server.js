'use strict';

const fs = require('fs');
const path = require('path');

const express = require('express');
const send = require('send');
const morgan = require('morgan');
const errorHandler = require('errorhandler');
const compression = require('compression');

exports.setup = function setup(config, statistics) {
  var sender = require('./sender')(config, statistics);
  var api = require('./api')(config, statistics);

  var app = express();
  var logPath = path.join('./logs', app.settings.env + '.log');
  var expressLogStream = fs.createWriteStream(logPath, { flags: 'a' });

  app.use(compression());
  app.use(morgan('combined', { stream: expressLogStream }));

  if (app.settings.env == 'production') {
    app.use(errorHandler());
  } else {
    app.use(errorHandler({ dumpExceptions: true, showStack: true }));
  }

  app.get('/api/stats', api);
  app.get('/*', sender);

  return app;
};
