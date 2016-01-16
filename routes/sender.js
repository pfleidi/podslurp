'use strict';

const url = require('url');
const send = require('send');

module.exports = function sender(config, models) {
  var Download = models.Download;

  function createSendStream(req, res) {
    var startTime = new Date();
    var sentBytes = 0;
    var totalBytes = -1;

    function onError(err) {
      res.statusCode = err.status || 500;
      var message = 'File not found: ' + req.path;

      return res.end(message);
    }

    function onHeaders(res, path, stat) {
      res.setHeader('Content-Disposition', 'attachment');
    }

    function onFile(path, stat) {
      totalBytes = stat.size;
    }

    function onStream(stream) {
      stream.on('data', function (data) {
        sentBytes += data.length;
      });
    }

    function onEnd() {
      var duration = new Date() - startTime;
      var transferState = sentBytes === totalBytes ? 'completed' : 'partial';
      var values = extractValues(transferState, duration);

      Download.create(values);
    }

    function extractValues(transferState, duration) {
      return {
        file_name: req.path,
        transfer_state: transferState,
        transferred_bytes: sentBytes,
        transfer_time: duration,
        response_code: res.statusCode,
        ip_address: req.ip,
        raw_user_agent: req.headers['user-agent'] || 'unknown',
        raw_referrer: req.headers.referrer || 'unknown'
      };
    }

    var sendStream = send(req, req.path, { root: config.rootpath })
    .on('error', onError)
    .on('end', onEnd)
    .on('headers', onHeaders)
    .on('file', onFile)
    .on('stream', onStream)
    .pipe(res);

    sendStream.on('close', function () {
      var duration = new Date() - startTime;
      var values = extractValues('canceled', duration);

      Download.create(values);
    });

    return sendStream;
  }

  return createSendStream;
};
