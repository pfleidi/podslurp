'use strict';

const url = require('url');
const send = require('send');

module.exports = function sender(config, statistics) {

  function createSendStream(req, res) {
    var sentBytes = 0;
    var totalBytes = -1;

    function onError(err) {
      res.statusCode = err.status || 500;
      var message = 'File not found: ' + req.path;

      return res.end(message);
    }

    function headers(res, path, stat) {
      res.setHeader('Content-Disposition', 'attachment');
    }

    function onFile(path, stat) {
      totalBytes = stat.size;
    }

    function onStream(stream) {
      stream.on('data', function (data) {
        sentBytes += data.length;
        statistics.countBytes(req.path, data.length);
      });
    }

    function onEnd() {
      if (sentBytes === totalBytes) {
        statistics.countCompleteDownload(req.path, req.headers);
      } else {
        statistics.countIncompleteDownload(req.path, req.headers);
      }
    }

    var sendStream = send(req, req.path, { root: config.rootpath })
    .on('error', onError)
    .on('end', onEnd)
    .on('headers', headers)
    .on('file', onFile)
    .on('stream', onStream)
    .pipe(res);

    sendStream.on('close', function () {
      statistics.countIncompleteDownload(req.path, req.headers);
    });

    return sendStream;
  }

  return createSendStream;
};
