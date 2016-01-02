'use strict';

const url = require('url');
const send = require('send');

module.exports = function sender(config, statsDB) {

  function createSendStream(req, res) {
    var sentBytes = 0;
    var totalBytes = -1;

    function error(code, err) {
      res.statusCode = code || 500;
      var message = message ? err.message : 'File not found!';

      return res.end(message);
    }

    function headers(res, path, stat) {
      res.setHeader('Content-Disposition', 'attachment');
    }

    function redirect(res) {
      res.statusCode = 301;
      res.setHeader('Location', req.url + '/');
      res.end('Redirecting to ' + req.url + '/');
    }

    function onFile(path, stat) {
      totalBytes = stat.size;
    }

    function onStream(stream) {
      stream.on('data', function (data) {
        sentBytes += data.length;
        statsDB.inc(req.path, 'sentBytes', data.length);
      });
    }

    function onEnd() {
      if (sentBytes === totalBytes) {
        statsDB.count(req.path, 'complete');
      } else {
        statsDB.count(req.path, 'incomplete');
      }
    }

    return send(req, req.path, { root: config.rootdir })
    .on('error', error)
    .on('end', onEnd)
    .on('directory', redirect)
    .on('headers', headers)
    .on('file', onFile)
    .on('stream', onStream)
    .pipe(res);
  }

  return createSendStream;
};
