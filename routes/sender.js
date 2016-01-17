'use strict';

const send = require('send');
const mime = require('mime-types')

module.exports = function sender(config, models) {
  var Download = models.Download;
  var File = models.File;

  function createSendStream(req, res) {
    var startTime = new Date();
    var sentBytes = 0;
    var fileStat;

    function onError(err) {
      res.statusCode = err.status || 500;
      var message = 'File not found: ' + req.path;

      return res.end(message);
    }

    function onHeaders(res, path, stat) {
      res.setHeader('Content-Disposition', 'attachment');
    }

    function onFile(path, stat) {
      fileStat = stat;
    }

    function onStream(stream) {
      stream.on('data', function (data) {
        sentBytes += data.length;
      });
    }

    function onEnd() {
      var duration = new Date() - startTime;
      var totalBytes = fileStat.size;

      var transferState = sentBytes === totalBytes ? 'completed' : 'partial';
      var values = extractValues(transferState, duration);

      createDownload(req, fileStat, values);
    }

    function createDownload(req, fileStat, values) {
      return File.firstOrCreate({ path: req.path }, {
        size: fileStat.size,
        mime_type: mime.lookup(req.path)
      })
      .then((file) => {
        return file.downloads().create(values);
      });
    }

    function extractValues(transferState, duration) {
      return {
        transfer_state: transferState,
        transferred_bytes: sentBytes,
        transfer_time: duration,
        response_code: res.statusCode,
        ip_address: req.ip,
        country: '?',
        raw_user_agent: req.headers['user-agent'] || 'unknown',
        parsed_user_agent: '?',
        raw_referrer: req.headers.referrer || 'unknown',
        parsed_referrer: '?'
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

      createDownload(req, fileStat, values);
    });

    return sendStream;
  }

  return createSendStream;
};
