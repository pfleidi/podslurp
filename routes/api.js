'use strict';

const _ = require('lodash');

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
    fetchMetaData().then(function (allData) {
      fetchFiles().then(function (fileData) {
        res.json(
          _.merge(allData, { files: fileData })
        );
      });
    });
  };
};
