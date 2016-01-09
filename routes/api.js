'use strict';

const _ = require('lodash');
const Promise = require('bluebird');

module.exports = function api(config, models) {
  let Download = models.Download;

  function fetchMetaData() {
    return Download.metaData().fetch().then(function (data) {
      data.attributes.sentBytes = data.attributes.sentBytes || 0;

      return data.attributes;
    });
  }

  function fetchFiles() {
    let files = Download.files().fetchAll();

    let mappedFiles = files.then(function (files) {
      return files.map(function (file) {
        return file.attributes;
      });
    });

    return mappedFiles;
  }

  return function (req, res) {
    Promise.all([fetchMetaData(), fetchFiles()]).then(function (results) {
      let metaData = results[0];
      let filesData = results[1];

      res.json(_.merge(metaData, { files: filesData }));
    });
  };
};
