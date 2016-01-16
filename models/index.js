'use strict';

const Promise = require('bluebird');
const uuid = require('node-uuid');

module.exports = function models(database) {
  let bookshelf = require('bookshelf')(database);

  bookshelf.plugin(require('bookshelf-scopes'));

  /* define base model */
  bookshelf.Model = bookshelf.Model.extend({

    // use created_at and updated_at
    hasTimestamps: true,

    defaults: function () {
      return { id: uuid.v4() };
    }
  });

  bookshelf.foo = 'bar';

  let Download = require('./download')(bookshelf);

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
    bookshelf: bookshelf,
    Download: Download
  };
};
