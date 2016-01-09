'use strict';

const fs = require('fs');
const path = require('path');

const express = require('express');
const send = require('send');
const morgan = require('morgan');
const errorHandler = require('errorhandler');
const compression = require('compression');

exports.setup = function setup(config, models) {
  var sender = require('../routes/sender')(config, models);
  var api = require('../routes/api')(config, models);

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
