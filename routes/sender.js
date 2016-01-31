'use strict';

const send = require('send');
const mime = require('mime-types')
const statsExtractor = require('../lib/stats_extractor');

module.exports = function sender(config, models) {
  var Download = models.Download;
  var File = models.File;

  function createSendStream(req, res) {
    var exctractStatistics = statsExtractor(req, res);

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

      createDownloadEntry(fileStat, transferState, duration);
    }

    function createDownloadEntry(fileStat, transferState, duration) {
      return createFileEntry(fileStat)
      .then((file) => {
        let values = exctractStatistics(transferState, duration, sentBytes);
        return file.downloads().create(values);
      });
    }

    function createFileEntry(fileStat) {
      return File.firstOrCreate({ path: req.path }, {
        size: fileStat.size,
        mime_type: mime.lookup(req.path)
      });
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
      var transferState = 'canceled';

      createDownloadEntry(fileStat, transferState, duration);
    });

    return sendStream;
  }

  return createSendStream;
};
