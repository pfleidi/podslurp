'use strict';

const fs = require('fs');
const path = require('path');

const express = require('express');
const send = require('send');
const morgan = require('morgan');
const errorHandler = require('errorhandler');
const compression = require('compression');


exports.start = function start(config) {
  var statsDB = require('./statsdb')(config);
  var sender = require('./sender')(config, statsDB);
  var api = require('./api')(config, statsDB);

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

  app.get('/api/stats.json', api);
  app.get('/*', sender);

  return app;
};
