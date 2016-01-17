'use strict';

const Promise = require('bluebird');
const uuid = require('node-uuid');
const _ = require('lodash');

module.exports = function models(database) {
  let bookshelf = require('bookshelf')(database);

  bookshelf.plugin(require('bookshelf-scopes'));
  bookshelf.plugin('registry')

  /* define base model */
  bookshelf.Model = bookshelf.Model.extend({

    // use created_at and updated_at
    hasTimestamps: true,

    defaults: function () {
      return { id: uuid.v4() };
    }
  }, {
    /* class methods */

    create: function (data, options) {
      return this.forge(data).save(null, options);
    },

    first: function (data, options) {
      options = _.merge({ require: true }, options);

      return this.forge(data).fetch(options);
    },

    firstOrCreate: function (data, options) {
      return this.first(data, options)
      .catch((error) => {
        var allData = _.merge(data, options);
        return this.create(data, options);
      });
    }
  });

  let File = require('./file')(bookshelf);
  let Download = require('./download')(bookshelf);

  function destroyAll() {
    return Download.fetchAll()
    .then(function (downloads) {
      var deletes = downloads.map(function (download) {
        return download.destroy();
      });

      return Promise.all(deletes);
    })
    .then(function () {
      File.fetchAll().then(function (files) {
        var deletes = files.map(function (file) {
          return file.destroy();
        });

        return Promise.all(deletes);
      });
    });
  }

  return {
    destroyAll: destroyAll,
    bookshelf: bookshelf,
    File: File,
    Download: Download
  };
};
