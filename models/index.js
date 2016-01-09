'use strict';

const Promise = require('bluebird');

module.exports = function models(database) {

  var bookshelf = require('bookshelf')(database);
  var Download = require('./download')(bookshelf);

  function destroyAll() {
    return Download.fetchAll().then(function (entries) {
      var deletes = entries.map(function (entry) {
        return entry.destroy();
      });

      return Promise.all(deletes);
    });
  }

  return {
    destroyAll: destroyAll,
    Download: Download
  };
};
