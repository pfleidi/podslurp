'use strict';

const _ = require('lodash');
const Promise = require('bluebird');

module.exports = function api(config, models) {
  let Download = models.Download;
  let File = models.File;

  function fetchDownloadStats() {
    return Download.stats().fetch()
    .then(function (data) {
      data.attributes.sentBytes = data.attributes.sentBytes || 0;

      return data.attributes;
    });
  }

  function fetchFilesStats() {
    let files = File.stats().fetchAll();

    let mappedFiles = files.then(function (files) {
      return files.map(function (file) {
        return file.attributes;
      });
    });

    return mappedFiles;
  }

  return function (req, res) {
    Promise.all(
      [fetchDownloadStats(), fetchFilesStats()]
    ).then(function (results) {
      let downloadStats = results[0];
      let filesStats = results[1];

      res.json(_.merge(downloadStats, { files: filesStats }));
    });
  };
};
